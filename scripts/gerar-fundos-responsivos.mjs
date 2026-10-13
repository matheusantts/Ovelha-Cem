// Gera versões retrato (mobile e tablet) dos fundos do slider da home a partir das
// imagens 16:9 originais. Com object-fit: cover, uma tela vertical mostra só uma
// faixa estreita do centro da imagem e corta o motivo principal.
//
// Uso: node scripts/gerar-fundos-responsivos.mjs
//
// O fundo é a própria imagem ampliada e desfocada (preenche a altura com as nuvens
// douradas) e, por cima, vai o motivo principal recortado do centro, com as bordas
// suavizadas para não aparecer emenda.

import sharp from 'sharp';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const pasta = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../assets/images/imagens-logos-all/fundos');
const nomes = ['milagre-lanciano', 'sao-bento', 'senhora-aparecida'];

// Faixa central da imagem original (1672x941) que contém o motivo principal.
const RECORTE = { left: 386, top: 0, width: 900, height: 941 };

const versoes = [
  // motivo = largura do recorte na imagem final; topo = distância do topo
  { sufixo: 'mobile', largura: 1080, altura: 2160, motivo: 1000, topo: 90 },
  { sufixo: 'tablet', largura: 1200, altura: 1600, motivo: 1000, topo: 40 },
];

async function gerar(nome, v) {
  const origem = path.join(pasta, `${nome}.webp`);
  const alturaMotivo = Math.round((v.motivo * RECORTE.height) / RECORTE.width);

  // Fundo: só as faixas laterais da imagem (nuvens e luz, sem o motivo) coladas lado
  // a lado, esticadas para o formato retrato e desfocadas.
  const faixa = RECORTE.left;
  const larguraOrig = (await sharp(origem).metadata()).width;
  const esquerda = await sharp(origem).extract({ left: 0, top: 0, width: faixa, height: RECORTE.height }).toBuffer();
  const direita = await sharp(origem).extract({ left: larguraOrig - faixa, top: 0, width: faixa, height: RECORTE.height }).toBuffer();
  const faixas = await sharp({ create: { width: faixa * 2, height: RECORTE.height, channels: 3, background: '#d4a017' } })
    .composite([{ input: esquerda, left: 0, top: 0 }, { input: direita, left: faixa, top: 0 }])
    .png()
    .toBuffer();
  const fundo = await sharp(faixas)
    .resize(v.largura, v.altura, { fit: 'fill' })
    .blur(40)
    .png()
    .toBuffer();

  // Máscara com as bordas suavizadas nos quatro lados para esconder a emenda.
  const margem = 70;
  const mascara = await sharp(
    Buffer.from(
      `<svg width="${v.motivo}" height="${alturaMotivo}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#000"/>
        <rect x="${margem}" y="${margem}" width="${v.motivo - margem * 2}" height="${alturaMotivo - margem * 2}" fill="#fff"/>
      </svg>`
    )
  ).blur(35).extractChannel(0).raw().toBuffer({ resolveWithObject: true });

  // Aplica a máscara como canal alfa: a imagem recortada vira RGBA e o alfa é a máscara.
  const { data: rgb, info } = await sharp(origem)
    .extract(RECORTE)
    .resize(v.motivo, alturaMotivo)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const rgba = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0; i < info.width * info.height; i++) {
    rgba[i * 4] = rgb[i * 3];
    rgba[i * 4 + 1] = rgb[i * 3 + 1];
    rgba[i * 4 + 2] = rgb[i * 3 + 2];
    rgba[i * 4 + 3] = mascara.data[i];
  }
  const motivo = await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png()
    .toBuffer();

  const saida = path.join(pasta, `${nome}-${v.sufixo}.webp`);
  await sharp(fundo)
    .composite([{ input: motivo, left: Math.round((v.largura - v.motivo) / 2), top: v.topo }])
    .webp({ quality: 78 })
    .toFile(saida);
  console.log('gerado:', path.relative(process.cwd(), saida));
}

for (const nome of nomes) for (const v of versoes) await gerar(nome, v);
