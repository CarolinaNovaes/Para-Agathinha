/* ============================================================
   SPOTIFY — botões e links
   - Home: botão "Abrir playlist no Spotify"
   - Cartas: botão "Ouvir no Spotify" em cada faixa do Top 5
             + botão grande no final da carta
   ============================================================ */

(() => {
  'use strict';
  if (!window.SPOTIFY) return;

  /* ---------- Cria um botão "Ouvir no Spotify" ---------- */
  function botaoSpotify(url, texto, classe) {
    if (!url) return ''; // sem ID = sem botão
    return `
      <a href="${url}" target="_blank" rel="noopener" class="spotify-btn ${classe || ''}">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" fill="currentColor"/>
        </svg>
        <span>${texto || 'ouvir no spotify'}</span>
      </a>
    `;
  }

  /* ---------- HOME: botão "Abrir playlist" ---------- */
  function injetarBotaoHome() {
    const container = document.querySelector('.etapa__conteudo--amigos');
    if (!container) return;
    if (container.querySelector('.spotify-playlist')) return; // já existe

    const url = window.SPOTIFY.linkPlaylist();
    if (!url) return; // sem ID da playlist = não mostra

    const bloco = document.createElement('div');
    bloco.className = 'spotify-playlist';
    bloco.innerHTML = `
      <p class="spotify-playlist__olho">e no spotify</p>
      ${botaoSpotify(url, 'abrir a playlist no spotify', 'spotify-btn--destaque')}
    `;
    container.appendChild(bloco);
  }

  /* ---------- CARTAS: botões no Top 5 + botão final ---------- */
  function injetarBotoesCarta() {
    const body = document.body;
    const amigoSlug = body.dataset.amigo; // esperado: "mexicana", "pablo", etc.
    if (!amigoSlug) return;
    const config = window.SPOTIFY.amigos?.[amigoSlug];
    if (!config) return;

    /* 1) Botão em cada faixa do Top 5 */
    const itens = document.querySelectorAll('.top-musica');
    itens.forEach((item, idx) => {
      const musica = config.musicas[idx];
      if (!musica) return;
      const url = window.SPOTIFY.linkTrack(musica.spotifyId);

      // injeta o nome/artista a partir do config (se vazio no HTML)
      const tituloEl = item.querySelector('.top-musica__titulo');
      const artistaEl = item.querySelector('.top-musica__artista');
      if (tituloEl && musica.titulo && /^Nome da m/i.test(tituloEl.textContent.trim())) {
        tituloEl.textContent = musica.titulo;
      }
      if (artistaEl && musica.artista && /^Artista/i.test(artistaEl.textContent.trim())) {
        artistaEl.textContent = musica.artista;
      }

      // injeta o botão "ouvir no spotify"
      if (url && !item.querySelector('.spotify-btn')) {
        const slot = document.createElement('div');
        slot.className = 'top-musica__spotify';
        slot.innerHTML = botaoSpotify(url, 'ouvir no spotify', 'spotify-btn--compacto');
        item.appendChild(slot);
      }
    });

    /* 2) Botão grande no final da carta, antes do encerramento */
    const urlPlaylist = window.SPOTIFY.linkPlaylist();
    const encerramento = document.querySelector('.amigo-encerramento');
    if (encerramento && urlPlaylist && !document.querySelector('.spotify-playlist--amigo')) {
      const bloco = document.createElement('div');
      bloco.className = 'spotify-playlist spotify-playlist--amigo';
      bloco.innerHTML = `
        <p class="spotify-playlist__olho">pra ouvir tudo</p>
        ${botaoSpotify(urlPlaylist, 'abrir a playlist no spotify', 'spotify-btn--destaque')}
      `;
      encerramento.parentNode.insertBefore(bloco, encerramento);
    }
  }

  /* ---------- Troca o MP3 do player quando a carta abre ---------- */
  function trocarMp3Carta() {
    const audio = document.getElementById('player-audio');
    if (!audio) return;

    const amigoSlug = document.body.dataset.amigo;
    const config = amigoSlug && window.SPOTIFY.amigos?.[amigoSlug];
    const novoSrc = (config && config.mp3) || window.SPOTIFY.abertura?.mp3;
    if (!novoSrc) return;

    // caminho relativo depende de onde a página está
    // home: assets/audio/...  |  carta: ../../assets/audio/...
    const prefixo = amigoSlug ? '../../' : '';
    const srcFinal = prefixo + novoSrc;

    if (audio.currentSrc && audio.currentSrc.endsWith(novoSrc.split('/').pop())) return;

    const source = audio.querySelector('source');
    if (source) source.setAttribute('src', srcFinal);
    audio.load();
  }

  /* ---------- Init ---------- */
  function init() {
    injetarBotaoHome();
    injetarBotoesCarta();
    trocarMp3Carta();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
