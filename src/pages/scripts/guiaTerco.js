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
  { p0: MED, p2: LL, ctrl: controlFor(MED, LL, -46, 10), side: "left"  }, // decade 1 (após o 1º Mistério)
  { p0: LL,  p2: UL, ctrl: controlFor(LL, UL, -60, 0),   side: "left"  }, // decade 2
  { p0: UL,  p2: UR, ctrl: controlFor(UL, UR, 0, -58),   side: "top"   }, // decade 3
  { p0: UR,  p2: LR, ctrl: controlFor(UR, LR, 60, 0),    side: "right" }, // decade 4
  { p0: LR,  p2: MED,ctrl: controlFor(LR, MED, 46, 10),  side: "right" }, // decade 5
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

  // ---- rótulos "Pai Nosso" / "Glória ao Pai" / "Nº Mistério" ao lado de cada conta grande ----
  // Cada conta grande do laço FECHA a dezena anterior (Glória ao Pai),
  // anuncia o próximo Mistério e abre a próxima dezena (Pai Nosso).
  const paterLabelInfo = [
    { pt: LL, dx: -72, dy: 6,  dx2: -72, dy2: 26, dx3: -72, dy3: 46, anchor: 'end' },
    { pt: UL, dx: -70, dy: -4, dx2: -70, dy2: 16, dx3: -70, dy3: 36, anchor: 'end' },
    { pt: UR, dx: 70,  dy: -4, dx2: 70,  dy2: 16, dx3: 70,  dy3: 36, anchor: 'start' },
    { pt: LR, dx: 72,  dy: 6,  dx2: 72,  dy2: 26, dx3: 72,  dy3: 46, anchor: 'start' },
  ];
  // pater-ll fecha a 1ª dezena e anuncia o 2º Mistério; pater-ul -> 3º;
  // pater-ur -> 4º; pater-lr -> 5º. (o 1º Mistério fica na conta da
  // haste, tratado logo abaixo, fora deste loop.)
  const mysteryNumberForPater = [2, 3, 4, 5];

  paterAnchors.forEach((p, idx) => {
    const info = paterLabelInfo[idx];
    const lx1 = p.pt.x + info.dx,  ly1 = p.pt.y + info.dy;
    const lx2 = p.pt.x + info.dx2, ly2 = p.pt.y + info.dy2;
    const lx3 = p.pt.x + info.dx3, ly3 = p.pt.y + info.dy3;

    drawLeader(p.pt.x, p.pt.y, lx1, ly1);
    drawLabel(lx1, ly1, "Glória ao Pai", `plabel-gl-${idx}`, 'gloria', info.anchor);

    const mNum = mysteryNumberForPater[idx];
    drawLabel(lx2, ly2, `${mNum}º Mistério`, `plabel-myst-${idx}`, `mystery${mNum}`, info.anchor, 'label-mystery');
    // faz a própria conta grande acender também quando o Mistério é exibido
    registerNode(`plabel-myst-${idx}`, `mystery${mNum}`, paterBeadEls[p.id]);

    drawLabel(lx3, ly3, "Pai Nosso", `plabel-pn-${idx}`, 'paiNosso', info.anchor);
  });

  // ---- medalha central ("Salve Rainha", ao final) ----
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
  // rótulo extra: Glória ao Pai final, ao fechar a 5ª dezena, antes da Salve Rainha
  drawLeader(MED.x + 30, MED.y + 18, MED.x + 95, MED.y + 22);
  drawLabel(MED.x + 100, MED.y + 26, "Glória ao Pai", 'medal-gloria-label', 'gloria', 'start');
  registerNode('medal-gloria-label', 'gloria', medG);

  // ---- haste (do medalhão até o crucifixo) ----
  const tailX = MED.x;
  let y = MED.y + 70;

  const firstPaterBead = drawBead({ x: tailX, y }, 11, 'tail-pater-top', 'paiNosso');
  drawLeader(tailX, y, tailX - 78, y - 4);
  drawLabel(tailX - 82, y - 2, "Pai Nosso", 'tail-pn-top-label', 'paiNosso', 'end');
  // 1º Mistério: mesma conta (tail-pater-top), rótulo do lado oposto
  drawLeader(tailX, y, tailX + 78, y - 4);
  drawLabel(tailX + 82, y - 2, "1º Mistério", 'mystery-tail-label', 'mystery1', 'start', 'label-mystery');
  registerNode('mystery-tail-label', 'mystery1', firstPaterBead);

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
   [Glória ao Pai → 2º Mistério → Pai Nosso → 10 Ave Maria] →
   [Glória ao Pai → 3º Mistério → Pai Nosso → 10 Ave Maria] →
   [Glória ao Pai → 4º Mistério → Pai Nosso → 10 Ave Maria] →
   [Glória ao Pai → 5º Mistério → Pai Nosso → 10 Ave Maria] →
   Glória ao Pai → Salve Rainha (última oração da sequência)

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
  sequence.push('cross', 'tail-pater-bottom', 'tail-ave-0', 'tail-ave-1', 'tail-ave-2', 'tail-gloria');
  sequence.push('mystery-tail-alias', 'tail-pater-top');

  const paterCloseIds = [
    { gloria: 'plabel-gl-0', mystery: 'mystery-ll-alias', pater: 'pater-ll' },
    { gloria: 'plabel-gl-1', mystery: 'mystery-ul-alias', pater: 'pater-ul' },
    { gloria: 'plabel-gl-2', mystery: 'mystery-ur-alias', pater: 'pater-ur' },
    { gloria: 'plabel-gl-3', mystery: 'mystery-lr-alias', pater: 'pater-lr' },
  ];

  arcs.forEach((a, idx) => {
    // as 10 Ave Marias da dezena que está sendo fechada/aberta
    for (let i = 0; i < 10; i++) sequence.push(`ave-arc${idx}-${i}`);

    if (idx < 4){
      // fecha esta dezena e abre a próxima: Glória -> próximo Mistério -> Pai Nosso
      const c = paterCloseIds[idx];
      sequence.push(c.gloria, c.mystery, c.pater);
    } else {
      // 5ª e última dezena: só fecha com Glória ao Pai, depois Salve Rainha
      sequence.push('medal-gloria-label', 'medallion');
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