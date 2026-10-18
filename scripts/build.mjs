// Minifica o CSS e o JS do site e atualiza as páginas HTML para usarem as versões .min.
//
// Uso: npm run build
//
// - Cada src/**/*.css, src/**/*.js e pages/**/*.css vira um arquivo .min ao lado do original.
//   Edite SEMPRE o arquivo original e rode o build antes de publicar.
// - src/css/main.css é empacotado: os @import (variables.css e reset.css) entram no mesmo
//   arquivo, evitando requisições em cadeia.
// - Os HTML passam a apontar para "arquivo.min.css?v=<hash>". O hash muda quando o conteúdo
//   muda, então o cache longo configurado no .htaccess nunca serve um arquivo antigo.

import { build } from 'esbuild';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const IGNORAR = new Set(['node_modules', '.git', '.claude', 'assets', 'scripts']);

async function listar(dir, saida = []) {
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    if (IGNORAR.has(e.name)) continue;
    const completo = path.join(dir, e.name);
    if (e.isDirectory()) await listar(completo, saida);
    else saida.push(completo);
  }
  return saida;
}

const arquivos = await listar(raiz);
const fontes = arquivos.filter((f) => /\.(css|js)$/.test(f) && !/\.min\.(css|js)$/.test(f) && !f.includes(`${path.sep}src${path.sep}pages${path.sep}`));
const paginas = arquivos.filter((f) => f.endsWith('.html') && !f.includes(`${path.sep}src${path.sep}pages${path.sep}`));

// 1) Gera os .min e guarda o hash de cada um (chave = caminho do .min relativo à raiz)
const hashes = new Map();
for (const origem of fontes) {
  const destino = origem.replace(/\.(css|js)$/, '.min.$1');
  await build({
    entryPoints: [origem],
    outfile: destino,
    bundle: origem.endsWith('.css'),
    minify: true,
    legalComments: 'none',
    target: 'es2020',
    logLevel: 'error',
  });
  const conteudo = await fs.readFile(destino);
  const hash = crypto.createHash('sha1').update(conteudo).digest('hex').slice(0, 8);
  hashes.set(path.relative(raiz, destino).split(path.sep).join('/'), hash);
}

// 2) Atualiza os HTML: href/src locais .css/.js -> .min.css/.min.js?v=hash
let alteradas = 0;
for (const pagina of paginas) {
  const original = await fs.readFile(pagina, 'utf8');
  const atualizado = original.replace(
    /(\b(?:href|src)=")((?!https?:|\/\/)[^"?]+?)(\.min)?\.(css|js)(\?v=[0-9a-f]+)?(")/g,
    (todo, ini, base, _min, ext, _v, fim) => {
      const alvo = path.resolve(path.dirname(pagina), `${base}.min.${ext}`);
      const chave = path.relative(raiz, alvo).split(path.sep).join('/');
      const hash = hashes.get(chave);
      return hash ? `${ini}${base}.min.${ext}?v=${hash}${fim}` : todo;
    },
  );
  if (atualizado !== original) {
    await fs.writeFile(pagina, atualizado);
    alteradas++;
  }
}

console.log(`${hashes.size} arquivos minificados, ${alteradas} páginas HTML atualizadas.`);
