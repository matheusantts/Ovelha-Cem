/* ================================================================
   OVELHA CEM — pages/curiosidades.js (página Curiosidades)

   O que este arquivo faz:
   1. Menu hamburguer (mobile) — lógica em modules/menu-mobile.js,
      que precisa ser carregado antes deste arquivo
   2. Filtro por categoria + busca por texto nos cards
   3. Botão "Ver mais curiosidades"
   4. Ano atual no rodapé

   Sem JavaScript todos os cards aparecem: este arquivo só esconde
   os que não combinam com o filtro, a busca ou o limite inicial.
================================================================ */

document.addEventListener('DOMContentLoaded', function () {


    /* ==============================================================
       SEÇÃO 1 — MENU HAMBURGUER (MOBILE)
    ============================================================== */

    iniciarMenuMobile();


    /* ==============================================================
       SEÇÃO 2 — FILTRO POR CATEGORIA + BUSCA

       Cada card tem data-categoria="..." igual ao data-categoria de
       um botão de filtro. A busca procura o texto digitado no card
       inteiro (etiqueta, título e descrição), ignorando acentos e
       maiúsculas: "genesis" encontra "Gênesis".
    ============================================================== */

    /* Quantos cards aparecem antes de clicar em "Ver mais" */
    const QUANTIDADE_INICIAL = 6;

    const cards         = Array.from(document.querySelectorAll('.card'));
    const botoesFiltro  = document.querySelectorAll('.filtro');
    const formBusca     = document.getElementById('formBusca');
    const campoBusca    = document.getElementById('campoBusca');
    const botaoMais     = document.getElementById('botaoMais');
    const semResultados = document.getElementById('semResultados');
    const statusBusca   = document.getElementById('statusBusca');

    if (!cards.length || !campoBusca || !botaoMais) return;

    let categoriaAtiva = 'todas';
    let mostrarTodos   = false;

    /* Remove acentos e deixa tudo minúsculo para comparar textos */
    function normalizar(texto) {
        return texto
            .normalize('NFD')
            .replace(/[̀-ͯ]/g, '')
            .toLowerCase()
            .trim();
    }

    /* Texto de cada card já normalizado (calculado uma vez só) */
    const textosCards = cards.map(function (card) {
        return normalizar(card.textContent);
    });

    /*
        Mostra ou esconde cada card.
        - Sem filtro e sem busca: respeita o limite inicial até
          clicarem em "Ver mais".
        - Com filtro ou busca: mostra todos os que combinam.
    */
    function atualizarCards(anunciar) {
        const termo     = normalizar(campoBusca.value);
        const filtrando = categoriaAtiva !== 'todas' || termo !== '';

        let encontrados = 0;
        let escondidosPeloLimite = 0;

        cards.forEach(function (card, indice) {
            const combinaCategoria = categoriaAtiva === 'todas' || card.dataset.categoria === categoriaAtiva;
            const combinaBusca     = termo === '' || textosCards[indice].includes(termo);
            let visivel = combinaCategoria && combinaBusca;

            if (visivel) {
                encontrados++;

                if (!filtrando && !mostrarTodos && encontrados > QUANTIDADE_INICIAL) {
                    visivel = false;
                    escondidosPeloLimite++;
                }
            }

            card.hidden = !visivel;
        });

        botaoMais.hidden = escondidosPeloLimite === 0;
        if (semResultados) semResultados.hidden = encontrados > 0;

        /* Leitores de tela: informa quantos cards sobraram */
        if (anunciar && statusBusca) {
            if (encontrados === 0) {
                statusBusca.textContent = 'Nenhuma curiosidade encontrada.';
            } else if (encontrados === 1) {
                statusBusca.textContent = '1 curiosidade encontrada.';
            } else {
                statusBusca.textContent = encontrados + ' curiosidades encontradas.';
            }
        }
    }

    /* Clique em um botão de categoria */
    botoesFiltro.forEach(function (botao) {
        botao.addEventListener('click', function () {
            categoriaAtiva = botao.dataset.categoria;

            botoesFiltro.forEach(function (outro) {
                outro.setAttribute('aria-pressed', outro === botao);
            });

            atualizarCards(true);
        });
    });

    /* Busca enquanto digita (também ao limpar o campo pelo "x") */
    campoBusca.addEventListener('input', function () {
        atualizarCards(true);
    });

    /* Enter no campo não recarrega a página */
    if (formBusca) {
        formBusca.addEventListener('submit', function (evento) {
            evento.preventDefault();
        });
    }


    /* ==============================================================
       SEÇÃO 3 — BOTÃO "VER MAIS CURIOSIDADES"

       Mostra os cards que estavam escondidos pelo limite inicial e
       leva o foco do teclado para o primeiro card novo.
    ============================================================== */

    botaoMais.addEventListener('click', function () {
        const primeiroNovo = cards.find(function (card) { return card.hidden; });

        mostrarTodos = true;
        atualizarCards(false);

        if (primeiroNovo) {
            const link = primeiroNovo.querySelector('.card-link');
            if (link) link.focus();
        }
    });

    /* Estado inicial: aplica o limite de cards */
    atualizarCards(false);


    /* ==============================================================
       SEÇÃO 4 — ANO NO RODAPÉ
    ============================================================== */

    const footerAno = document.getElementById('footerAno');
    if (footerAno) footerAno.textContent = new Date().getFullYear();


}); /* Fim do DOMContentLoaded */


/* ================================================================
   COMO ADICIONAR UMA NOVA CURIOSIDADE — RESUMO:

   No HTML (pages/curiosidades/index.html):
   1. Copie um bloco <li class="card">
   2. Troque data-categoria, etiqueta, título, descrição e link
   3. Cole logo abaixo de <!-- ADICIONE NOVOS CARDS AQUI --> (no topo
      da lista: a seção é "Últimas curiosidades")

   Nova categoria? Crie também um <button class="filtro"> com o
   mesmo data-categoria. Este arquivo não precisa ser alterado.
================================================================ */
