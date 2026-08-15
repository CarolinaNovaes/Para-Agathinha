/* ============================================================
   PLAYER DE ÁUDIO — usado em todas as páginas
   ============================================================ */

(() => {
  'use strict';

  const audio  = document.getElementById('player-audio');
  const botao  = document.getElementById('player-botao');
  const player = document.querySelector('.player');
  const rotulo = document.getElementById('player-rotulo');
  if (!audio || !botao) return;

  let tentandoTocar = false;

  async function alternar() {
    if (tentandoTocar) return;
    tentandoTocar = true;
    try {
      if (audio.paused) {
        audio.volume = 0;
        await audio.play();
        player.classList.add('tocando');
        botao.setAttribute('aria-pressed', 'true');
        botao.setAttribute('aria-label', 'Pausar música');
        if (rotulo) rotulo.textContent = 'tocando';
        subirVolume();
      } else {
        audio.pause();
        player.classList.remove('tocando');
        botao.setAttribute('aria-pressed', 'false');
        botao.setAttribute('aria-label', 'Tocar música');
        if (rotulo) rotulo.textContent = 'música';
      }
    } catch (err) {
      console.warn('Não foi possível tocar o áudio:', err);
    } finally {
      tentandoTocar = false;
    }
  }

  function subirVolume() {
    const alvo = 0.6;
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
})();
