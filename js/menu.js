/* ============================================================
   MENU — orquestra as tres etapas
   ============================================================ */

(() => {
  'use strict';

  const TEXTO_INTRODUCAO = [
    'Bem-vinda, Agatha.',
    'Este lugar foi feito por 3 pessoas que te amam de jeitos diferentes, mas com a mesma intensidade.',
    'Abaixo, três portas. Cada uma leva a um mundo. Mundos estes que nos ligam a você de alguma forma.',
    'Não tem ordem certa. Abre a que te chamar.'
  ];

  const overlay  = document.getElementById('transicao-overlay');
  const btnVoltar = document.getElementById('btn-voltar-intro');

  // ----------------------------------------------------------
  // Utilitario: digita texto letra por letra
  // ----------------------------------------------------------
  function digitar(texto, elemento, velocidade = 65) {
    return new Promise((resolve) => {
      let i = 0;
      elemento.textContent = '';
      const timer = setInterval(() => {
        elemento.textContent += texto[i];
        i++;
        if (i >= texto.length) { clearInterval(timer); resolve(); }
      }, velocidade);
    });
  }

  // ----------------------------------------------------------
  // Transicao entre etapas
  // ----------------------------------------------------------
  function irPara(etapaAtual, callbackProxima) {
    return new Promise(resolve => {
      etapaAtual.classList.add('etapa--saindo');
      setTimeout(() => {
        etapaAtual.classList.remove('etapa--ativa', 'etapa--saindo');
        resolve();
        if (callbackProxima) callbackProxima();
      }, 1200);
    });
  }

  // ----------------------------------------------------------
  // Etapa 1 — "Feito com Amor"
  // ----------------------------------------------------------
  async function etapa1() {
    const etapa  = document.getElementById('etapa-1');
    const titulo = document.getElementById('titulo-1');

    await new Promise(r => setTimeout(r, 700));
    etapa.classList.add('etapa--ativa');
    await digitar('Feito com Amor', titulo, 180);
    titulo.classList.add('sem-cursor');

    await new Promise(r => setTimeout(r, 1800));
    await irPara(etapa, () => etapa2());
  }

  // ----------------------------------------------------------
  // Etapa 2 — Introducao
  // ----------------------------------------------------------
  async function etapa2() {
    const etapa     = document.getElementById('etapa-2');
    const container = document.getElementById('introducao-texto');
    const botao     = document.getElementById('btn-continuar');

    // Reseta caso seja segunda visita (usuario voltou da etapa 3)
    container.innerHTML = '';
    botao.classList.remove('etapa__avancar--visivel');

    etapa.classList.add('etapa--ativa');

    // Cria paragrafos e digita um a um
    TEXTO_INTRODUCAO.forEach(() => {
      const p = document.createElement('p');
      container.appendChild(p);
    });
    const paragrafos = container.querySelectorAll('p');

    for (let i = 0; i < TEXTO_INTRODUCAO.length; i++) {
      paragrafos[i].classList.add('digitando');
      await digitar(TEXTO_INTRODUCAO[i], paragrafos[i], 48);
      paragrafos[i].classList.remove('digitando');
      await new Promise(r => setTimeout(r, 480));
    }

    await new Promise(r => setTimeout(r, 500));
    botao.classList.add('etapa__avancar--visivel');
    botao.addEventListener('click', () => {
      irPara(etapa, () => etapa3());
    }, { once: true });
  }

  // ----------------------------------------------------------
  // Etapa 3 — As portas
  // ----------------------------------------------------------
  async function etapa3(imediato = false) {
    const etapa = document.getElementById('etapa-3');

    etapa.classList.add('etapa--ativa');
    document.body.classList.add('etapa-livre');
    btnVoltar.classList.add('visivel');

    // Anima os items
    const items  = etapa.querySelectorAll('.porta-item');
    const atraso = imediato ? 60 : 200;
    items.forEach((item, idx) => {
      setTimeout(() => item.classList.add('porta-item--visivel'), atraso + idx * 220);
    });
  }

  // ----------------------------------------------------------
  // Botao voltar (etapa 3 -> etapa 2)
  // ----------------------------------------------------------
  btnVoltar.addEventListener('click', () => {
    const etapa3El = document.getElementById('etapa-3');
    if (!etapa3El.classList.contains('etapa--ativa')) return;

    btnVoltar.classList.remove('visivel');
    document.body.classList.remove('etapa-livre');

    // Reseta visibilidade dos cards pra proxima vez
    etapa3El.querySelectorAll('.porta-item').forEach(item => {
      item.classList.remove('porta-item--visivel');
    });

    irPara(etapa3El, () => etapa2());
  });

  // ----------------------------------------------------------
  // Transicao de pagina ao clicar numa porta (delegada, sem acumular)
  // ----------------------------------------------------------
  document.addEventListener('click', (e) => {
    const link = e.target.closest('.porta-link');
    if (!link || !overlay) return;
    e.preventDefault();
    const href = link.getAttribute('href');
    overlay.classList.add('transicao-overlay--ativa');
    setTimeout(() => { window.location.href = href; }, 520);
  });

  // ----------------------------------------------------------
  // Inicializacao
  // ----------------------------------------------------------
  function init() {
    if (location.hash === '#portas') {
      history.replaceState(null, '', location.pathname);
      etapa3(true);
      return;
    }
    etapa1();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
