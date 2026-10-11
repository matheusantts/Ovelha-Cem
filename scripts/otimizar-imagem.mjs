// Otimiza uma imagem: redimensiona para a largura informada e comprime.
// Por padrao converte para WebP (ideal para fotos). Use --png para manter
// PNG sem perdas (ideal para icones/logos que dependem de cores exatas
// ou de transparencia, como o favicon da Ovelha Cem).
//
// Uso:
//   node scripts/otimizar-imagem.mjs <caminho-da-imagem> [largura] [qualidade] [--png]
//
// Exemplos:
//   node scripts/otimizar-imagem.mjs assets/images/nova-foto.jpg 640
//   node scripts/otimizar-imagem.mjs assets/images/geral/novo-icone.png 256 --png

import sharp from "sharp";
import path from "node:path";
import fs from "node:fs/promises";

const args = process.argv.slice(2);
const usePng = args.includes("--png");
const [inputPath, larguraArg, qualidadeArg] = args.filter((a) => a !== "--png");

if (!inputPath) {
  console.log(`
Uso:
  node scripts/otimizar-imagem.mjs <caminho-da-imagem> [largura] [qualidade] [--png]

Exemplos:
  node scripts/otimizar-imagem.mjs assets/images/nova-foto.jpg 640
  node scripts/otimizar-imagem.mjs assets/images/geral/novo-icone.png 256 --png

Guia rapido de largura (2x o tamanho real de exibicao na tela):
  Fundo de slide em tela cheia (hero)........... 1600-1900
  Imagem circular grande (ex: .circulo-imagem)... 640
  Card/miniatura pequena (ex: circulo de 75px)... 200
  Foto de galeria aberta em lightbox............. 1600
  Logo/icone/favicon (use --png)................. 256
`);
  process.exit(1);
}

const largura = larguraArg ? parseInt(larguraArg, 10) : undefined;
const qualidade = qualidadeArg ? parseInt(qualidadeArg, 10) : 80;

async function main() {
  const antesBytes = (await fs.stat(inputPath)).size;
  const extensaoFinal = usePng ? ".png" : ".webp";
  const outputPath = inputPath.replace(/\.(png|jpe?g|webp)$/i, "") + extensaoFinal;
  const mesmoArquivo = path.resolve(outputPath) === path.resolve(inputPath);
  const destinoEscrita = mesmoArquivo ? outputPath + ".tmp" : outputPath;

  let pipeline = sharp(inputPath);
  if (largura) {
    pipeline = pipeline.resize({ width: largura, fit: "inside", withoutEnlargement: true });
  }
  pipeline = usePng
    ? pipeline.png({ compressionLevel: 9 })
    : pipeline.webp({ quality: qualidade });

  await pipeline.toFile(destinoEscrita);
  if (mesmoArquivo) await fs.rename(destinoEscrita, outputPath);

  const depoisBytes = (await fs.stat(outputPath)).size;
  const reducao = (100 - (depoisBytes / antesBytes) * 100).toFixed(0);

  console.log(`\n${inputPath}`);
  console.log(`  -> ${outputPath}`);
  console.log(`  ${(antesBytes / 1024).toFixed(0)} KB -> ${(depoisBytes / 1024).toFixed(0)} KB (${reducao}% menor)\n`);

  if (!mesmoArquivo) {
    console.log(`Lembrete: atualize o(s) <img src="..."> para "${path.basename(outputPath)}"`);
    console.log(`e depois apague "${path.basename(inputPath)}" se nao precisar mais dele.\n`);
  }
}

main().catch((err) => {
  console.error("Erro ao otimizar imagem:", err.message);
  process.exit(1);
});
