# Ovelha Cem

Site estático de conteúdo católico: <https://ovelhacem.com.br>.
HTML, CSS e JavaScript puros, sem framework e sem etapa de build.

## Como rodar localmente

- **Mais simples:** abra o `index.html` no navegador (dois cliques). Os links internos
  apontam para o arquivo (`.../index.html`), então a navegação funciona mesmo sem servidor.
- **Mais parecido com a hospedagem:** use um servidor estático, como a extensão
  *Live Server* do VS Code.

Scripts de imagem (opcionais; rode `npm install` antes para instalar o `sharp`):

| Comando | O que faz |
| --- | --- |
| `npm run otimizar-imagem -- <imagem> [largura] [qualidade] [--png]` | Redimensiona e comprime uma imagem (WebP por padrão) |
| `node scripts/gerar-fundos-responsivos.mjs` | Gera as versões mobile/tablet dos fundos do slider da página inicial |

## Estrutura

```text
index.html                      Página inicial (slider)
pages/
├── todas-historias/            index.html + todas-historias.css
├── curiosidades/               index.html + curiosidades.css (filtro por categoria e busca)
├── guia-terco/                 index.html + guia-terco.css  (Guia do Santo Terço)
├── fale-comigo/                index.html + fale-comigo.css (formulário de contato)
├── em-construcao/              index.html + em-construcao.css
└── historias/
    ├── inicio-historia.css     estilo das páginas de apresentação das histórias
    ├── capitulo.css            estilo dos capítulos (inclui o lightbox)
    ├── milagre-lanciano/       index.html (apresentação) + cap1-3.html + imagens.html
    ├── nossa-senhora-aparecida/  index.html + capítulos ainda em andamento
    ├── sao-bento/              index.html
    └── modelo-nova-historia/   modelo para criar uma história nova
assets/
└── images/                     geral/, imagens-logos-all/, todas-historias/, historias/<história>/
src/
├── css/
│   ├── main.css                ponto de entrada global (importa os dois abaixo)
│   ├── variables.css           paleta oficial da marca
│   ├── reset.css               reset do navegador
│   └── pages/home.css          estilo da página inicial
├── js/
│   ├── modules/
│   │   ├── menu-mobile.js      menu hambúrguer (página inicial, Todas as histórias e Curiosidades)
│   │   └── lightbox.js         ampliação das imagens dos capítulos
│   └── pages/                  home.js, todas-historias.js, curiosidades.js, guia-terco.js, fale-comigo.js
└── pages/                      SÓ redirecionamentos dos endereços antigos (veja abaixo)
scripts/                        ferramentas de imagem (Node + sharp)
sitemap.xml, robots.txt, CNAME
```

## Convenções

### Nova página

1. Crie `pages/<nome>/index.html` e `pages/<nome>/<nome>.css`.
2. No `<head>`, carregue primeiro `../../src/css/main.css` e depois o CSS da página.
3. Se a página tiver JavaScript próprio, crie `src/js/pages/<nome>.js` e carregue-o no fim do `<body>`.
4. Links internos apontam para o arquivo (`../guia-terco/index.html`), não só para a pasta;
   assim funcionam também ao abrir o site direto do disco.
5. Em `<link rel="canonical">`, `og:url` e no `sitemap.xml`, use a URL limpa:
   `https://ovelhacem.com.br/pages/<nome>/`.

### CSS

- `src/css/main.css` é o ponto de entrada global: importa `variables.css` (paleta da marca)
  e `reset.css`. Ele vem antes do CSS de cada página.
- Variáveis próprias de uma página (fontes, espaçamentos, `--preto-noite` etc.) ficam no CSS
  daquela página, porque cada página tem a sua escala.
- Exceções: **Fale Comigo** carrega só `variables.css` e o **Guia do Terço** não usa os estilos
  globais. As duas têm um reset mais leve no próprio CSS; o reset global zeraria as margens
  nativas de campos e botões no Safari/Firefox e mudaria o layout delas.

### JavaScript

- Scripts comuns (sem `type="module"`), para funcionarem também ao abrir o arquivo direto do disco.
- `src/js/modules/` guarda o que é reutilizável:
  - `menu-mobile.js`: define `iniciarMenuMobile()`. Carregue-o **antes** do script da página.
  - `lightbox.js`: amplia as imagens da galeria dos capítulos e inicia sozinho.
- `src/js/pages/` guarda o comportamento específico de cada página.

### Nova história

1. Copie a pasta `pages/historias/modelo-nova-historia/` para `pages/historias/<nome-da-historia>/`.
2. Crie a apresentação `index.html` da história, usando `pages/historias/milagre-lanciano/index.html` como base.
3. Troque títulos, metatags (description, `og:*`, canonical), links de "Voltar" e o conteúdo dos capítulos.
   As imagens da história ficam em `assets/images/historias/<nome-da-historia>/`.
4. Adicione a história na página inicial, em *Todas as histórias* e no `sitemap.xml`.

## Hospedagem e endereços

- O site é servido pela Hostinger e **cada push na branch `main` vai direto para produção**.
- `src/pages/` contém só **redirecionamentos dos endereços antigos** (por exemplo,
  `/src/pages/guiaTerco.html` leva para `/pages/guia-terco/`). Eles mantêm funcionando os links
  já divulgados e preservam parâmetros como `?utm_source=...`. Não apague nem edite esses arquivos.
