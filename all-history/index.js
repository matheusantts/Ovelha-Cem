/* ================================================================
   OVELHA CEM — index.js (página de lista/feed)

   O que este arquivo faz:
   1. Menu hamburguer (mobile)
   2. Animação de entrada dos itens ao rolar a página (scroll reveal)
   3. Ação dos botões de cada item
================================================================ */

document.addEventListener('DOMContentLoaded', function () {


    /* ==============================================================
       SEÇÃO 1 — MENU HAMBURGUER (MOBILE)
    ============================================================== */

    const navToggle = document.getElementById('navToggle');
    const navLinks  = document.getElementById('navLinks');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function () {
            navToggle.classList.toggle('open');
            navLinks.classList.toggle('open');

            const estaAberto = navLinks.classList.contains('open');
            navToggle.setAttribute('aria-expanded', estaAberto);
        });

        /* Fecha o menu ao clicar em qualquer link */
        navLinks.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                navToggle.classList.remove('open');
                navLinks.classList.remove('open');
                navToggle.setAttribute('aria-expanded', false);
            });
        });

        /* Fecha o menu ao girar para paisagem / ampliar janela */
        window.addEventListener('resize', function () {
            if (window.innerWidth > 480) {
                navToggle.classList.remove('open');
                navLinks.classList.remove('open');
                navToggle.setAttribute('aria-expanded', false);
            }
        });
    }


    /* ==============================================================
       SEÇÃO 2 — ANIMAÇÃO DE ENTRADA DOS ITENS (SCROLL REVEAL)

       Cada .feed-item começa invisível (opacity: 0, translateY: 24px).
       Quando o item entra na tela, recebe a classe .visible
       que dispara a transição CSS.

       A API usada é IntersectionObserver — nativa do navegador,
       sem dependências externas.
    ============================================================== */

    /*
        Injeta o CSS da animação via JavaScript.
        Isso mantém a animação junto à lógica que a controla,
        sem poluir o arquivo CSS com estado dinâmico.
    */
    const style = document.createElement('style');
    style.textContent = `
        .feed-item {
            opacity: 0;
            transform: translateY(24px);
            transition: opacity 0.55s ease, transform 0.55s ease;
        }
        .feed-item.visible {
            opacity: 1;
            transform: translateY(0);
        }
        /* Respeita preferência de acessibilidade */
        @media (prefers-reduced-motion: reduce) {
            .feed-item {
                opacity: 1;
                transform: none;
                transition: none;
            }
        }
    `;
    document.head.appendChild(style);

    /* Seleciona todos os itens da lista */
    const feedItems = document.querySelectorAll('.feed-item');

    /*
        IntersectionObserver: dispara uma função toda vez que
        um elemento entra ou sai da área visível da janela.

        threshold: 0.15 → o item precisa estar 15% visível para animar.
    */
    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                /*
                    Para de observar o item depois que ele apareceu.
                    Isso evita que a animação rode de novo ao rolar para cima.
                */
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15
    });

    /* Aplica o observer em cada item */
    feedItems.forEach(function (item, indice) {
        /*
            Delay escalonado: cada item aparece com um pequeno atraso
            em relação ao anterior, criando um efeito cascata elegante.
            Limitamos a 4 itens (400ms máximo) para não ficar lento
            em listas longas.
        */
        const delayMs = Math.min(indice * 80, 320);
        item.style.transitionDelay = delayMs + 'ms';

        observer.observe(item);
    });


    /* ==============================================================
       SEÇÃO 3 — AÇÃO DOS BOTÕES

       Aqui você conecta cada botão à sua funcionalidade real.
       Por enquanto os botões apenas logam no console —
       substitua o console.log pela sua lógica (ex: redirecionar,
       abrir modal, buscar dados de uma API, etc.)
    ============================================================== */

    /*
        Delegação de eventos:
        Em vez de adicionar um listener em cada botão individualmente,
        escutamos o clique no elemento pai (.feed) e verificamos
        qual botão foi clicado. Isso é mais eficiente e funciona
        mesmo para itens adicionados dinamicamente depois.
    */
    const feed = document.getElementById('feed');

    if (feed) {
        feed.addEventListener('click', function (evento) {
            const botao = evento.target.closest('.btn');
            if (!botao) return; /* Clique não foi em um botão */

            /* Encontra o item pai do botão clicado */
            const item  = botao.closest('.feed-item');
            const titulo = item ? item.querySelector('.feed-title')?.textContent : 'Desconhecido';

            if (botao.classList.contains('btn-primary')) {
                /*
                    BOTÃO "SAIBA MAIS"
                    Substitua o console.log abaixo pela sua ação:
                    - Redirecionar: window.location.href = '/materia/lanciano';
                    - Abrir modal:  abrirModal(titulo);
                    - Buscar dados: fetchMateria(id);
                */
                console.log('Saiba Mais clicado:', titulo);
                alert('Abrindo matéria: ' + titulo); // remova esta linha em produção
            }

            if (botao.classList.contains('btn-secondary')) {
                /*
                    BOTÃO "ACESSAR"
                    Mesma lógica — substitua pela ação correta.
                */
                console.log('Acessar clicado:', titulo);
                alert('Acessando: ' + titulo); // remova esta linha em produção
            }
        });
    }


}); /* Fim do DOMContentLoaded */


/* ================================================================
   COMO ADICIONAR UM NOVO ITEM À LISTA — RESUMO:

   No HTML:
   1. Copie um bloco <li class="feed-item">
   2. Troque o ícone, --icon-color, categoria, data, título e descrição
   3. Cole antes de <!-- ADICIONE NOVOS ITENS AQUI -->

   O JavaScript detecta novos itens automaticamente —
   não precisa alterar este arquivo.
================================================================ */
