// Gera versões WebP (360, 540 e 1080 px de largura) das imagens de destaque 4:5 do slider
// da home, para usar com srcset (o celular baixa a menor, o desktop a maior).
//
// Uso: node scripts/gerar-destaques-responsivos.mjs <origem> <nome-base>
// Ex.:  node scripts/gerar-destaques-responsivos.mjs C:/fotos/historias.jpg historias
//
// Saída: assets/images/imagens-logos-all/destaques/<nome-base>-360.webp, -540.webp e -1080.webp

import sharp from 'sharp';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const [origem, nome] = process.argv.slice(2);
if (!origem || !nome) {
  console.log('Uso: node scripts/gerar-destaques-responsivos.mjs <origem> <nome-base>');
  process.exit(1);
}

const pasta = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../assets/images/imagens-logos-all/destaques');
const larguras = [
  { largura: 360, qualidade: 78 },
  { largura: 540, qualidade: 78 },
  { largura: 1080, qualidade: 72 },
];

for (const { largura, qualidade } of larguras) {
  const altura = Math.round((largura * 5) / 4);
  const destino = path.join(pasta, `${nome}-${largura}.webp`);
  const info = await sharp(origem)
    .resize(largura, altura, { fit: 'cover' })
    .webp({ quality: qualidade, effort: 6 })
    .toFile(destino);
  console.log(`${nome}-${largura}.webp  ${(info.size / 1024).toFixed(0)} KB`);
}
