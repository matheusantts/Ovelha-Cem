/* ================================================================
   SCRIPT — Terço Interativo
   ================================================================
   Índice deste arquivo:

   1. TEXTOS DAS ORAÇÕES         -> edite aqui para mudar as palavras
   1b. MISTÉRIOS (por dia da semana) -> edite aqui os 4 conjuntos
   2. FUNÇÕES GEOMÉTRICAS         -> raramente precisa mexer
   3. PONTOS DO TERÇO (posições)  -> edite aqui para mudar o formato/tamanho
   4. FUNÇÕES DE DESENHO (SVG)    -> como cada peça é desenhada
   5. MONTAGEM DO TERÇO (build)   -> a ordem em que tudo é desenhado
   6. SEQUÊNCIA GUIADA            -> ordem dos botões "Anterior/Próxima"
   7. INTERAÇÃO (cliques, painel) -> como o clique atualiza o texto
   ================================================================ */


/* ----------------------------------------------------------------
   1. TEXTOS DAS ORAÇÕES
   Para mudar qualquer oração, edite o texto entre os acentos graves
   (` `). Quebras de linha dentro do texto viram parágrafos na tela.
   Para ADICIONAR uma nova oração:
     a) crie uma nova entrada aqui, com uma chave nova (ex: "salveRegina2")
     b) use essa chave como "prayerKey" ao chamar drawBead()/drawLabel()
        na seção 5.
---------------------------------------------------------------- */
const PRAYERS = {
  creio: {
    eyebrow: "No crucifixo",
    title: "Sinal da Cruz - Creio",
    text: `Creio em Deus Pai todo-poderoso, Criador do céu e da terra; e em Jesus Cristo, seu único Filho, nosso Senhor, que foi concebido pelo poder do Espírito Santo, nasceu da Virgem Maria, padeceu sob Pôncio Pilatos, foi crucificado, morto e sepultado, desceu à mansão dos mortos, ressuscitou ao terceiro dia, subiu aos céus, está sentado à direita de Deus Pai todo-poderoso, donde há de vir a julgar os vivos e os mortos.

Creio no Espírito Santo, na Santa Igreja Católica, na comunhão dos santos, na remissão dos pecados, na ressurreição da carne, na vida eterna. Amém.`
  },
  paiNosso: {
    eyebrow: "Na conta grande",
    title: "Pai Nosso",
    text: `Pai Nosso que estais nos céus, santificado seja o vosso nome, venha a nós o vosso reino, seja feita a vossa vontade, assim na terra como no céu.

O pão nosso de cada dia nos dai hoje, perdoai as nossas ofensas, assim como nós perdoamos a quem nos tem ofendido, e não nos deixeis cair em tentação, mas livrai-nos do mal. Amém.`
  },
  aveMaria: {
    eyebrow: "Na conta pequena",
    title: "Ave Maria",
    text: `Ave Maria, cheia de graça, o Senhor é convosco, bendita sois vós entre as mulheres e bendito é o fruto do vosso ventre, Jesus.

Santa Maria, Mãe de Deus, rogai por nós, pecadores, agora e na hora de nossa morte. Amém.`
  },
  gloria: {
    eyebrow: "Ao fim da dezena",
    title: "Glória ao Pai",
    text: `Glória ao Pai, ao Filho e ao Espírito Santo, como era no princípio, agora e sempre, e por todos os séculos dos séculos. Amém.`
  },
  jaculatoria: {
    eyebrow: "Após cada mistério",
    title: "Jaculatória",
    text: `Ó meu Jesus, perdoai-nos, livrai-nos do fogo do inferno, levai as almas todas para o céu e socorrei principalmente as que mais precisarem.`
  },
  salveRainha: {
    eyebrow: "Oração final",
    title: "Salve Rainha",
    text: `Salve, Rainha, Mãe de misericórdia, vida, doçura, esperança nossa, salve! A vós bradamos, os degredados filhos de Eva. A vós suspiramos, gemendo e chorando neste vale de lágrimas.

Eia, pois, advogada nossa, esses vossos olhos misericordiosos a nós volvei. E depois deste desterro, mostrai-nos Jesus, bendito fruto do vosso ventre.

Ó clemente, ó piedosa, ó doce sempre Virgem Maria. Rogai por nós, Santa Mãe de Deus, para que sejamos dignos das promessas de Cristo.`
  }
};


