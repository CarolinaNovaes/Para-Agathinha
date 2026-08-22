/* ============================================================
   MENU — orquestra as tres etapas
   ============================================================ */

(() => {
  'use strict';

  const TEXTO_INTRODUCAO = [
    'Bem-vinda, Agatha.',
    'Fizemos este lugar para você.',
    'Várias pessoas, vários jeitos diferentes de te amar e um monte de memórias, carinho e pequenos pedaços da nossa história juntos.',
    'Cada parte deste site guarda algo que quisemos te entregar hoje.',
    'Sem ordem certa.',
    'Só entra, explora e aproveita.',
    'Feliz aniversário. 🤍'
  ];

  const overlay    = document.getElementById('transicao-overlay');
  const navPortas  = document.getElementById('nav-portas-topo');
  const btnVoltar  = document.getElementById('btn-voltar-intro');

  // ----------------------------------------------------------
  // Utilitario: digita texto letra por letra
  // ----------------------------------------------------------
  function digitar(texto, elemento, velocidade) {
    velocidade = velocidade || 48;
    return new Promise(function (resolve) {
      var i = 0;
      elemento.textContent = '';
      var timer = setInterval(function () {
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
    return new Promise(function (resolve) {
      etapaAtual.classList.add('etapa--saindo');
      setTimeout(function () {
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
    var etapa  = document.getElementById('etapa-1');
    var titulo = document.getElementById('titulo-1');

    await new Promise(function (r) { setTimeout(r, 700); });
    etapa.classList.add('etapa--ativa');
    await digitar('Feito com Amor', titulo, 180);
    titulo.classList.add('sem-cursor');

    await new Promise(function (r) { setTimeout(r, 1800); });
    await irPara(etapa, function () { etapa2(); });
  }

  // ----------------------------------------------------------
  // Etapa 2 — Introducao + botao Play
  // ----------------------------------------------------------
  async function etapa2() {
    var etapa     = document.getElementById('etapa-2');
    var container = document.getElementById('introducao-texto');
    var botao     = document.getElementById('btn-continuar');

    container.innerHTML = '';
    botao.classList.remove('etapa__avancar--visivel');

    etapa.classList.add('etapa--ativa');

    TEXTO_INTRODUCAO.forEach(function () {
      var p = document.createElement('p');
      container.appendChild(p);
    });
    var paragrafos = container.querySelectorAll('p');

    for (var i = 0; i < TEXTO_INTRODUCAO.length; i++) {
      paragrafos[i].classList.add('digitando');
      await digitar(TEXTO_INTRODUCAO[i], paragrafos[i], 44);
      paragrafos[i].classList.remove('digitando');
      await new Promise(function (r) { setTimeout(r, 380); });
    }

    await new Promise(function (r) { setTimeout(r, 400); });
    botao.classList.add('etapa__avancar--visivel');

    botao.addEventListener('click', function () {
      abrirVideo(etapa);
    }, { once: true });
  }

  // ----------------------------------------------------------
  // Video intro fullscreen
  // ----------------------------------------------------------
  function abrirVideo(etapaOrigem) {
    var videoOverlay = document.getElementById('video-intro-overlay');
    var video        = document.getElementById('video-intro');
    var btnFechar    = document.getElementById('btn-fechar-video');

    videoOverlay.classList.add('ativo');
    videoOverlay.removeAttribute('aria-hidden');

    video.play().catch(function () {
      // autoplay bloqueado — vai direto pras portas
      fechar();
    });

    function fechar() {
      video.pause();
      video.currentTime = 0;
      videoOverlay.classList.remove('ativo');
      videoOverlay.setAttribute('aria-hidden', 'true');
      irPara(etapaOrigem, function () { etapa3(); });
    }

    video.addEventListener('ended', fechar, { once: true });
    video.addEventListener('error',  fechar, { once: true });
    btnFechar.addEventListener('click', fechar, { once: true });
  }

  // ----------------------------------------------------------
  // Etapa 3 — As portas
  // ----------------------------------------------------------
  function etapa3(imediato) {
    var etapa = document.getElementById('etapa-3');

    etapa.classList.add('etapa--ativa');
    document.body.classList.add('etapa-livre');
    navPortas.classList.add('visivel');

    var items  = etapa.querySelectorAll('.porta-item');
    var atraso = imediato ? 60 : 200;
    items.forEach(function (item, idx) {
      setTimeout(function () { item.classList.add('porta-item--visivel'); }, atraso + idx * 220);
    });
  }

  // ----------------------------------------------------------
  // Botao voltar (etapa 3 -> etapa 2)
  // ----------------------------------------------------------
  btnVoltar.addEventListener('click', function () {
    var etapa3El = document.getElementById('etapa-3');
    if (!etapa3El.classList.contains('etapa--ativa')) return;

    navPortas.classList.remove('visivel');
    document.body.classList.remove('etapa-livre');

    etapa3El.querySelectorAll('.porta-item').forEach(function (item) {
      item.classList.remove('porta-item--visivel');
    });

    irPara(etapa3El, function () { etapa2(); });
  });

  // ----------------------------------------------------------
  // Transicao de pagina ao clicar numa porta
  // ----------------------------------------------------------
  document.addEventListener('click', function (e) {
    var link = e.target.closest('.porta-link');
    if (!link || !overlay) return;
    e.preventDefault();
    var href = link.getAttribute('href');
    overlay.classList.add('transicao-overlay--ativa');
    setTimeout(function () { window.location.href = href; }, 520);
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
