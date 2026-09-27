/* ================================================================
   OVELHA CEM — index.js

   O que este arquivo faz:
   1. Controla o slider (troca de slides)
   2. Sincroniza as thumbnails com o slide atual
   3. Avança automaticamente (autoplay)
   4. Controla o menu hamburguer no mobile

   Boas práticas aplicadas:
   - Código separado por seções com comentários
   - Funções pequenas com responsabilidade única
   - Sem dependências externas (JavaScript puro)
   - Acessibilidade: teclado e toque (touch/swipe)
================================================================ */


/* ================================================================
   AGUARDA O HTML carregar completamente antes de executar.
   Isso evita erros de "elemento não encontrado".
================================================================ */
document.addEventListener('DOMContentLoaded', function () {


    /* ==============================================================
       SEÇÃO 1 — REFERÊNCIAS AOS ELEMENTOS DO HTML
       Aqui buscamos os elementos uma só vez e guardamos em variáveis.
       É mais eficiente do que buscar várias vezes com querySelector.
    ============================================================== */

    const slides      = document.querySelectorAll('.slide');        // Todos os slides
    const thumbs      = document.querySelectorAll('.thumb-item');   // Todas as thumbnails
    const btnNext     = document.getElementById('btnNext');         // Botão "próximo" >
    const btnBack     = document.getElementById('btnBack');         // Botão "anterior" <
    const navToggle   = document.getElementById('navToggle');       // Botão hamburguer
    const navLinks    = document.getElementById('navLinks');        // Menu de links (mobile)


    /* ==============================================================
       SEÇÃO 2 — ESTADO DO SLIDER
       Guardamos qual slide está ativo em uma variável.
       Toda mudança de slide passa por aqui.
    ============================================================== */

    let slideAtual = 0;                     // Índice do slide visível (começa no 0)
    const totalSlides = slides.length;      // Quantidade total de slides
    let autoplayTimer = null;               // Referência ao timer do autoplay


    /* ==============================================================
       SEÇÃO 3 — FUNÇÃO PRINCIPAL: ir para um slide específico
       Recebe o índice do slide desejado e faz a transição.
    ============================================================== */

    function irParaSlide(indice) {

        /* --- Remove a classe 'active' do slide e thumb atuais --- */
        slides[slideAtual].classList.remove('active');
        thumbs[slideAtual].classList.remove('active');

        /* --- Atualiza o índice com navegação circular ---
           O operador % (módulo) faz o carrossel "dar a volta":
           - Se indice = 5 e totalSlides = 5 → 5 % 5 = 0 (volta ao início)
           - Se indice = -1: somamos totalSlides antes → (-1 + 5) % 5 = 4 (vai para o último)
        */
        slideAtual = ((indice % totalSlides) + totalSlides) % totalSlides;

        /* --- Ativa o novo slide e a nova thumbnail --- */
        slides[slideAtual].classList.add('active');
        thumbs[slideAtual].classList.add('active');

        /*
            A animação CSS é controlada pelas classes .active nos slides.
            Quando 'active' é adicionado, os elementos .slide-title, .slide-desc, etc.
            recebem a animação 'slideUp' definida no CSS.

            IMPORTANTE: para a animação reiniciar ao trocar de slide,
            os elementos filhos ficam com opacity:0 e a animação só roda
            enquanto o slide tem a classe .active.
        */

        /* --- Garante que a thumbnail ativa fique visível (scroll horizontal) --- */
        thumbs[slideAtual].scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
        });
    }


    /* ==============================================================
       SEÇÃO 4 — AUTOPLAY
       Avança o slide automaticamente a cada X segundos.
       O timer é reiniciado toda vez que o usuário navega manualmente,
       para não "cortar" logo depois de uma ação do usuário.
    ============================================================== */

    const INTERVALO_AUTOPLAY = 10000; // 10 segundos — altere conforme quiser

    function iniciarAutoplay() {
        /* Limpa qualquer timer anterior antes de criar um novo */
        clearInterval(autoplayTimer);

        autoplayTimer = setInterval(function () {
            irParaSlide(slideAtual + 1); // Vai para o próximo slide
        }, INTERVALO_AUTOPLAY);
    }

    /* Inicia o autoplay quando a página carrega */
    iniciarAutoplay();


    /* ==============================================================
       SEÇÃO 5 — EVENTOS DOS BOTÕES DE NAVEGAÇÃO (SETAS)
    ============================================================== */

    btnNext.addEventListener('click', function () {
        irParaSlide(slideAtual + 1);
        iniciarAutoplay(); // Reinicia o timer ao clicar manualmente
    });

    btnBack.addEventListener('click', function () {
        irParaSlide(slideAtual - 1);
        iniciarAutoplay();
    });


    /* ==============================================================
       SEÇÃO 6 — EVENTOS DAS THUMBNAILS (MINIATURAS)
       Cada thumbnail clicada leva ao slide correspondente.
    ============================================================== */

    thumbs.forEach(function (thumb) {
        thumb.addEventListener('click', function () {
            /*
                O atributo data-index no HTML define qual slide cada thumbnail controla.
                Exemplo: <div class="thumb-item" data-index="2">
                parseInt() converte o texto "2" para o número 2.
            */
            const indiceDestino = parseInt(thumb.dataset.index);
            irParaSlide(indiceDestino);
            iniciarAutoplay();
        });
    });


    /* ==============================================================
       SEÇÃO 7 — NAVEGAÇÃO POR TECLADO (ACESSIBILIDADE)
       Permite usar as setas do teclado para navegar no slider.
    ============================================================== */

    document.addEventListener('keydown', function (evento) {
        if (evento.key === 'ArrowRight' || evento.key === 'ArrowDown') {
            irParaSlide(slideAtual + 1);
            iniciarAutoplay();
        }

        if (evento.key === 'ArrowLeft' || evento.key === 'ArrowUp') {
            irParaSlide(slideAtual - 1);
            iniciarAutoplay();
        }
    });


    /* ==============================================================
       SEÇÃO 8 — NAVEGAÇÃO POR TOQUE (SWIPE) PARA MOBILE
       Detecta o gesto de deslizar o dedo na tela.
    ============================================================== */

    let touchStartX = 0; // Posição X quando o dedo encosta na tela
    let touchEndX   = 0; // Posição X quando o dedo sai da tela

    const slider = document.getElementById('slider');

    slider.addEventListener('touchstart', function (evento) {
        /* Guarda a posição inicial do toque */
        touchStartX = evento.changedTouches[0].screenX;
    }, { passive: true }); // passive:true melhora a performance do scroll

    slider.addEventListener('touchend', function (evento) {
        /* Guarda a posição final do toque */
        touchEndX = evento.changedTouches[0].screenX;
        processarSwipe();
    }, { passive: true });

    function processarSwipe() {
        const diferenca = touchStartX - touchEndX;
        const LIMIAR_SWIPE = 50; // Pixels mínimos para considerar um swipe (evita cliques acidentais)

        if (diferenca > LIMIAR_SWIPE) {
            /* Deslizou para a ESQUERDA → próximo slide */
            irParaSlide(slideAtual + 1);
            iniciarAutoplay();
        } else if (diferenca < -LIMIAR_SWIPE) {
            /* Deslizou para a DIREITA → slide anterior */
            irParaSlide(slideAtual - 1);
            iniciarAutoplay();
        }
        /* Se a diferença for menor que o limiar, não faz nada (foi um clique/tap) */
    }


    /* ==============================================================
       SEÇÃO 9 — MENU HAMBURGUER (MOBILE)
       Alterna a visibilidade do menu de navegação em telas pequenas.
    ============================================================== */

    navToggle.addEventListener('click', function () {
        /* Toggle adiciona/remove a classe 'open' no botão e no menu */
        navToggle.classList.toggle('open');
        navLinks.classList.toggle('open');

        /* Acessibilidade: informa leitores de tela se o menu está aberto ou fechado */
        const estaAberto = navLinks.classList.contains('open');
        navToggle.setAttribute('aria-expanded', estaAberto);
    });

    /* Fecha o menu ao clicar em qualquer link (evita ficar aberto após navegar) */
    navLinks.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            navToggle.classList.remove('open');
            navLinks.classList.remove('open');
            navToggle.setAttribute('aria-expanded', false);
        });
    });

    /* Fecha o menu ao redimensionar para desktop (evita menu aberto ao girar o celular) */
    window.addEventListener('resize', function () {
        if (window.innerWidth > 640) {
            navToggle.classList.remove('open');
            navLinks.classList.remove('open');
            navToggle.setAttribute('aria-expanded', false);
        }
    });


    /* ==============================================================
       SEÇÃO 10 — PAUSA DO AUTOPLAY AO SAIR DA ABA
       Economiza recursos quando o usuário muda de aba do navegador.
    ============================================================== */

    document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
            clearInterval(autoplayTimer); // Para o timer ao sair da aba
        } else {
            iniciarAutoplay();            // Retoma ao voltar para a aba
        }
    });


}); /* Fim do DOMContentLoaded */


/* ================================================================
   COMO ADICIONAR UM NOVO SLIDE — RESUMO RÁPIDO:

   1. No HTML (index.html):
      a) Copie um bloco <div class="slide"> e cole antes de </div> (fim .slider-list)
      b) Troque a imagem/placeholder, o .slide-label, .slide-title e .slide-desc
      c) Copie um <div class="thumb-item"> em .slider-thumbs
      d) Defina data-index com o próximo número da sequência
      e) Troque a imagem/placeholder e o <h3> da thumbnail

   2. O JavaScript não precisa de alteração — ele conta
      os slides e thumbnails automaticamente com .querySelectorAll()
================================================================ */