/* ----------------------------------------------------------------
   1b. MISTÉRIOS (por dia da semana)
   Quatro conjuntos tradicionais. O conjunto do dia é escolhido
   automaticamente por getMysterySetForToday() logo abaixo, seguindo
   o costume: Gozosos (2ª e 6ª... na verdade 2ª e sábado), Dolorosos
   (3ª e 6ª), Gloriosos (4ª e domingo), Luminosos (5ª).

   Para EDITAR os textos, mude os títulos/textos abaixo.
   Para FORÇAR sempre um único conjunto (em vez do automático por
   dia), troque a função getMysterySetForToday() no final desta
   seção para simplesmente "return MYSTERY_SETS.gozosos;" (por
   exemplo).
---------------------------------------------------------------- */
const MYSTERY_SETS = {
  gozosos: {
    name: "Mistérios Gozosos",
    items: [
      { title: "1º Mistério Gozoso — A Anunciação", text: "O anjo Gabriel anuncia a Maria que ela será a Mãe do Salvador, e ela responde com um \"sim\" humilde e confiante." },
      { title: "2º Mistério Gozoso — A Visitação", text: "Maria visita sua prima Isabel, grávida de João Batista, e a saúda com alegria e louvor a Deus." },
      { title: "3º Mistério Gozoso — O Nascimento de Jesus", text: "Jesus nasce numa gruta pobre em Belém, e os pastores são os primeiros a adorá-lo." },
      { title: "4º Mistério Gozoso — A Apresentação no Templo", text: "Maria e José apresentam o Menino Jesus no templo, e o ancião Simeão o reconhece como o Salvador prometido." },
      { title: "5º Mistério Gozoso — O Encontro no Templo", text: "Aos doze anos, Jesus é encontrado por seus pais ensinando os doutores da lei no templo de Jerusalém." },
    ]
  },
  dolorosos: {
    name: "Mistérios Dolorosos",
    items: [
      { title: "1º Mistério Doloroso — A Agonia no Horto", text: "Jesus ora angustiado no Getsêmani, suando sangue diante da paixão que se aproxima." },
      { title: "2º Mistério Doloroso — A Flagelação", text: "Jesus é açoitado cruelmente por ordem de Pilatos, entregando seu corpo pela nossa salvação." },
      { title: "3º Mistério Doloroso — A Coroação de Espinhos", text: "Os soldados colocam uma coroa de espinhos na cabeça de Jesus e zombam dele como se fosse rei." },
      { title: "4º Mistério Doloroso — Jesus Carrega a Cruz", text: "Jesus carrega a cruz pesada pelas ruas de Jerusalém a caminho do Calvário." },
      { title: "5º Mistério Doloroso — A Crucificação e Morte", text: "Jesus morre na cruz, entregando a vida por amor à humanidade." },
    ]
  },
  gloriosos: {
    name: "Mistérios Gloriosos",
    items: [
      { title: "1º Mistério Glorioso — A Ressurreição", text: "Jesus ressuscita ao terceiro dia, vencendo definitivamente a morte." },
      { title: "2º Mistério Glorioso — A Ascensão", text: "Jesus sobe aos céus diante dos apóstolos, prometendo enviar o Espírito Santo." },
      { title: "3º Mistério Glorioso — A Vinda do Espírito Santo", text: "O Espírito Santo desce sobre Maria e os apóstolos reunidos no Cenáculo, em Pentecostes." },
      { title: "4º Mistério Glorioso — A Assunção de Maria", text: "Maria é levada de corpo e alma ao céu, ao final de sua vida terrena." },
      { title: "5º Mistério Glorioso — A Coroação de Maria", text: "Maria é coroada Rainha do céu e da terra, junto a seu Filho Jesus." },
    ]
  },
  luminosos: {
    name: "Mistérios Luminosos",
    items: [
      { title: "1º Mistério Luminoso — O Batismo de Jesus", text: "Jesus é batizado por João no rio Jordão, e o Pai o proclama seu Filho amado." },
      { title: "2º Mistério Luminoso — As Bodas de Caná", text: "Por intercessão de Maria, Jesus realiza seu primeiro milagre, transformando água em vinho." },
      { title: "3º Mistério Luminoso — O Anúncio do Reino", text: "Jesus anuncia o Reino de Deus e convida todos à conversão e à fé." },
      { title: "4º Mistério Luminoso — A Transfiguração", text: "Diante de Pedro, Tiago e João, Jesus se transfigura e revela sua glória." },
      { title: "5º Mistério Luminoso — A Instituição da Eucaristia", text: "Na Última Ceia, Jesus institui a Eucaristia, dando seu Corpo e Sangue sob a forma de pão e vinho." },
    ]
  }
};

// Tradição: 2ª e sáb = Gozosos | 3ª e 6ª = Dolorosos | 4ª e dom = Gloriosos | 5ª = Luminosos
function getMysterySetForToday(){
  const day = new Date().getDay(); // 0=domingo ... 6=sábado
  if (day === 1 || day === 6) return MYSTERY_SETS.gozosos;
  if (day === 2 || day === 5) return MYSTERY_SETS.dolorosos;
  if (day === 3 || day === 0) return MYSTERY_SETS.gloriosos;
  return MYSTERY_SETS.luminosos; // quinta-feira
}

const todaySet = getMysterySetForToday();
// Registra mystery1..mystery5 em PRAYERS, para serem usados como
// qualquer outra oração (prayerKey) nas contas do terço.
todaySet.items.forEach((m, i) => {
  PRAYERS[`mystery${i + 1}`] = {
    eyebrow: todaySet.name,
    title: m.title,
    text: m.text
  };
});


