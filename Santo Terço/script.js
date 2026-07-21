/* ================================================================
   SCRIPT — Terço Interativo
   ================================================================
   Índice deste arquivo:

   1. TEXTOS DAS ORAÇÕES        -> edite aqui para mudar as palavras
   2. FUNÇÕES GEOMÉTRICAS        -> raramente precisa mexer
   3. PONTOS DO TERÇO (posições) -> edite aqui para mudar o formato/tamanho
   4. FUNÇÕES DE DESENHO (SVG)   -> como cada peça é desenhada
   5. MONTAGEM DO TERÇO (build)  -> a ordem em que tudo é desenhado
   6. SEQUÊNCIA GUIADA           -> ordem dos botões "Anterior/Próxima"
   7. INTERAÇÃO (cliques, painel)-> como o clique atualiza o texto
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
    title: "Creio (Símbolo dos Apóstolos)",
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
  salveRainha: {
    eyebrow: "Na medalha",
    title: "Salve Rainha",
    text: `Salve, Rainha, Mãe de misericórdia, vida, doçura, esperança nossa, salve! A vós bradamos, os degredados filhos de Eva. A vós suspiramos, gemendo e chorando neste vale de lágrimas.

Eia, pois, advogada nossa, esses vossos olhos misericordiosos a nós volvei. E depois deste desterro, mostrai-nos Jesus, bendito fruto do vosso ventre.

Ó clemente, ó piedosa, ó doce sempre Virgem Maria. Rogai por nós, Santa Mãe de Deus, para que sejamos dignos das promessas de Cristo.`
  }
};


/* ----------------------------------------------------------------
   2. FUNÇÕES GEOMÉTRICAS
   Ajudam a calcular posições de contas ao longo de curvas.
   Não é necessário editar esta seção para mudar textos ou cores.
---------------------------------------------------------------- */
const NS = "http://www.w3.org/2000/svg";

