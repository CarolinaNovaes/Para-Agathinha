/* ============================================================
   AUTOPLAY SUAVE
   - Tenta tocar o áudio sozinho ao carregar a página
   - Se o navegador bloquear (regra de autoplay), mostra um
     convite discreto em vez de ficar mudo
   - Some sozinho assim que o usuário interagir (clique, scroll, tecla)
   ============================================================ */

(() => {
  'use strict';

  const audio  = document.getElementById('player-audio');
  const botao  = document.getElementById('player-botao');
  if (!audio || !botao) return;

  /* ---------- Cria o convite (overlay sutil) ---------- */
  function mostrarConvite() {
    if (document.getElementById('autoplay-convite')) return;

    const convite = document.createElement('button');
    convite.id = 'autoplay-convite';
    convite.type = 'button';
    convite.className = 'autoplay-convite';
    convite.setAttribute('aria-label', 'Tocar música de fundo');
    convite.innerHTML = `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 5v14l11-7z" fill="currentColor" />
      </svg>
      <span>tocar música?</span>
    `;

    convite.addEventListener('click', async () => {
      try {
        audio.volume = 0;
        await audio.play();
        botao.click(); // sincroniza o visual do player
        // volume sobe gradativamente
        const alvo = 0.6;
        const intervalo = setInterval(() => {
          if (audio.paused || audio.volume >= alvo) {
            clearInterval(intervalo);
            return;
          }
          audio.volume = Math.min(alvo, audio.volume + 0.02);
        }, 200);
        sumirConvite(convite);
      } catch (err) {
        // se ainda assim falhar, deixa o convite
        console.warn('Ainda bloqueado:', err);
      }
    });

    document.body.appendChild(convite);

    // entra com transição
    requestAnimationFrame(() => convite.classList.add('autoplay-convite--visivel'));

    // some sozinho depois de 8s se ninguém interagir
    setTimeout(() => sumirConvite(convite), 8000);
  }

  function sumirConvite(convite) {
    if (!convite || !convite.parentNode) return;
    convite.classList.remove('autoplay-convite--visivel');
    setTimeout(() => convite.remove(), 600);
  }

  /* ---------- Tenta o autoplay ---------- */
  async function tentarAutoplay() {
    // só tenta se o player não estiver tocando
    if (!audio.paused) return;
    // só tenta se houver fonte
    if (!audio.querySelector('source')?.getAttribute('src')) return;

    try {
      audio.volume = 0;
      await audio.play();
      // sucesso! sincroniza visual e sobe volume
      if (audio.paused) return; // play() resolveu mas algo parou
      botao.click();
      const alvo = 0.6;
      const intervalo = setInterval(() => {
        if (audio.paused || audio.volume >= alvo) {
          clearInterval(intervalo);
          return;
        }
        audio.volume = Math.min(alvo, audio.volume + 0.02);
      }, 200);
    } catch (err) {
      // navegador bloqueou: mostra convite sutil
      mostrarConvite();
    }
  }

  // espera um pouquinho pra página respirar antes de tentar
  setTimeout(tentarAutoplay, 1200);
})();