/* ----------------------------------------------------------------
   2. FUNÇÕES GEOMÉTRICAS
   O laço do terço é uma curva suave (spline Catmull-Rom) que passa
   por uma lista de pontos de controle. As contas são distribuídas
   por IGUAL ao longo do comprimento da curva, como num terço de
   verdade: o espaço entre elas é o mesmo em todo o laço, e o fio
   aparece entre uma conta e outra.
   Não é necessário editar esta seção para mudar textos ou cores.
---------------------------------------------------------------- */
const NS = "http://www.w3.org/2000/svg";

// Spline aberta de Catmull-Rom. Devolve os segmentos de Bézier
// cúbica (para desenhar o fio) e uma amostragem densa (para medir
// comprimentos e achar a posição de cada conta).
function buildSpline(ctrl){
  const n = ctrl.length;
  const P = (i) => {
    if (i < 0)  return { x: 2 * ctrl[0].x - ctrl[1].x, y: 2 * ctrl[0].y - ctrl[1].y };
    if (i >= n) return { x: 2 * ctrl[n - 1].x - ctrl[n - 2].x, y: 2 * ctrl[n - 1].y - ctrl[n - 2].y };
    return ctrl[i];
  };
  const segs = [];
  const dense = [{ x: ctrl[0].x, y: ctrl[0].y, len: 0 }];
  for (let i = 0; i < n - 1; i++){
    const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    segs.push({ p1, c1, c2, p2 });
    for (let k = 1; k <= 40; k++){
      const t = k / 40, u = 1 - t;
      const x = u*u*u*p1.x + 3*u*u*t*c1.x + 3*u*t*t*c2.x + t*t*t*p2.x;
      const y = u*u*u*p1.y + 3*u*u*t*c1.y + 3*u*t*t*c2.y + t*t*t*p2.y;
      const prev = dense[dense.length - 1];
      dense.push({ x, y, len: prev.len + Math.hypot(x - prev.x, y - prev.y) });
    }
  }
  return { segs, dense, length: dense[dense.length - 1].len };
}

// Ponto da curva à distância "s" do início (medida ao longo do fio).
function pointAtLength(spline, s){
  const d = spline.dense;
  if (s <= 0) return { x: d[0].x, y: d[0].y };
  if (s >= spline.length) return { x: d[d.length - 1].x, y: d[d.length - 1].y };
  let lo = 0, hi = d.length - 1;
  while (hi - lo > 1){
    const mid = (lo + hi) >> 1;
    if (d[mid].len <= s) lo = mid; else hi = mid;
  }
  const f = (s - d[lo].len) / (d[hi].len - d[lo].len);
  return { x: d[lo].x + (d[hi].x - d[lo].x) * f, y: d[lo].y + (d[hi].y - d[lo].y) * f };
}


/* ----------------------------------------------------------------
   3. PONTOS DO TERÇO (posições)
   O desenho usa um "viewBox" de 576 x 934 com origem em x=-58 (definido em pages/guia-terco/index.html),
   o que dá margem para os rótulos laterais não serem cortados.
   O SVG depois estica/encolhe para caber na tela automaticamente
   (isso é feito pelo CSS, não aqui).

   MED = centro da medalha, na ponta de baixo do laço.
   LOOP_CTRL = pontos por onde passa o fio do laço: sai da medalha,
     sobe pela esquerda, passa pelo topo, desce pela direita e volta
     à medalha (formato de gota, como num terço de verdade).
     Para deixar o laço mais largo, mais alto ou mais redondo,
     mude estes pontos.

   As contas são distribuídas automaticamente ao longo do fio:
   10 Ave Marias, 1 conta grande (Pai Nosso), e assim por diante,
   fechando as 5 dezenas. LL / UL / UR / LR são as 4 contas grandes
   do laço (Lower-Left, Upper-Left, Upper-Right, Lower-Right).
---------------------------------------------------------------- */
const MED = { x: 230, y: 560 };

const LOOP_CTRL = [
  MED,
  { x: 176, y: 505 }, { x: 118, y: 430 }, { x: 84,  y: 340 }, { x: 84,  y: 240 },
  { x: 118, y: 160 }, { x: 176, y: 112 }, { x: 230, y: 96  }, { x: 284, y: 112 },
  { x: 342, y: 160 }, { x: 376, y: 240 }, { x: 376, y: 340 }, { x: 342, y: 430 },
  { x: 284, y: 505 },
  MED
];

const BEAD_R_SMALL = 5.5;   // Ave Maria
const BEAD_R_BIG   = 11;    // Pai Nosso
const MEDAL_RX     = 22;    // meia-largura da medalha (oval)
const MEDAL_RY     = 30;    // meia-altura da medalha (oval)

// Imagem que aparece dentro da medalha (Salve Rainha). Para trocar, substitua
// o arquivo abaixo por outro (de preferência 240 x 360 px, na proporção 2:3).
const MEDAL_IMAGE  = '../../assets/images/imagens-logos-all/guia-terco/medalha-salve-rainha.webp';

