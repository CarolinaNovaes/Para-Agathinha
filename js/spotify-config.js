/* ============================================================
   CONFIGURAÇÃO CENTRAL DO SPOTIFY
   ─────────────────────────────────────────────────────────
   Edite APENAS este arquivo quando tiver as músicas prontas.
   Tudo o resto do site lê daqui.

   COMO PEGAR UM ID DE FAIXA:
   Abra a música no Spotify, clique em "Compartilhar"
   → "Copiar link". O link é tipo:
     https://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh
   O ID é a parte final: 4iV5W9uYEdYUVa79Axb7Rh
   Cole em spotifyId da música correspondente.

   COMO PEGAR O ID DA PLAYLIST (mesma coisa):
   https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M
   O ID é: 37i9dQZF1DXcBWIGoYBM5M
   ============================================================ */

window.SPOTIFY = {

  /* ---------- Playlist da Agatha (a que você tem) ---------- */
  playlist: {
    id:  '',                              // ← cole aqui o ID da playlist da Agatha
    nome: 'nossa playlist',               // ← texto que aparece no botão
  },

  /* ---------- Música de abertura (toca ao abrir o site) ---------- */
  abertura: {
    mp3:  'assets/audio/musica.mp3',      // ← caminho do MP3 (deixe assim se for esse)
    nome: 'música de abertura',           // ← nome exibido
  },

  /* ---------- As 5 faixas das cartas (Top 5 de cada amigo) ---------- */
  /* Cada amigo tem um objeto com 5 músicas.
     Pra cada uma, preencha spotifyId (e opcionalmente linkMp3). */
  amigos: {

    mexicana: {
      nome: 'Mexicana',
      mp3:  'assets/audio/mexicana.mp3',  // ← MP3 da carta (opcional — se vazio, usa a de abertura)
      musicas: [
        { titulo: 'Nome da música 1', artista: 'Artista 1', spotifyId: '' },
        { titulo: 'Nome da música 2', artista: 'Artista 2', spotifyId: '' },
        { titulo: 'Nome da música 3', artista: 'Artista 3', spotifyId: '' },
        { titulo: 'Nome da música 4', artista: 'Artista 4', spotifyId: '' },
        { titulo: 'Nome da música 5', artista: 'Artista 5', spotifyId: '' },
      ],
    },

    pablo: {
      nome: 'Pablo',
      mp3:  'assets/audio/pablo.mp3',
      musicas: [
        { titulo: 'Nome da música 1', artista: 'Artista 1', spotifyId: '' },
        { titulo: 'Nome da música 2', artista: 'Artista 2', spotifyId: '' },
        { titulo: 'Nome da música 3', artista: 'Artista 3', spotifyId: '' },
        { titulo: 'Nome da música 4', artista: 'Artista 4', spotifyId: '' },
        { titulo: 'Nome da música 5', artista: 'Artista 5', spotifyId: '' },
      ],
    },

    purple: {
      nome: 'Purple',
      mp3:  'assets/audio/purple.mp3',
      musicas: [
        { titulo: 'Nome da música 1', artista: 'Artista 1', spotifyId: '' },
        { titulo: 'Nome da música 2', artista: 'Artista 2', spotifyId: '' },
        { titulo: 'Nome da música 3', artista: 'Artista 3', spotifyId: '' },
        { titulo: 'Nome da música 4', artista: 'Artista 4', spotifyId: '' },
        { titulo: 'Nome da música 5', artista: 'Artista 5', spotifyId: '' },
      ],
    },

    carlos: {
      nome: 'Carlos',
      mp3:  'assets/audio/carlos.mp3',
      musicas: [
        { titulo: 'Nome da música 1', artista: 'Artista 1', spotifyId: '' },
        { titulo: 'Nome da música 2', artista: 'Artista 2', spotifyId: '' },
        { titulo: 'Nome da música 3', artista: 'Artista 3', spotifyId: '' },
        { titulo: 'Nome da música 4', artista: 'Artista 4', spotifyId: '' },
        { titulo: 'Nome da música 5', artista: 'Artista 5', spotifyId: '' },
      ],
    },

    vinicius: {
      nome: 'Vinicius',
      mp3:  'assets/audio/vinicius.mp3',
      musicas: [
        { titulo: 'Nome da música 1', artista: 'Artista 1', spotifyId: '' },
        { titulo: 'Nome da música 2', artista: 'Artista 2', spotifyId: '' },
        { titulo: 'Nome da música 3', artista: 'Artista 3', spotifyId: '' },
        { titulo: 'Nome da música 4', artista: 'Artista 4', spotifyId: '' },
        { titulo: 'Nome da música 5', artista: 'Artista 5', spotifyId: '' },
      ],
    },

  },

  /* ---------- Helpers (não mexa) ---------- */
  linkTrack: function (id) {
    return id ? `https://open.spotify.com/track/${id}` : null;
  },
  linkPlaylist: function () {
    return this.playlist.id
      ? `https://open.spotify.com/playlist/${this.playlist.id}`
      : null;
  },
};