function quadPoint(p0, p1, p2, t){
  const x = (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x;
  const y = (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y;
  return { x, y };
}
function controlFor(p0, p2, bulgeX, bulgeY){
  return { x: (p0.x + p2.x) / 2 + bulgeX, y: (p0.y + p2.y) / 2 + bulgeY };
}
function beadsAlongArc(p0, p2, ctrl, count){
  const pts = [];
  for (let i = 1; i <= count; i++){
    const t = i / (count + 1);
    pts.push(quadPoint(p0, ctrl, p2, t));
  }
  return pts;
}


/* ----------------------------------------------------------------
   3. PONTOS DO TERÇO (posições)
   O desenho usa um "viewBox" de 460 x 900 (definido no index.html).
   Pense nestas coordenadas como uma grade fixa desse tamanho —
   o SVG depois estica/encolhe para caber na tela automaticamente
   (isso é feito pelo CSS, não aqui).

   MED = centro da medalha
   LL / UL / UR / LR = as 4 contas grandes do laço
     (Lower-Left, Upper-Left, Upper-Right, Lower-Right)

   Para deixar o laço mais largo, mais alto, ou mudar seu formato,
   ajuste estes pontos e/ou os "bulge" (curvatura) dentro de `arcs`.
---------------------------------------------------------------- */
const MED = { x: 230, y: 560 };
const LL  = { x: 120, y: 470 };
const UL  = { x: 88,  y: 230 };
const UR  = { x: 372, y: 230 };
const LR  = { x: 340, y: 470 };

// Cada arco liga duas contas grandes (ou a medalha) e recebe
// 10 contas pequenas de Ave Maria distribuídas ao longo da curva.
// "bulge" controla o quanto a curva se afasta da linha reta
// entre os dois pontos (valores maiores = curva mais aberta).
const arcs = [
  { p0: MED, p2: LL, ctrl: controlFor(MED, LL, -46, 10), side: "left"  }, // baixo-esquerda
  { p0: LL,  p2: UL, ctrl: controlFor(LL, UL, -60, 0),   side: "left"  }, // esquerda
  { p0: UL,  p2: UR, ctrl: controlFor(UL, UR, 0, -58),   side: "top"   }, // topo
  { p0: UR,  p2: LR, ctrl: controlFor(UR, LR, 60, 0),    side: "right" }, // direita
  { p0: LR,  p2: MED,ctrl: controlFor(LR, MED, 46, 10),  side: "right" }, // baixo-direita
];


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

function drawThread(){
  arcs.forEach(a => {
    const path = el('path', {
      d: `M ${a.p0.x} ${a.p0.y} Q ${a.ctrl.x} ${a.ctrl.y} ${a.p2.x} ${a.p2.y}`,
      stroke: '#3d4670', 'stroke-width': 2, fill: 'none', opacity: .6
    });
    svg.appendChild(path);
  });
  const tailPath = el('path', {
    d: `M ${MED.x} ${MED.y + 34} L ${MED.x} 800`,
    stroke: '#3d4670', 'stroke-width': 2, fill: 'none', opacity: .6
  });
  svg.appendChild(tailPath);
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
function drawLabel(x, y, text, id, prayerKey, anchor){
  const t = el('text', { x, y, class: 'label', 'text-anchor': anchor || 'start', 'data-id': id,
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

  svg.appendChild(defs);
}


/* ----------------------------------------------------------------
   5. MONTAGEM DO TERÇO (build)
   Desenha, em ordem: fio -> contas grandes -> dezenas de Ave Maria
   -> rótulos -> medalha -> haste (Pai Nosso, Glória, Aves, Pai Nosso)
   -> crucifixo.

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
  paterAnchors.forEach(p => drawBead(p.pt, 11, p.id, 'paiNosso'));

  // ---- 5 dezenas de contas pequenas ("Ave Maria") ao longo dos arcos ----
  arcs.forEach((a, idx) => {
    const pts = beadsAlongArc(a.p0, a.p2, a.ctrl, 10);
    pts.forEach((pt, i) => {
      drawBead(pt, 5.5, `ave-arc${idx}-${i}`, 'aveMaria');
    });

    // rótulo "Ave Maria" perto do meio de cada arco
    const mid = quadPoint(a.p0, a.ctrl, a.p2, 0.5);
    let lx = mid.x, ly = mid.y, anchor = 'middle';
    if (a.side === 'left')  { lx = mid.x - 60; anchor = 'end'; }
    if (a.side === 'right') { lx = mid.x + 60; anchor = 'start'; }
    if (a.side === 'top')   { ly = mid.y - 26; }
    drawLeader(mid.x, mid.y, lx, ly);
    drawLabel(lx, ly, "Ave Maria", `label-ave-${idx}`, 'aveMaria', anchor);
  });

  // ---- rótulos "Pai Nosso" / "Glória ao Pai" ao lado de cada conta grande ----
  const paterLabelInfo = [
    { pt: LL, dx: -72, dy: 6,  dx2: -72, dy2: 26, anchor: 'end' },
    { pt: UL, dx: -70, dy: -4, dx2: -70, dy2: 16, anchor: 'end' },
    { pt: UR, dx: 70,  dy: -4, dx2: 70,  dy2: 16, anchor: 'start' },
    { pt: LR, dx: 72,  dy: 6,  dx2: 72,  dy2: 26, anchor: 'start' },
  ];
  paterAnchors.forEach((p, idx) => {
    const info = paterLabelInfo[idx];
    const lx1 = p.pt.x + info.dx,  ly1 = p.pt.y + info.dy;
    const lx2 = p.pt.x + info.dx2, ly2 = p.pt.y + info.dy2;
    drawLeader(p.pt.x, p.pt.y, lx1, ly1);
    drawLabel(lx1, ly1, "Pai Nosso", `plabel-pn-${idx}`, 'paiNosso', info.anchor);
    drawLabel(lx2, ly2, "Glória ao Pai", `plabel-gl-${idx}`, 'gloria', info.anchor);
  });

  // ---- medalha central ("Salve Rainha") ----
  const medG = el('g', { class: 'medallion-ring', 'data-id': 'medallion', tabindex: '0', role: 'button',
    'aria-label': 'Salve Rainha' });
  medG.appendChild(el('circle', { cx: MED.x, cy: MED.y, r: 30, fill: 'url(#medGrad)', stroke: '#5a4410', 'stroke-width': 2 }));
  medG.appendChild(el('circle', { cx: MED.x, cy: MED.y, r: 22, fill: '#eee0b8', stroke: '#8a6d20', 'stroke-width': 1 }));
  const initials = el('text', { x: MED.x, y: MED.y + 6, 'text-anchor': 'middle',
    'font-family': 'Cormorant Garamond, serif', 'font-size': '16', fill: '#5a4410', 'font-weight': '600' });
  initials.textContent = "AM";
  medG.appendChild(initials);
  medG.addEventListener('click', () => selectNode('medallion'));
  medG.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectNode('medallion'); } });
  svg.appendChild(medG);
  registerNode('medallion', 'salveRainha', medG);

  drawLeader(MED.x + 30, MED.y, MED.x + 95, MED.y);
  drawLabel(MED.x + 100, MED.y + 4, "Salve Rainha", 'medal-label', 'salveRainha', 'start');

  // ---- haste (do medalhão até o crucifixo) ----
  const tailX = MED.x;
  let y = MED.y + 70;

  drawBead({ x: tailX, y }, 11, 'tail-pater-top', 'paiNosso');
  drawLeader(tailX, y, tailX - 78, y - 4);
  drawLabel(tailX - 82, y - 2, "Pai Nosso", 'tail-pn-top-label', 'paiNosso', 'end');
  y += 34;

  drawBead({ x: tailX, y }, 6, 'tail-gloria', 'gloria');
  drawLeader(tailX, y, tailX - 78, y);
  drawLabel(tailX - 82, y + 4, "Glória ao Pai", 'tail-gloria-label', 'gloria', 'end');
  y += 26;

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
  crossG.appendChild(el('rect', { x: tailX - 9, y: y, width: 18, height: 96, rx: 4, fill: 'url(#woodGrad)', stroke: '#2b1a0c', 'stroke-width': 1 }));
  crossG.appendChild(el('rect', { x: tailX - 34, y: y + 22, width: 68, height: 16, rx: 4, fill: 'url(#woodGrad)', stroke: '#2b1a0c', 'stroke-width': 1 }));
  crossG.addEventListener('click', () => selectNode('cross'));
  crossG.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectNode('cross'); } });
  svg.appendChild(crossG);
  registerNode('cross', 'creio', crossG);

  drawLeader(tailX - 34, y + 30, tailX - 100, y + 30);
  drawLabel(tailX - 104, y + 34, "Creio", 'cross-label', 'creio', 'end');
}


/* ----------------------------------------------------------------
   6. SEQUÊNCIA GUIADA
   Define a ordem usada pelos botões "Anterior" / "Próxima oração".
   Para mudar a ordem, edite os ids abaixo (eles devem bater com os
   ids passados em drawBead()/drawLabel() na seção 5).
---------------------------------------------------------------- */
const sequence = [
  'cross', 'tail-pater-bottom', 'tail-ave-0', 'tail-ave-1', 'tail-ave-2',
  'tail-gloria', 'tail-pater-top', 'medallion',
];
(function appendDecades(){
  const paterIds = ['pater-ll', 'pater-ul', 'pater-ur', 'pater-lr'];
  arcs.forEach((a, idx) => {
    for (let i = 0; i < 10; i++) sequence.push(`ave-arc${idx}-${i}`);
    sequence.push(paterIds[idx]);
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
  node.els.forEach(e => e.classList.add('active'));

  const p = PRAYERS[node.prayerKey];
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

// Inicia o desenho do terço assim que este script é carregado.
build();