const loop = buildSpline(LOOP_CTRL);

// Ordem das contas ao longo do laço, a partir da medalha:
// 10 pequenas, 1 grande, 10 pequenas, 1 grande... até a 5ª dezena.
const loopOrder = [];
for (let d = 0; d < 5; d++){
  for (let i = 0; i < 10; i++) loopOrder.push(BEAD_R_SMALL);
  if (d < 4) loopOrder.push(BEAD_R_BIG);
}

// Espaço (g) entre as bordas de duas contas vizinhas, calculado para
// que todas caibam exatamente no comprimento do fio.
const sumR = loopOrder.reduce((a, r) => a + r, 0);
const beadGap = (loop.length - 2 * sumR - 2 * MEDAL_RY) / (loopOrder.length + 1);

const loopPos = [];
(function placeLoopBeads(){
  let s = 0, prevR = MEDAL_RY;
  loopOrder.forEach(r => {
    s += prevR + beadGap + r;
    loopPos.push(pointAtLength(loop, s));
    prevR = r;
  });
})();

// Contas grandes do laço (posição 10, 21, 32 e 43 da lista)
const LL = loopPos[10];
const UL = loopPos[21];
const UR = loopPos[32];
const LR = loopPos[43];

// Cada "arco" é uma dezena: guarda as 10 posições das contas
// pequenas de Ave Maria e de que lado fica o rótulo.
const arcs = [
  { side: "left"  }, // dezena 1 (após o 1º Mistério)
  { side: "left"  }, // dezena 2
  { side: "top"   }, // dezena 3
  { side: "right" }, // dezena 4
  { side: "right" }, // dezena 5
].map((a, d) => {
  const start = d * 11;
  a.pts = loopPos.slice(start, start + 10);
  return a;
});


/* ----------------------------------------------------------------
   4. FUNÇÕES DE DESENHO (SVG)
   Funções reutilizáveis que criam elementos SVG (contas, rótulos,
   linhas guia). Usadas pela seção 5 para montar o terço inteiro.
---------------------------------------------------------------- */
const svg = document.getElementById('rosarySvg');

function el(tag, attrs){
  const e = document.createElementNS(NS, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  return e;
}

// nodes[id] guarda os elementos SVG associados a cada "ponto clicável"
// e qual oração (chave de PRAYERS) deve aparecer ao clicar nele.
const nodes = {};
function registerNode(id, prayerKey, svgEl){
  if (!nodes[id]) nodes[id] = { els: [], prayerKey };
  nodes[id].els.push(svgEl);
}

// Cria um "alias": um novo id clicável que reaproveita o(s) MESMO
// elemento(s) visual(is) de um id já existente (ex: a mesma conta
// grande), mas associado a uma oração diferente (ex: um Mistério).
// Usado para que a mesma conta acenda tanto para o Mistério quanto
// para o Pai Nosso, em passos separados da sequência guiada.
function registerAlias(newId, prayerKey, sourceId){
  const source = nodes[sourceId];
  nodes[newId] = { els: source ? [...source.els] : [], prayerKey };
}

function drawThread(){
  // fio do laço: uma única curva suave passando por todas as contas
  let d = `M ${loop.segs[0].p1.x} ${loop.segs[0].p1.y}`;
  loop.segs.forEach(sg => {
    d += ` C ${sg.c1.x} ${sg.c1.y} ${sg.c2.x} ${sg.c2.y} ${sg.p2.x} ${sg.p2.y}`;
  });
  svg.appendChild(el('path', { d, class: 'thread', stroke: '#8fa6e0', 'stroke-width': 1.6, fill: 'none', opacity: .75, 'stroke-linecap': 'round' }));

  // haste: do medalhão até o crucifixo
  svg.appendChild(el('path', {
    d: `M ${MED.x} ${MED.y + MEDAL_RY} L ${MED.x} 812`,
    class: 'thread', stroke: '#8fa6e0', 'stroke-width': 1.6, fill: 'none', opacity: .75, 'stroke-linecap': 'round'
  }));
}

// Desenha uma conta (círculo clicável).
// pt: {x,y} | r: raio | id: identificador único | prayerKey: qual oração mostrar
function drawBead(pt, r, id, prayerKey){
  const g = el('g', { class: 'bead', 'data-id': id, tabindex: '0', role: 'button',
    'aria-label': PRAYERS[prayerKey] ? PRAYERS[prayerKey].title : id });
  const circle = el('circle', { cx: pt.x, cy: pt.y, r: r, fill: 'url(#beadGrad)', stroke: '#0c1636', 'stroke-width': 1 });
  g.appendChild(circle);
  g.addEventListener('click', () => selectNode(id));
  g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectNode(id); } });
  svg.appendChild(g);
  registerNode(id, prayerKey, g);
  return g;
}

