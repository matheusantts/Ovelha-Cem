# Ovelha Cem — regras para manter a pontuação alta (PageSpeed / Hostinger)

Site estático (HTML/CSS/JS puro) em https://ovelhacem.com.br, hospedado na Hostinger.
**Toda alteração ou página nova deve seguir as regras abaixo**, sem o usuário precisar pedir.

## 1. Imagens (maior impacto no LCP e no mobile)
- Formato **WebP** (nunca JPEG/PNG para fotos, nunca SVG com imagem base64 dentro).
- Otimizar com `scripts/otimizar-imagem.mjs`; destaques 4:5 do slider com `scripts/gerar-destaques-responsivos.mjs` (gera -360, -540 e -1080).
- Metas de peso: ≤ 150 KB (desktop), ≤ 60–90 KB (variantes mobile). Nunca entregar 1080 px para um celular: usar `srcset` + `sizes`.
- Sempre `width` e `height` (evita CLS) e `alt`.
- Imagem principal visível ao abrir a página (LCP): **sem** `loading="lazy"`, com `fetchpriority="high"` e `<link rel="preload" as="image">` (com `imagesrcset`/`imagesizes`).
- Todas as outras imagens: `loading="lazy"` e `decoding="async"`.
- Ao trocar uma imagem, usar **nome novo** de arquivo (o servidor guarda imagens em cache por 1 ano).

## 2. CSS e JS
- Editar sempre os arquivos originais (`src/css`, `src/js`, `pages/**/*.css`) e rodar **`npm run build`** antes de finalizar. O build gera os `.min.css`/`.min.js` e atualiza os HTML com `?v=<hash>`.
- Páginas HTML devem apontar para os `.min` (o build faz isso). Página nova: referenciar o `.css`/`.js` normalmente e rodar o build, que converte.
- Nada de `@import` em CSS (cria cadeia de requisições). Dependência nova entra no `main.css` via bundle do build, ou como `<link>` direto.
- `<script>` sempre com `defer`, no fim do `<body>`. JS só na página que usa (ex.: `guia-terco.js` só no guia).
- Sem bibliotecas/frameworks externos sem necessidade (jQuery, Bootstrap etc.). Preferir JS puro.
- Arquivos novos em `scripts/` precisam de `git add -f` (a pasta está no `.gitignore`).

## 3. Fontes
- Google Fonts com `display=swap`, `preconnect`, e carregamento não bloqueante (`media="print" onload="this.media='all'"` + `<noscript>`), como no `index.html`.
- Pedir só os pesos realmente usados. Evitar adicionar famílias novas.

## 4. Mobile (testar sempre como celular)
- Animações infinitas pesadas (rotação de gradientes grandes, nuvens) ficam desligadas em `max-width: 768px`. Animar só `transform` e `opacity`; usar `will-change` com moderação.
- Respeitar `prefers-reduced-motion`.
- Evitar `filter`/`backdrop-filter`/sombras grandes em imagens grandes no mobile.
- Alvos de toque ≥ 44 px, texto ≥ 16 px, `<meta name="viewport">` presente.

## 5. Servidor (`.htaccess` na raiz)
- Mantém: redirecionamento único http/www → `https://ovelhacem.com.br`, compressão gzip/brotli, cache de 1 ano para css/js/imagens/fontes e `no-cache` para HTML.
- Não remover nem enfraquecer essas regras. Não criar cadeias de redirecionamento.

## 6. SEO e acessibilidade (a pontuação inclui isso)
- Cada página: `<title>`, `meta description`, `canonical`, `lang="pt-br"`, um único `<h1>`, hierarquia de títulos correta.
- Página nova entra no `sitemap.xml`.
- Contraste de cor adequado, links e botões com nome acessível (`aria-label` em botões só com ícone).

## 7. Checklist ao terminar qualquer mudança
1. `npm run build` rodou e os HTML apontam para `.min` com `?v=`.
2. Imagens novas em WebP, com `width`/`height`, `srcset` quando grandes, lazy (exceto a do LCP).
3. Nenhum `@import`, nenhum script sem `defer`, nenhuma dependência externa nova.
4. Conferido no navegador (desktop e viewport mobile): sem erros no console.
5. Se a mudança for grande, lembrar o usuário de reexecutar o PageSpeed/Hostinger e comparar LCP, TBT e CLS.
