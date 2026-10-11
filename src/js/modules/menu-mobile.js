/* ================================================================
   OVELHA CEM — modules/menu-mobile.js

   Menu hamburguer (mobile), compartilhado pelas páginas que têm o
   cabeçalho de navegação: a página inicial, "Todas as histórias" e
   "Curiosidades".

   O que o HTML precisa ter:
   - o botão #navToggle (ícone de três linhas)
   - a lista #navLinks (links do menu)

   Como usar: carregue este arquivo ANTES do script da página e chame
   iniciarMenuMobile() depois que o HTML estiver pronto
   (dentro do DOMContentLoaded).
================================================================ */

function iniciarMenuMobile() {

    const navToggle = document.getElementById('navToggle');   // Botão hamburguer
    const navLinks  = document.getElementById('navLinks');    // Menu de links (mobile)

    /* Páginas sem o cabeçalho de navegação não têm esses elementos */
    if (!navToggle || !navLinks) return;

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

    /* Fecha o menu ao redimensionar para desktop (evita menu aberto ao girar o celular).
       768px é o mesmo ponto em que o CSS dessas páginas esconde o hamburguer. */
    window.addEventListener('resize', function () {
        if (window.innerWidth > 768) {
            navToggle.classList.remove('open');
            navLinks.classList.remove('open');
            navToggle.setAttribute('aria-expanded', false);
        }
    });
}