// Desenha um rótulo de texto clicável (ex: "Pai Nosso").
function drawLabel(x, y, text, id, prayerKey, anchor, extraClass){
  const t = el('text', { x, y, class: extraClass ? `label ${extraClass}` : 'label', 'text-anchor': anchor || 'start', 'data-id': id,
    tabindex: '0', role: 'button', 'aria-label': PRAYERS[prayerKey] ? PRAYERS[prayerKey].title : text });
  t.textContent = text;
  t.addEventListener('click', () => selectNode(id));
  t.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectNode(id); } });
  svg.appendChild(t);
  registerNode(id, prayerKey, t);
  return t;
}

// Linha fina ligando um rótulo à sua conta correspondente.
function drawLeader(x1, y1, x2, y2){
  const p = el('path', { d: `M ${x1} ${y1} L ${x2} ${y2}`, class: 'leader' });
  svg.appendChild(p);
}

// Gradientes de cor usados nas contas, na medalha e no crucifixo.
// Para mudar a cor das contas, ajuste os "stop-color" de #beadGrad.
function drawDefs(){
  const defs = el('defs', {});

  const grad = el('radialGradient', { id: 'beadGrad', cx: '35%', cy: '30%', r: '75%' });
  grad.appendChild(el('stop', { offset: '0%', 'stop-color': '#a9c4ff' }));
  grad.appendChild(el('stop', { offset: '45%', 'stop-color': '#3a63c9' }));
  grad.appendChild(el('stop', { offset: '100%', 'stop-color': '#0e1c46' }));
  defs.appendChild(grad);

  const woodGrad = el('linearGradient', { id: 'woodGrad', x1: '0%', y1: '0%', x2: '100%', y2: '100%' });
  woodGrad.appendChild(el('stop', { offset: '0%', 'stop-color': '#8a5a34' }));
  woodGrad.appendChild(el('stop', { offset: '100%', 'stop-color': '#432a15' }));
  defs.appendChild(woodGrad);

  const medGrad = el('radialGradient', { id: 'medGrad', cx: '40%', cy: '35%', r: '70%' });
  medGrad.appendChild(el('stop', { offset: '0%', 'stop-color': '#f4d98a' }));
  medGrad.appendChild(el('stop', { offset: '60%', 'stop-color': '#c9a227' }));
  medGrad.appendChild(el('stop', { offset: '100%', 'stop-color': '#7a5e12' }));
  defs.appendChild(medGrad);

  const bronzeGrad = el('linearGradient', { id: 'bronzeGrad', x1: '0%', y1: '0%', x2: '100%', y2: '100%' });
  bronzeGrad.appendChild(el('stop', { offset: '0%', 'stop-color': '#e2c27e' }));
  bronzeGrad.appendChild(el('stop', { offset: '55%', 'stop-color': '#a8793a' }));
  bronzeGrad.appendChild(el('stop', { offset: '100%', 'stop-color': '#6a4519' }));
  defs.appendChild(bronzeGrad);

  const medalClip = el('clipPath', { id: 'medalClip' });
  medalClip.appendChild(el('ellipse', { cx: MED.x, cy: MED.y, rx: MEDAL_RX - 6, ry: MEDAL_RY - 6 }));
  defs.appendChild(medalClip);

  svg.appendChild(defs);
}


