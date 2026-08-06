/* Revelação por scroll — compartilhada pela LP e pelo instrumento.
   Mesmo desenho da `lp-mentoria-mmm`: IntersectionObserver COM FAILSAFE.
   Sem o failsafe, um observer que não dispara deixa a página em branco, porque
   os blocos nascem com `opacity: 0`. */
(function () {
  'use strict';

  var alvos = document.querySelectorAll('[data-revela]');
  if (!alvos.length) return;

  /* Cascata: cada elemento atrasa conforme a posição entre os IRMÃOS que
     também têm `[data-revela]` — não a posição na página inteira. É o que
     faz badge → título → texto → lista entrarem em sequência dentro de uma
     seção, e os quatro cards de `.diagnostico` entrarem um a um, sem que a
     seção seguinte herde o atraso da anterior (cada grupo de irmãos reinicia
     em 0). PASSO e TETO ficam pequenos de propósito: é ritmo, não espera —
     a v1 já tinha "página densa" como anti-padrão explícito (ver estilo.css). */
  var PASSO_MS = 90;
  var TETO_PASSOS = 5;
  Array.prototype.forEach.call(alvos, function (el) {
    var irmaos = Array.prototype.filter.call(el.parentElement.children, function (irmao) {
      return irmao.hasAttribute('data-revela');
    });
    var indice = Math.min(irmaos.indexOf(el), TETO_PASSOS);
    if (indice > 0) el.style.setProperty('--revela-atraso', (indice * PASSO_MS) + 'ms');
  });

  function revelarTudo() {
    Array.prototype.forEach.call(alvos, function (el) { el.classList.add('dentro'); });
  }

  if (!('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revelarTudo();
    return;
  }

  /* 🔴 O gatilho original (`-10%`) disparava com o TOPO do elemento a só 90%
     da altura da tela — ou seja, ele começava a entrar quase no instante em
     que a primeira fatia dele aparecia lá embaixo. Com uma animação de .3s
     (o valor antigo), a revelação terminava de tocar enquanto o elemento
     ainda estava subindo pela tela: quem rolava via o texto já parado, nunca
     o movimento. `-30%` empurra o gatilho para quando o elemento já cruzou
     bem mais para dentro do viewport, e a duração mais longa em `estilo.css`
     faz o resto: a rolagem some ver o texto assentar, não já assentado. */
  var observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('dentro'); observador.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -30% 0px' });

  Array.prototype.forEach.call(alvos, function (el) { observador.observe(el); });
  setTimeout(revelarTudo, 3000);
})();
