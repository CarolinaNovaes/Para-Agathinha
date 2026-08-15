/* ============================================================
   PARA AGATHA — script principal
   Princípio: cada animação tem motivo. Nenhuma é decorativa.
   ============================================================ */

(() => {
  'use strict';

  // ----------------------------------------------------------
  // 1) ABERTURA — digita a frase, espera o toque pra sair
  // ----------------------------------------------------------
  const abertura   = document.getElementById('abertura');
  const tituloEl   = document.getElementById('abertura-titulo');
  const fraseAbertura = 'Pra você, Agatha.';

  // Digita letra por letra, como se alguém estivesse hesitando
  function digitar(texto, elemento, velocidade = 110) {
    return new Promise((resolve) => {
      let i = 0;
      elemento.textContent = '';
      const timer = setInterval(() => {
        elemento.textContent += texto[i];
        i++;
        if (i >= texto.length) {
          clearInterval(timer);
          resolve();
        }
      }, velocidade);
    });
  }

  async function iniciarAbertura() {
    await digitar(fraseAbertura, tituloEl, 130);
    // Aguarda o usuário tocar/clique em qualquer lugar
    const sair = () => {
      abertura.classList.add('abertura--saindo');
      document.body.classList.add('aberto');
      // Libera o scroll depois da transição
      setTimeout(() => {
        abertura.removeEventListener('click', sair);
        abertura.removeEventListener('touchstart', sair);
        document.removeEventListener('keydown', sair);
      }, 1500);
    };
    abertura.addEventListener('click', sair, { once: true });
    abertura.addEventListener('touchstart', sair, { once: true, passive: true });
    document.addEventListener('keydown', sair, { once: true });
  }

  // Só inicia depois da página carregar (fontes inclusive)
  window.addEventListener('load', () => {
    setTimeout(iniciarAbertura, 600);
  });

  // ----------------------------------------------------------
  // 2) REVELAR POR SCROLL — fade suave com IntersectionObserver
  // ----------------------------------------------------------
  // Tudo que tem .revelar entra em cena quando 15% aparece na tela.
  // A carta, as memórias, a galeria, o encerramento — todos.
  function observarRevelacoes() {
    const candidatos = document.querySelectorAll(
      '#carta, .memoria, .galeria__item, .encerramento__foto-grupo, .encerramento__frase, .encerramento__rodape, .secao__cabecalho'
    );

    candidatos.forEach((el) => el.classList.add('revelar'));

    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            // Pequeno atraso escalonado quando há vizinhos do mesmo grupo
            const idx = Array.from(entrada.target.parentElement?.children ?? []).indexOf(entrada.target);
            const atraso = Math.max(0, idx) * 80;
            setTimeout(() => entrada.target.classList.add('revelar--visivel'), atraso);
            observador.unobserve(entrada.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );

    candidatos.forEach((el) => observador.observe(el));
  }

  // ----------------------------------------------------------
  // 3) CARTA — digita parágrafo a parágrafo quando aparece
  // ----------------------------------------------------------
  function prepararCarta() {
    const paragrafos = document.querySelectorAll('#carta-corpo p');
    // Limpa o texto (será reescrito pela digitação)
    paragrafos.forEach((p) => {
      p.dataset.textoOriginal = p.dataset.texto || p.textContent.trim();
      p.textContent = '';
    });

    let paragrafoIdx = 0;
    function digitarProximo() {
      if (paragrafoIdx >= paragrafos.length) return;
      const p = paragrafos[paragrafoIdx];
      p.classList.add('digitando');
      const texto = p.dataset.textoOriginal;
      let charIdx = 0;
      const timer = setInterval(() => {
        p.textContent += texto[charIdx];
        charIdx++;
        if (charIdx >= texto.length) {
          clearInterval(timer);
          p.classList.remove('digitando');
          paragrafoIdx++;
          // Pausa entre parágrafos (mais longa) e dentro do parágrafo (mais curta)
          setTimeout(digitarProximo, 700);
        }
      }, 55);
    }

    // Dispara quando a carta entra em vista
    const carta = document.getElementById('carta');
    const observador = new IntersectionObserver(
      (entradas) => {
        if (entradas[0].isIntersecting) {
          observador.disconnect();
          // Começa quando o fade-in já tiver começado
          setTimeout(digitarProximo, 1200);
        }
      },
      { threshold: 0.3 }
    );
    observador.observe(carta);
  }

  // ----------------------------------------------------------
  // 4) FOTOS — carrega a partir do atributo data-foto
  //    Se o arquivo não existir, mantém o placeholder visível.
  //    Quando carregar, faz fade-in lento e esconde o placeholder.
  // ----------------------------------------------------------
  function carregarFotos() {
    const containers = document.querySelectorAll('[data-foto]');
    containers.forEach((container) => {
      const src = container.dataset.foto;
      if (!src) return;
      const img = container.querySelector('img');
      const placeholder = container.querySelector(
        '.memoria__foto-placeholder, .galeria__placeholder, .encerramento__placeholder'
      );
      if (!img) return;

      // Testa se a imagem existe antes de mostrar
      const teste = new Image();
      teste.onload = () => {
        img.src = src;
        img.alt = container.dataset.alt || '';
        img.style.display = 'block';
        img.style.opacity = '0';
        img.style.transition = 'opacity 1.2s ease';
        // Fade-in
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            img.style.opacity = '1';
          });
        });
        if (placeholder) placeholder.style.display = 'none';
      };
      teste.onerror = () => {
        // Mantém o placeholder, mais nada a fazer
      };
      teste.src = src;
    });
  }

  // ----------------------------------------------------------
  // 5) ENCERRAMENTO — digita a frase final
  // ----------------------------------------------------------
  function prepararEncerramento() {
    const fraseEl = document.getElementById('encerramento-frase');
    if (!fraseEl) return;
    const textoFinal = fraseEl.dataset.texto || '';
    fraseEl.textContent = '';

    const encerr = document.getElementById('encerramento');
    const observador = new IntersectionObserver(
      (entradas) => {
        if (entradas[0].isIntersecting) {
          observador.disconnect();
          setTimeout(() => {
            digitar(textoFinal, fraseEl, 90).then(() => {
              // Remove o cursor piscante depois
              fraseEl.style.setProperty('--sem-cursor', '1');
            });
          }, 1500);
        }
      },
      { threshold: 0.4 }
    );
    observador.observe(encerr);
  }

  // ----------------------------------------------------------
  // 6) PLAYER DE ÁUDIO — discreto, sem autoplay agressivo
  // ----------------------------------------------------------
  function prepararPlayer() {
    const audio   = document.getElementById('player-audio');
    const botao   = document.getElementById('player-botao');
    const player  = document.querySelector('.player');
    const rotulo  = document.getElementById('player-rotulo');
    if (!audio || !botao) return;

    let tentandoTocar = false;

    async function alternar() {
      if (tentandoTocar) return;
      tentandoTocar = true;
      try {
        if (audio.paused) {
          // Fade-in de volume começando baixo
          audio.volume = 0;
          await audio.play();
          player.classList.add('tocando');
          botao.setAttribute('aria-pressed', 'true');
          botao.setAttribute('aria-label', 'Pausar música');
          if (rotulo) rotulo.textContent = 'tocando';
          // Sobe o volume devagar
          subirVolume();
        } else {
          audio.pause();
          player.classList.remove('tocando');
          botao.setAttribute('aria-pressed', 'false');
          botao.setAttribute('aria-label', 'Tocar música');
          if (rotulo) rotulo.textContent = 'música';
        }
      } catch (err) {
        // Se o navegador bloquear, pede interação
        console.warn('Não foi possível tocar o áudio:', err);
      } finally {
        tentandoTocar = false;
      }
    }

    function subirVolume() {
      const alvo = 0.6; // volume final suave, não invasivo
      const passo = 0.02;
      const intervalo = setInterval(() => {
        if (audio.paused || audio.volume >= alvo) {
          clearInterval(intervalo);
          return;
        }
        audio.volume = Math.min(alvo, audio.volume + passo);
      }, 200);
    }

    botao.addEventListener('click', alternar);
  }

  // ----------------------------------------------------------
  // 7) PARALLAX SUTIL — só nas figuras de memória, e bem leve
  // ----------------------------------------------------------
  function parallaxSutil() {
    // Só ativa em telas grandes e se o usuário não pediu menos movimento
    const reduzirMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduzirMovimento) return;
    if (window.innerWidth < 768) return;

    const figuras = document.querySelectorAll('.memoria__figura');
    let ticking = false;

    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            figuras.forEach((fig) => {
              const rect = fig.getBoundingClientRect();
              const centroTela = window.innerHeight / 2;
              const dist = (rect.top + rect.height / 2 - centroTela) * 0.02;
              fig.style.setProperty('--deslocamento', `${dist}px`);
            });
            ticking = false;
          });
          ticking = true;
        }
      },
      { passive: true }
    );
  }

  // ----------------------------------------------------------
  // Inicialização
  // ----------------------------------------------------------
  function init() {
    observarRevelacoes();
    prepararCarta();
    prepararEncerramento();
    carregarFotos();
    prepararPlayer();
    parallaxSutil();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