/* ----------------------------------------------------------------
   5. MONTAGEM DO TERÇO (build)
   Desenha, em ordem: fio -> contas grandes -> dezenas de Ave Maria
   -> rótulos -> medalha -> haste (Pai Nosso, Glória, Aves, Pai Nosso)
   -> crucifixo.

   Cada uma das 5 contas grandes que abrem uma dezena (a do fim da
   haste + as 4 do laço) recebe também um pequeno rótulo "Nº Mistério"
   — é nele que o alias do Mistério daquela conta é registrado
   (ver seção 6, registerAlias).

   Para ADICIONAR/REMOVER uma conta, copie um bloco de drawBead(...)
   existente e ajuste posição, raio e prayerKey.
---------------------------------------------------------------- */
function build(){
  drawDefs();
  drawThread();

  // ---- 4 contas grandes do laço ("Pai Nosso") ----
  const paterAnchors = [
    { pt: LL, id: "pater-ll" },
    { pt: UL, id: "pater-ul" },
    { pt: UR, id: "pater-ur" },
    { pt: LR, id: "pater-lr" },
  ];
  const paterBeadEls = {};
  paterAnchors.forEach(p => { paterBeadEls[p.id] = drawBead(p.pt, 11, p.id, 'paiNosso'); });

  // ---- 5 dezenas de contas pequenas ("Ave Maria") ao longo dos arcos ----
  arcs.forEach((a, idx) => {
    a.pts.forEach((pt, i) => {
      drawBead(pt, BEAD_R_SMALL, `ave-arc${idx}-${i}`, 'aveMaria');
    });

    // rótulo "Ave Maria" perto do meio de cada dezena
    const mid = a.pts[4];
    let lx = mid.x, ly = mid.y, anchor = 'middle';
    if (a.side === 'left')  { lx = mid.x - 60; anchor = 'end'; }
    if (a.side === 'right') { lx = mid.x + 60; anchor = 'start'; }
    if (a.side === 'top')   { ly = mid.y - 26; }
    drawLeader(mid.x, mid.y, lx, ly);
    drawLabel(lx, ly, "Ave Maria", `label-ave-${idx}`, 'aveMaria', anchor);
  });

  // ---- rótulos ao lado de cada conta grande do laço ----
  // Cada conta grande do laço FECHA a dezena anterior (Glória ao Pai e
  // Jaculatória), anuncia o próximo Mistério e abre a próxima dezena
  // (Pai Nosso) — nesta ordem, de cima para baixo.
  const paterLabelInfo = [
    { pt: LL, dx: -72, dy: 6,  anchor: 'end' },
    { pt: UL, dx: -70, dy: -4, anchor: 'end' },
    { pt: UR, dx: 70,  dy: -4, anchor: 'start' },
    { pt: LR, dx: 72,  dy: 6,  anchor: 'start' },
  ];
  // pater-ll fecha a 1ª dezena e anuncia o 2º Mistério; pater-ul -> 3º;
  // pater-ur -> 4º; pater-lr -> 5º. (o 1º Mistério fica na conta da
  // haste, tratado logo abaixo, fora deste loop.)
  const mysteryNumberForPater = [2, 3, 4, 5];

  paterAnchors.forEach((p, idx) => {
    const info = paterLabelInfo[idx];
    const lx = p.pt.x + info.dx;
    const ly = (n) => p.pt.y + info.dy + n * 20;   // 4 linhas, 20 px entre elas
    const mNum = mysteryNumberForPater[idx];

    drawLeader(p.pt.x, p.pt.y, lx, ly(0));
    drawLabel(lx, ly(0), "Glória ao Pai", `plabel-gl-${idx}`, 'gloria', info.anchor);

    drawLabel(lx, ly(1), "Jaculatória", `plabel-jac-${idx}`, 'jaculatoria', info.anchor);
    // faz a própria conta grande acender também quando a Jaculatória é exibida
    registerNode(`plabel-jac-${idx}`, 'jaculatoria', paterBeadEls[p.id]);

    drawLabel(lx, ly(2), `${mNum}º Mistério`, `plabel-myst-${idx}`, `mystery${mNum}`, info.anchor, 'label-mystery');
    // idem para o Mistério
    registerNode(`plabel-myst-${idx}`, `mystery${mNum}`, paterBeadEls[p.id]);

    drawLabel(lx, ly(3), "Pai Nosso", `plabel-pn-${idx}`, 'paiNosso', info.anchor);
  });

  // ---- medalha central ("Salve Rainha", ao final) ----
  const medG = el('g', { class: 'medallion-ring', 'data-id': 'medallion', tabindex: '0', role: 'button',
    'aria-label': 'Salve Rainha' });
  medG.appendChild(el('ellipse', { cx: MED.x, cy: MED.y, rx: MEDAL_RX, ry: MEDAL_RY, fill: 'url(#medGrad)', stroke: '#5a4410', 'stroke-width': 2 }));
  medG.appendChild(el('ellipse', { cx: MED.x, cy: MED.y, rx: MEDAL_RX - 6, ry: MEDAL_RY - 6, fill: '#dbe7f7', stroke: '#8a6d20', 'stroke-width': 1 }));
  // Imagem da medalha: troque o arquivo em MEDAL_IMAGE (no topo da seção 3).
  // Ela é recortada no formato oval da medalha.
  medG.appendChild(el('image', {
    href: MEDAL_IMAGE,
    x: MED.x - (MEDAL_RX - 6), y: MED.y - (MEDAL_RY - 6),
    width: (MEDAL_RX - 6) * 2, height: (MEDAL_RY - 6) * 2,
    preserveAspectRatio: 'xMidYMid slice',
    'clip-path': 'url(#medalClip)'
  }));
  medG.addEventListener('click', () => selectNode('medallion'));
  medG.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectNode('medallion'); } });
  svg.appendChild(medG);
  registerNode('medallion', 'salveRainha', medG);

  // rótulos da medalha, na ordem em que são rezados: Glória ao Pai (fecha a
  // 5ª dezena), Jaculatória e, por fim, a Salve Rainha
  drawLeader(MED.x + MEDAL_RX - 4, MED.y - 14, MED.x + 95, MED.y - 14);
  drawLabel(MED.x + 100, MED.y - 10, "Glória ao Pai", 'medal-gloria-label', 'gloria', 'start');
  registerNode('medal-gloria-label', 'gloria', medG);

  drawLeader(MED.x + MEDAL_RX, MED.y + 4, MED.x + 95, MED.y + 8);
  drawLabel(MED.x + 100, MED.y + 12, "Jaculatória", 'medal-jaculatoria-label', 'jaculatoria', 'start');
  registerNode('medal-jaculatoria-label', 'jaculatoria', medG);

  drawLeader(MED.x + MEDAL_RX - 4, MED.y + 20, MED.x + 95, MED.y + 30);
  drawLabel(MED.x + 100, MED.y + 34, "Salve Rainha", 'medal-label', 'salveRainha', 'start');

  // ---- haste (do medalhão até o crucifixo) ----
  const tailX = MED.x;
  let y = MED.y + MEDAL_RY + 40;

  const firstPaterBead = drawBead({ x: tailX, y }, 11, 'tail-pater-top', 'paiNosso');
  // Nesta conta grande: Glória ao Pai, 1º Mistério e Pai Nosso (nesta ordem)
  drawLeader(tailX, y, tailX - 78, y - 14);
  drawLabel(tailX - 82, y - 10, "Glória ao Pai", 'tail-gloria-label', 'gloria', 'end');
  registerNode('tail-gloria-label', 'gloria', firstPaterBead);

  drawLabel(tailX - 82, y + 10, "1º Mistério", 'mystery-tail-label', 'mystery1', 'end', 'label-mystery');
  registerNode('mystery-tail-label', 'mystery1', firstPaterBead);

  drawLabel(tailX - 82, y + 30, "Pai Nosso", 'tail-pn-top-label', 'paiNosso', 'end');
  registerNode('tail-pn-top-label', 'paiNosso', firstPaterBead);

  y += 54;

  const aveYs = [];
  for (let i = 0; i < 3; i++){
    drawBead({ x: tailX, y }, 6, `tail-ave-${i}`, 'aveMaria');
    aveYs.push(y);
    y += 24;
  }
  drawLeader(tailX, aveYs[1], tailX - 78, aveYs[1]);
  drawLabel(tailX - 82, aveYs[1] + 4, "Ave Maria", 'tail-ave-label', 'aveMaria', 'end');

  y += 10;
  drawBead({ x: tailX, y }, 11, 'tail-pater-bottom', 'paiNosso');
  drawLeader(tailX, y, tailX - 78, y);
  drawLabel(tailX - 82, y + 4, "Pai Nosso", 'tail-pn-bottom-label', 'paiNosso', 'end');
  y += 46;

  // ---- crucifixo ("Creio") ----
  const crossG = el('g', { class: 'cross-shape', 'data-id': 'cross', tabindex: '0', role: 'button', 'aria-label': 'Creio' });
  const stroke = { stroke: '#3a2410', 'stroke-width': 1 };
  // argolinha de ligação ao fio e haste/braços do crucifixo
  crossG.appendChild(el('circle', { cx: tailX, cy: y - 4, r: 4, fill: 'none', stroke: '#b98d4a', 'stroke-width': 2 }));
  crossG.appendChild(el('rect', { x: tailX - 7, y: y, width: 14, height: 100, rx: 3, fill: 'url(#bronzeGrad)', ...stroke }));
  crossG.appendChild(el('rect', { x: tailX - 32, y: y + 24, width: 64, height: 14, rx: 3, fill: 'url(#bronzeGrad)', ...stroke }));
  // pontas alargadas (trevo) nas quatro extremidades
  [[tailX, y + 1], [tailX, y + 99], [tailX - 31, y + 31], [tailX + 31, y + 31]].forEach(([cx, cy]) => {
    crossG.appendChild(el('circle', { cx, cy, r: 8, fill: 'url(#bronzeGrad)', ...stroke }));
  });
  // Cristo crucificado (silhueta)
  crossG.appendChild(el('circle', { cx: tailX, cy: y + 20, r: 4.2, fill: '#5b3a14' }));
  crossG.appendChild(el('path', { d: `M ${tailX - 24} ${y + 31} L ${tailX - 4} ${y + 27} L ${tailX + 4} ${y + 27} L ${tailX + 24} ${y + 31} L ${tailX + 4} ${y + 34} L ${tailX + 3.5} ${y + 62} L ${tailX + 1.6} ${y + 82} L ${tailX - 1.6} ${y + 82} L ${tailX - 3.5} ${y + 62} L ${tailX - 4} ${y + 34} Z`, fill: '#5b3a14' }));
  crossG.addEventListener('click', () => selectNode('cross'));
  crossG.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectNode('cross'); } });
  svg.appendChild(crossG);
  registerNode('cross', 'creio', crossG);

  drawLeader(tailX - 34, y + 30, tailX - 100, y + 30);
  drawLabel(tailX - 104, y + 34, "Creio", 'cross-label', 'creio', 'end');

  // ---- indicador do conjunto de Mistérios do dia (fora do SVG) ----
  const badge = document.getElementById('todayMysteries');
  if (badge) badge.textContent = `Hoje: ${todaySet.name}`;
}


