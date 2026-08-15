/* ============================================================
   PÁGINAS DE AMIGO — animações
   - Contadores que sobem
   - Top 5 com entrada em cascata
   - Cards de momentos com fade-in
   - Player de música
   ============================================================ */

(() => {
  'use strict';

  // ----------------------------------------------------------
  // Contadores animados (efeito "subindo" tipo Wrapped)
  // ----------------------------------------------------------
  function animarContadores() {
    const contadores = document.querySelectorAll('[data-contador]');
    contadores.forEach(el => {
      const alvo = parseInt(el.dataset.contador, 10);
      if (isNaN(alvo)) return;

      const duracao = parseInt(el.dataset.duracao, 10) || 2000;
      const inicio  = performance.now();

      function atualizar(agora) {
        const progresso = Math.min((agora - inicio) / duracao, 1);
        const eased = 1 - Math.pow(1 - progresso, 3);
        const valor = Math.floor(eased * alvo);
        el.textContent = valor.toLocaleString('pt-BR');
        if (progresso < 1) requestAnimationFrame(atualizar);
        else el.textContent = alvo.toLocaleString('pt-BR');
      }

      const obs = new IntersectionObserver((entradas) => {
        if (entradas[0].isIntersecting) {
          obs.disconnect();
          requestAnimationFrame(atualizar);
        }
      }, { threshold: 0.3 });
      obs.observe(el);
    });
  }

  // ----------------------------------------------------------
  // Top 5 músicas — entrada em cascata
  // ----------------------------------------------------------
  function animarTopMusicas() {
    const musicas = document.querySelectorAll('.top-musica');
    const obs = new IntersectionObserver((entradas) => {
      if (entradas[0].isIntersecting) {
        musicas.forEach((m, idx) => {
          setTimeout(() => m.classList.add('top-musica--visivel'), idx * 150);
        });
        obs.disconnect();
      }
    }, { threshold: 0.2 });
    if (musicas.length) obs.observe(musicas[0]);
  }

  // ----------------------------------------------------------
  // Momentos marcantes — fade em cascata
  // ----------------------------------------------------------
  function animarMomentos() {
    const cards = document.querySelectorAll('.momento-card');
    cards.forEach((card, idx) => {
      const obs = new IntersectionObserver((entradas) => {
        if (entradas[0].isIntersecting) {
          setTimeout(() => card.classList.add('momento-card--visivel'), idx * 120);
          obs.disconnect();
        }
      }, { threshold: 0.2 });
      obs.observe(card);
    });
  }

  // ----------------------------------------------------------
  // Revelação genérica por scroll
  // ----------------------------------------------------------
  function observarRevelacoes() {
    const elementos = document.querySelectorAll(
      '.amigo-secao__cabecalho, .amigo-carta, .playlist-spotify, .amigo-galeria, .amigo-videos, .amigo-encerramento__frase, .livro-container, .video-cards'
    );
    elementos.forEach(el => el.classList.add('revelar'));
    const obs = new IntersectionObserver((entradas) => {
      entradas.forEach(entrada => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add('revelar--visivel');
          obs.unobserve(entrada.target);
        }
      });
    }, { threshold: 0.15 });
    elementos.forEach(el => obs.observe(el));
  }

  // ----------------------------------------------------------
  // Carrega fotos com fallback pro placeholder
  // ----------------------------------------------------------
  function carregarFotos() {
    const figuras = document.querySelectorAll('.amigo-foto[data-foto]');
    figuras.forEach(figura => {
      const src = figura.dataset.foto;
      if (!src) return;
      const img = figura.querySelector('.amigo-foto__img');
      const placeholder = figura.querySelector('.amigo-foto__placeholder');
      if (!img) return;

      const teste = new Image();
      teste.onload = () => {
        img.src = src;
        img.style.display = 'block';
        img.style.opacity = '0';
        img.style.transition = 'opacity 1.2s ease';
        requestAnimationFrame(() => requestAnimationFrame(() => { img.style.opacity = '1'; }));
        if (placeholder) placeholder.style.display = 'none';
      };
      teste.onerror = () => { /* mantém placeholder */ };
      teste.src = src;
    });
  }

  // ----------------------------------------------------------
  // Nav topo fixo
  // ----------------------------------------------------------
  function criarNav() {
    const base = document.body.dataset.amigo ? '../../' : '';
    const nav = document.createElement('nav');
    nav.className = 'nav-topo';
    nav.setAttribute('aria-label', 'Navegação principal');
    nav.innerHTML = `
      <a class="nav-topo__link" href="${base}index.html">Home</a>
      <a class="nav-topo__link" href="${base}index.html#portas">Portas</a>
    `;
    document.body.prepend(nav);
  }

  // ----------------------------------------------------------
  // Inicialização
  // ----------------------------------------------------------
  function init() {
    criarNav();
    animarContadores();
    animarTopMusicas();
    animarMomentos();
    observarRevelacoes();
    carregarFotos();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
