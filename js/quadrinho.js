/* ============================================================
   QUADRINHO — virada de pagina com suporte a swipe
   ============================================================ */

(() => {
  'use strict';

  const livro   = document.getElementById('livro');
  if (!livro) return;

  const paginas  = Array.from(livro.querySelectorAll('.pagina'));
  const btnPrev  = document.getElementById('livro-prev');
  const btnNext  = document.getElementById('livro-next');
  const contador = document.getElementById('livro-contador');
  const total    = paginas.length;
  let atual      = 0;
  let animando   = false;

  function irPara(novo) {
    if (animando || novo < 0 || novo >= total || novo === atual) return;
    animando = true;

    const pAtual  = paginas[atual];
    const pNovo   = paginas[novo];
    const reverso = novo < atual;

    // Remove classes anteriores
    pAtual.classList.remove('pagina--ativa', 'pagina--saindo', 'reverso');
    pNovo.classList.remove('pagina--ativa', 'pagina--saindo', 'reverso');

    // Inicia animacao
    if (reverso) pAtual.classList.add('reverso');
    pAtual.classList.add('pagina--saindo');

    // Pequeno delay pra garantir que a saida comecou antes da entrada
    requestAnimationFrame(() => {
      if (reverso) pNovo.classList.add('reverso');
      pNovo.classList.add('pagina--ativa');
    });

    // Limpa apos animacao
    const duracao = 520;
    setTimeout(() => {
      pAtual.classList.remove('pagina--saindo', 'reverso');
      pNovo.classList.remove('reverso');
      atual = novo;
      atualizar();
      animando = false;
    }, duracao);
  }

  function atualizar() {
    if (contador) contador.textContent = `${atual + 1} / ${total}`;
    if (btnPrev)  btnPrev.disabled  = atual === 0;
    if (btnNext)  btnNext.disabled  = atual === total - 1;
  }

  // Botoes
  if (btnPrev) btnPrev.addEventListener('click', (e) => { e.stopPropagation(); irPara(atual - 1); });
  if (btnNext) btnNext.addEventListener('click', (e) => { e.stopPropagation(); irPara(atual + 1); });

  // Click no livro avanca (exceto quando clica nos botoes)
  livro.addEventListener('click', () => { if (atual < total - 1) irPara(atual + 1); });

  // Teclado
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') irPara(atual + 1);
    if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   irPara(atual - 1);
  });

  // Swipe touch
  let touchStartX = 0;
  let touchStartY = 0;
  livro.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  livro.addEventListener('touchend', (e) => {
    const dx = touchStartX - e.changedTouches[0].clientX;
    const dy = Math.abs(touchStartY - e.changedTouches[0].clientY);
    if (dy > Math.abs(dx)) return; // scroll vertical, nao e swipe
    if (Math.abs(dx) > 40) irPara(dx > 0 ? atual + 1 : atual - 1);
  }, { passive: true });

  // Estado inicial
  atualizar();
})();