/* ----------------------------------------------------------------
   6. SEQUÊNCIA GUIADA
   Define a ordem usada pelos botões "Anterior" / "Próxima oração",
   já seguindo a estrutura tradicional das 5 dezenas com mistérios:

   Creio → Pai Nosso → 3 Ave Maria → Glória ao Pai →
   [1º Mistério → Pai Nosso → 10 Ave Maria] →
   [Glória ao Pai → Jaculatória → 2º Mistério → Pai Nosso → 10 Ave Maria] →
   [Glória ao Pai → Jaculatória → 3º Mistério → Pai Nosso → 10 Ave Maria] →
   [Glória ao Pai → Jaculatória → 4º Mistério → Pai Nosso → 10 Ave Maria] →
   [Glória ao Pai → Jaculatória → 5º Mistério → Pai Nosso → 10 Ave Maria] →
   Glória ao Pai → Jaculatória → Salve Rainha (última oração da sequência)

   Cada Mistério é registrado como um "alias" (ver registerAlias na
   seção 4) da mesma conta grande onde o Pai Nosso daquela dezena
   é rezado — por isso a MESMA conta acende para os dois passos.

   Para mudar a ordem, edite os ids abaixo (eles devem bater com os
   ids passados em drawBead()/drawLabel()/registerAlias() na seção 5).
---------------------------------------------------------------- */

