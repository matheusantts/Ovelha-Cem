(function () {
  'use strict';

  function initImageLightbox() {
    const imagens = Array.from(document.querySelectorAll('.imagem-capitulo img'));
    if (!imagens.length) return;

    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML =
      '<button type="button" class="lightbox-fechar" aria-label="Fechar imagem">&times;</button>' +
      '<button type="button" class="lightbox-anterior" aria-label="Imagem anterior">&#8249;</button>' +
      '<figure class="lightbox-figura">' +
        '<img class="lightbox-imagem" src="" alt="" />' +
        '<figcaption class="lightbox-legenda"></figcaption>' +
      '</figure>' +
      '<button type="button" class="lightbox-proxima" aria-label="Próxima imagem">&#8250;</button>' +
      '<span class="lightbox-contador"></span>';
    document.body.appendChild(overlay);

    const imgEl = overlay.querySelector('.lightbox-imagem');
    const legendaEl = overlay.querySelector('.lightbox-legenda');
    const btnFechar = overlay.querySelector('.lightbox-fechar');
    const btnAnterior = overlay.querySelector('.lightbox-anterior');
    const btnProxima = overlay.querySelector('.lightbox-proxima');
    const contador = overlay.querySelector('.lightbox-contador');

    let indiceAtual = -1;

    function atualizarSetas() {
      const multiplas = imagens.length > 1;
      btnAnterior.style.display = multiplas ? '' : 'none';
      btnProxima.style.display = multiplas ? '' : 'none';
    }

    function abrir(indice) {
      indiceAtual = indice;
      const origem = imagens[indice];
      imgEl.src = origem.currentSrc || origem.src;
      imgEl.alt = origem.alt || '';

      /* Título da imagem: o <figcaption> da figura de origem, se houver */
      const legendaOrigem = origem.closest('figure')?.querySelector('figcaption');
      legendaEl.textContent = legendaOrigem ? legendaOrigem.textContent.trim() : '';
      overlay.classList.toggle('tem-legenda', legendaEl.textContent !== '');

      contador.textContent = imagens.length > 1 ? (indice + 1) + ' / ' + imagens.length : '';
      overlay.classList.add('ativo');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.classList.add('lightbox-aberto');
      atualizarSetas();
      btnFechar.focus();
    }

    function fechar() {
      overlay.classList.remove('ativo');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('lightbox-aberto');
      imgEl.src = '';
      indiceAtual = -1;
    }

    function irPara(indice) {
      const novoIndice = (indice + imagens.length) % imagens.length;
      abrir(novoIndice);
    }

    imagens.forEach((img, indice) => {
      img.style.cursor = 'zoom-in';
      img.setAttribute('tabindex', '0');
      img.setAttribute('role', 'button');
      img.setAttribute('aria-label', 'Ampliar imagem');

      img.addEventListener('click', () => abrir(indice));
      img.addEventListener('keydown', (evento) => {
        if (evento.key === 'Enter' || evento.key === ' ') {
          evento.preventDefault();
          abrir(indice);
        }
      });
    });

    btnFechar.addEventListener('click', fechar);
    btnAnterior.addEventListener('click', () => irPara(indiceAtual - 1));
    btnProxima.addEventListener('click', () => irPara(indiceAtual + 1));

    overlay.addEventListener('click', (evento) => {
      if (evento.target === overlay) fechar();
    });

    document.addEventListener('keydown', (evento) => {
      if (!overlay.classList.contains('ativo')) return;
      if (evento.key === 'Escape') fechar();
      if (evento.key === 'ArrowLeft') irPara(indiceAtual - 1);
      if (evento.key === 'ArrowRight') irPara(indiceAtual + 1);
    });

    let toqueInicialX = 0;
    overlay.addEventListener('touchstart', (evento) => {
      toqueInicialX = evento.changedTouches[0].clientX;
    }, { passive: true });

    overlay.addEventListener('touchend', (evento) => {
      if (imagens.length <= 1) return;
      const toqueFinalX = evento.changedTouches[0].clientX;
      const diferenca = toqueFinalX - toqueInicialX;
      if (Math.abs(diferenca) > 50) {
        irPara(diferenca > 0 ? indiceAtual - 1 : indiceAtual + 1);
      }
    }, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initImageLightbox);
  } else {
    initImageLightbox();
  }
})();