// Desenha o terço agora (precisa acontecer ANTES dos aliases abaixo,
// já que eles reaproveitam contas que só existem depois do build()).
build();

// aliases: mistérios 2 a 5 reaproveitam a conta grande do laço
registerAlias('mystery-ll-alias', 'mystery2', 'pater-ll');
registerAlias('mystery-ul-alias', 'mystery3', 'pater-ul');
registerAlias('mystery-ur-alias', 'mystery4', 'pater-ur');
registerAlias('mystery-lr-alias', 'mystery5', 'pater-lr');
// mistério 1 reaproveita a conta grande do topo da haste
registerAlias('mystery-tail-alias', 'mystery1', 'tail-pater-top');

const sequence = [];

// monta a sequência completa, intercalando Glória -> Mistério -> Pai Nosso
// entre cada dezena e a próxima
(function buildFullSequence(){
  sequence.push('cross', 'tail-pater-bottom', 'tail-ave-0', 'tail-ave-1', 'tail-ave-2', 'tail-gloria-label');
  sequence.push('mystery-tail-alias', 'tail-pater-top');

  const paterCloseIds = [
    { gloria: 'plabel-gl-0', jac: 'plabel-jac-0', mystery: 'mystery-ll-alias', pater: 'pater-ll' },
    { gloria: 'plabel-gl-1', jac: 'plabel-jac-1', mystery: 'mystery-ul-alias', pater: 'pater-ul' },
    { gloria: 'plabel-gl-2', jac: 'plabel-jac-2', mystery: 'mystery-ur-alias', pater: 'pater-ur' },
    { gloria: 'plabel-gl-3', jac: 'plabel-jac-3', mystery: 'mystery-lr-alias', pater: 'pater-lr' },
  ];

  arcs.forEach((a, idx) => {
    // as 10 Ave Marias da dezena que está sendo fechada/aberta
    for (let i = 0; i < 10; i++) sequence.push(`ave-arc${idx}-${i}`);

    if (idx < 4){
      // fecha esta dezena e abre a próxima: Glória -> Jaculatória -> próximo Mistério -> Pai Nosso
      const c = paterCloseIds[idx];
      sequence.push(c.gloria, c.jac, c.mystery, c.pater);
    } else {
      // 5ª e última dezena: fecha com Glória ao Pai e Jaculatória, depois Salve Rainha
      sequence.push('medal-gloria-label', 'medal-jaculatoria-label', 'medallion');
    }
  });
})();


/* ----------------------------------------------------------------
   7. INTERAÇÃO (cliques, painel de oração)
   Atualiza o texto exibido e o destaque visual da conta selecionada.
---------------------------------------------------------------- */
let currentIndex = -1;

function clearActive(){
  document.querySelectorAll('.bead.active').forEach(e => e.classList.remove('active'));
  document.querySelectorAll('.label.active').forEach(e => e.classList.remove('active'));
}

function selectNode(id){
  const node = nodes[id];
  if (!node) return;

  clearActive();
  node.els.forEach(e => { if (e) e.classList.add('active'); });

  const p = PRAYERS[node.prayerKey];
  if (!p) return;
  document.getElementById('prayerEyebrow').textContent = p.eyebrow;
  document.getElementById('prayerTitle').textContent = p.title;
  document.getElementById('prayerText').textContent = p.text;

  currentIndex = sequence.indexOf(id);
  updateCount();
}

function updateCount(){
  const countEl = document.getElementById('prayerCount');
  countEl.textContent = currentIndex >= 0
    ? `Passo ${currentIndex + 1} de ${sequence.length} na sequência do terço`
    : '';
}

document.getElementById('nextBtn').addEventListener('click', () => {
  const next = (currentIndex + 1) % sequence.length;
  selectNode(sequence[next]);
});
document.getElementById('prevBtn').addEventListener('click', () => {
  const prev = (currentIndex <= 0 ? sequence.length : currentIndex) - 1;
  selectNode(sequence[prev]);
});