// ===== Utilitários =====
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const num = id => { const v = $(id).value.trim().replace(',', '.'); return v === '' ? NaN : Number(v); };
const fmt = n => n.toLocaleString('pt-BR', { maximumFractionDigits: 4 });
const err = m => `<p class="err">${m}</p>`;
const on = (ids, fn) => ids.forEach(i => $(i).addEventListener('input', fn));

// ===== Menu, abas, ano e WhatsApp =====
const closeMenu = () => { $('#nav').classList.remove('open'); $('#mb').setAttribute('aria-expanded', false); };
$('#mb').onclick = () => $('#mb').setAttribute('aria-expanded', $('#nav').classList.toggle('open'));
$$('#nav a').forEach(a => a.onclick = closeMenu);
$$('.tab').forEach(t => t.onclick = () => {
  $$('.tab').forEach(x => { x.classList.toggle('on', x === t); x.setAttribute('aria-selected', x === t); });
  $$('.pane').forEach(p => p.hidden = p.id !== t.dataset.p);
});
$('#yr').textContent = new Date().getFullYear();
const WHATSAPP = ''; // Coloque aqui o número: '5511999999999' (55 + DDD + número)
$$('.zap').forEach(z => z.addEventListener('click', e => {
  if (WHATSAPP) { e.preventDefault(); window.open('https://wa.me/' + WHATSAPP, '_blank'); }
  else if (z.closest('#contato')) { e.preventDefault(); alert('Número de WhatsApp ainda não configurado (variável WHATSAPP em script.js).'); }
}));
$$('[data-go]').forEach(b => b.onclick = () => { $('.tab[data-p="' + b.dataset.go + '"]').click(); $('#plat').scrollIntoView(); });

// ===== Ícones industriais: traço consistente, maior leitura e contraste =====
const ICO = {
  automation:'<circle cx="12" cy="12" r="3.2"/><circle cx="12" cy="12" r="8.2"/><path d="M12 1.8v2.4M12 19.8v2.4M1.8 12h2.4M19.8 12h2.4M4.8 4.8l1.7 1.7M17.5 17.5l1.7 1.7M19.2 4.8l-1.7 1.7M6.5 17.5l-1.7 1.7"/>',
  optimization:'<path d="M3.5 18.5a8.5 8.5 0 1 1 17 0"/><path d="M12 14.5l4.5-5M5.5 18.5h13"/><circle cx="12" cy="14.5" r="1.5"/><path d="M12 5v2M5.8 8.2l1.4 1.4M18.2 8.2l-1.4 1.4"/>',
  processAutomation:'<rect x="2.5" y="4" width="6.5" height="5.5" rx="1.2"/><rect x="15" y="14.5" width="6.5" height="5.5" rx="1.2"/><rect x="8.8" y="9.2" width="6.4" height="5.5" rx="1.2"/><path d="M9 6.8h2.2a2 2 0 0 1 2 2v.4M15.2 12h1.2a2 2 0 0 1 2 2v.5M12 14.7v2.1H6v-2.1"/>',
  equipment:'<rect x="4.5" y="4.5" width="15" height="15" rx="2.2"/><path d="M9 2v2.5M15 2v2.5M9 19.5V22M15 19.5V22M2 9h2.5M2 15h2.5M19.5 9H22M19.5 15H22"/><circle cx="12" cy="12" r="3.2"/><path d="M12 9.5v5M9.5 12h5"/>',
  currentCable:'<path d="M4 3v5a4 4 0 0 0 4 4h8a4 4 0 0 1 4 4v5"/><path d="M2 3h4M18 21h4"/><path d="m12 5-3 5h4l-1 5 4-7h-4l1-3z"/>',
  gear:'<circle cx="12" cy="12" r="3"/><path d="M19.4 13.5a7.8 7.8 0 0 0 0-3l1.7-1.3-1.8-3.1-2 .8a7.8 7.8 0 0 0-2.6-1.5L14.4 3h-4.8l-.3 2.4a7.8 7.8 0 0 0-2.6 1.5l-2-.8-1.8 3.1 1.7 1.3a7.8 7.8 0 0 0 0 3l-1.7 1.3 1.8 3.1 2-.8a7.8 7.8 0 0 0 2.6 1.5l.3 2.4h4.8l.3-2.4a7.8 7.8 0 0 0 2.6-1.5l2 .8 1.8-3.1z"/>',
  panel:'<rect x="5" y="2.5" width="14" height="19" rx="1.8"/><path d="M8 6h8M8 9.5h3v3H8zM14 10h2M14 12.5h2M8 16h8M3 6h2M19 18h2"/><circle cx="16" cy="16" r=".7"/>',
  monitor:'<rect x="2.5" y="3.5" width="19" height="13.5" rx="1.8"/><path d="M8 21h8M12 17v4M5.5 13l4-4 3 2.5 5-5 1.5 1.5"/><circle cx="17.5" cy="6.5" r="1"/>',
  tool:'<path d="M14.5 6.2a5.2 5.2 0 0 0 6.2 6.2L11 22l-4-4 9.5-9.5"/><path d="m5 3 5 5M3 5l5-5M4 20l5-5"/>',
  headset:'<path d="M3 13v-1a9 9 0 0 1 18 0v1"/><rect x="2.5" y="12" width="4.5" height="7" rx="1.7"/><rect x="17" y="12" width="4.5" height="7" rx="1.7"/><path d="M17 19c-.8 2-2.5 2.5-5 2.5h-1.5"/><circle cx="12" cy="21.5" r=".5"/>',
  cap:'<path d="m2 9 10-5 10 5-10 5z"/><path d="M6 11v5.2c3.5 3 8.5 3 12 0V11M22 9v6"/><path d="M19 16v3"/>',
  wave:'<path d="M2 12h4l2.5-6.5L13 19l3.2-10 2.3 3H22"/><circle cx="8.5" cy="5.5" r=".8"/>',
  check:'<path d="M12 2.5 14.7 5l3.6-.1 1 3.4 3 1.9-1.1 3.4 1.1 3.4-3 1.9-1 3.4-3.6-.1L12 24l-2.7-2.5-3.6.1-1-3.4-3-1.9 1.1-3.4-1.1-3.4 3-1.9 1-3.4 3.6.1z"/><path d="m7.5 12.5 3 3 6-6"/>',
  user:'<circle cx="12" cy="7" r="3.2"/><path d="M5 21v-2a7 7 0 0 1 14 0v2M8 13l4 3 4-3M12 16v5"/>',
  chart:'<path d="M3 21h18M5 18v-5h4v5M11 18V8h4v10M17 18V3h4v15"/><path d="m4 9 5-4 4 2 6-5"/><path d="M17 2h2v2"/>',
  target:'<circle cx="11" cy="13" r="8"/><circle cx="11" cy="13" r="4"/><path d="m11 13 9-9M15 4h5v5"/>',
  eye:'<path d="M2 12s3.7-7 10-7 10 7 10 7-3.7 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  hand:'<path d="M4 12.5 8 9l3 1.5 3-2 6 4.5-5 6-4-1-3 1-4-6.5z"/><path d="m8 15 3 3m0-7 4 4m-1-6 3 3"/>',
  wire:'<rect x="2.5" y="7" width="6" height="10" rx="1.2"/><rect x="15.5" y="7" width="6" height="10" rx="1.2"/><path d="M8.5 12h7M5.5 4v3M18.5 4v3M5.5 17v3M18.5 17v3"/><circle cx="5.5" cy="12" r="1"/><circle cx="18.5" cy="12" r="1"/>',
  sensor:'<rect x="3" y="8" width="11" height="8" rx="1.5"/><path d="M14 10h3v4h-3M18 7q4 5 0 10M20 4q6 8 0 16M6 8V5h5v3"/><circle cx="8.5" cy="12" r="1"/>',
  ladder:'<path d="M4 2.5v19M20 2.5v19M4 6h5M15 6h5M9 4v4M15 4v4M4 18h5M15 18h5M9 16v4M15 16v4"/><path d="M9 11h6M12 9v4"/>',
  cable:'<circle cx="5.5" cy="12" r="3.5"/><path d="M9 12h4M13 12l8-6M13 12h8M13 12l8 6"/><circle cx="5.5" cy="12" r="1"/>',
  code:'<rect x="2.5" y="3.5" width="19" height="14" rx="1.8"/><path d="M9 21h6M12 17.5V21M10 8l-3 2.5 3 2.5M14 8l3 2.5-3 2.5"/>'
};
$$('.ic[data-i]').forEach(e => e.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${ICO[e.dataset.i] || ''}</svg>`);

// ===== Áreas de atuação: pictogramas industriais mais reconhecíveis =====
const AREA_ICONS = {
  motor:'<rect x="4" y="7" width="14" height="10" rx="2"/><path d="M18 10h3v4h-3M4 10H2v4h2M7 7V5h8v2M8 17v2h6v-2M9 10l5 2-5 2z"/><path d="M11 5V3"/>',
  plc:'<rect x="4" y="3" width="16" height="18" rx="2"/><rect x="7" y="6" width="4" height="4" rx=".5"/><path d="M14 7h3M14 10h3M7 14h10M7 17h3M13 17h4M2 8h2M20 16h2"/>',
  instrument:'<circle cx="12" cy="12" r="8.5"/><path d="M12 12l4.5-4.5M12 3.5V2M8 20v2M16 20v2M5 18l-2 2M19 18l2 2"/><circle cx="12" cy="12" r="1.5"/>',
  process:'<path d="M3 20V4M3 20h18"/><path d="m5 16 4-5 3 2 5-7 3 2"/><circle cx="17" cy="6" r="1.2"/><path d="M7 4h4"/>',
  network:'<rect x="2.5" y="3" width="7" height="5.5" rx="1"/><rect x="14.5" y="3" width="7" height="5.5" rx="1"/><rect x="8.5" y="16" width="7" height="5" rx="1"/><path d="M6 8.5v3.5h12V8.5M12 12v4"/>',
  integration:'<rect x="7.5" y="7.5" width="9" height="9" rx="1.5"/><path d="M2 12h5.5M16.5 12H22M12 2v5.5M12 16.5V22"/><path d="m4 9-2 3 2 3m16-6 2 3-2 3M9 4l3-2 3 2m-6 16 3 2 3-2"/>'
};
const areas = [
  ['Controle de Motores','Partida, controle e acionamento de motores elétricos.','motor'],
  ['Programação de CLP','Lógica, Ladder, automação e controle.','plc'],
  ['Instrumentação Industrial','Sensores, transmissores e instrumentos de medição.','instrument'],
  ['Controle de Processos','Temperatura, pressão, nível e vazão.','process'],
  ['Comunicação Industrial','Redes e protocolos industriais.','network'],
  ['Integração de Equipamentos','Comunicação entre equipamentos, sistemas e dispositivos.','integration']
];
$('#areas').innerHTML = areas.map(a => `<article class="card area-card"><svg class="area-icon" viewBox="0 0 24 24" aria-hidden="true">${AREA_ICONS[a[2]]}</svg><h3>${a[0]}</h3><p>${a[1]}</p></article>`).join('');

// ===== Ferramenta 1: Conversor de sinais =====
const SIG = { '4–20 mA': [4, 20, 'mA'], '0–20 mA': [0, 20, 'mA'], '0–10 V': [0, 10, 'V'], '0–5 V': [0, 5, 'V'], 'Faixa personalizada': [0, 10, ''] };
$('#s_type').innerHTML = Object.keys(SIG).map(k => `<option>${k}</option>`).join('');
function setSig() {
  const t = $('#s_type').value, c = t === 'Faixa personalizada';
  if (!c) { [$('#s_xmin').value, $('#s_xmax').value, $('#s_su').value] = SIG[t]; }
  ['#s_xmin', '#s_xmax', '#s_su'].forEach(i => $(i).disabled = !c);
  calcS();
}
function calcS() {
  const e2s = $('#s_mode').value === 'e2s', out = $('#s_out');
  $('#s_vl').textContent = e2s ? 'Valor de engenharia' : 'Valor do sinal';
  let xa = num('#s_xmin'), xb = num('#s_xmax'), ya = num('#s_ymin'), yb = num('#s_ymax'), v = num('#s_v');
  if ([xa, xb, ya, yb, v].some(isNaN)) return out.innerHTML = err('Preencha todos os campos com números válidos.');
  if (xa === xb || ya === yb) return out.innerHTML = err('Os limites mínimo e máximo não podem ser iguais.');
  if ($('#s_inv').checked) [ya, yb] = [yb, ya];
  const su = $('#s_su').value, eu = $('#s_eu').value;
  const p = e2s ? (v - ya) / (yb - ya) : (v - xa) / (xb - xa);
  const r = e2s ? xa + p * (xb - xa) : ya + p * (yb - ya);
  out.innerHTML = `<div class="val">${fmt(r)} <small>${e2s ? su : eu}</small></div>
    <p>Entrada: ${fmt(v)} ${e2s ? eu : su} · Escala: ${fmt(p * 100)}%</p>
    <div class="bar"><i style="width:${Math.min(100, Math.max(0, p * 100))}%"></i></div>
    ${p < 0 || p > 1 ? err('Valor fora da faixa: resultado extrapolado.') : ''}`;
}
$('#s_type').onchange = setSig;
on(['#s_mode', '#s_v', '#s_xmin', '#s_xmax', '#s_su', '#s_ymin', '#s_ymax', '#s_eu', '#s_inv'], calcS);
$('#s_mode').onchange = calcS; $('#s_inv').onchange = calcS;
setSig();

// ===== Ferramenta 2: Conversor de unidades =====
// Cada unidade: [para a base, da base]
const lin = k => [v => v * k, v => v / k];
const UN = {
  'Pressão': { bar: lin(1), kPa: lin(.01), psi: lin(.0689476) },
  'Temperatura': { '°C': [v => v, v => v], '°F': [v => (v - 32) * 5 / 9, v => v * 9 / 5 + 32], 'K': [v => v - 273.15, v => v + 273.15] },
  'Comprimento': { mm: lin(.001), m: lin(1) },
  'Volume': { 'L': lin(.001), 'm³': lin(1) },
  'Frequência e rotação': { Hz: lin(1), RPM: lin(1 / 60) }
};
$('#u_c').innerHTML = Object.keys(UN).map(k => `<option>${k}</option>`).join('');
function fillU() {
  const us = Object.keys(UN[$('#u_c').value]);
  $('#u_a').innerHTML = us.map(u => `<option>${u}</option>`).join('');
  $('#u_b').innerHTML = us.map((u, i) => `<option${i === 1 ? ' selected' : ''}>${u}</option>`).join('');
  calcU();
}
function calcU() {
  const c = $('#u_c').value, v = num('#u_v'), a = $('#u_a').value, b = $('#u_b').value, o = $('#u_out');
  $('#u_n').hidden = c !== 'Frequência e rotação';
  if (isNaN(v)) return o.innerHTML = err('Digite um valor numérico.');
  const base = UN[c][a][0](v);
  if (c === 'Temperatura' ? base < -273.15 : v < 0) return o.innerHTML = err(c === 'Temperatura' ? 'Temperatura abaixo do zero absoluto.' : 'Esta grandeza não aceita valores negativos.');
  o.innerHTML = `<div class="val">${fmt(UN[c][b][1](base))} <small>${b}</small></div><p>${fmt(v)} ${a} =</p>`;
}
$('#u_c').onchange = fillU; $('#u_a').onchange = calcU; $('#u_b').onchange = calcU; on(['#u_v'], calcU);
fillU();

// ===== Ferramenta 3: Calculadora elétrica =====
function calcE() {
  const m = $('#e_m').value, V = num('#e_v'), P = num('#e_p') * 1000, fp = num('#e_fp'), n = num('#e_n') / 100, o = $('#e_out');
  $('#e_x').hidden = m === 'dc';
  if (isNaN(V) || isNaN(P) || V <= 0 || P <= 0) return o.innerHTML = err('Informe tensão e potência maiores que zero.');
  if (m !== 'dc' && (isNaN(fp) || isNaN(n) || fp <= 0 || fp > 1 || n <= 0 || n > 1)) return o.innerHTML = err('Fator de potência: entre 0 e 1. Rendimento: entre 0 e 100%.');
  const F = { dc: ['I = P / V', P / V], mono: ['I = P / (V · FP · η)', P / (V * fp * n)], tri: ['I = P / (√3 · V · FP · η)', P / (Math.sqrt(3) * V * fp * n)] }[m];
  o.innerHTML = `<div class="val">${fmt(F[1])} <small>A</small></div><p class="fm">${F[0]}</p>
    <p>V = ${fmt(V)} V · P = ${fmt(P / 1000)} kW${m === 'dc' ? '' : ` · FP = ${fmt(fp)} · η = ${fmt(n * 100)}%`}</p>`;
}
on(['#e_v', '#e_p', '#e_fp', '#e_n'], calcE); $('#e_m').onchange = calcE; calcE();

// ===== Ferramenta 3b: RTD PT100 (IEC 60751) =====
const PA = 3.9083e-3, PB = -5.775e-7, PC = -4.183e-12;
const rt = T => 100 * (1 + PA * T + PB * T * T + (T < 0 ? PC * (T - 100) * T ** 3 : 0));
function calcR() {
  const R = num('#r_v'), o = $('#r_out');
  if (isNaN(R)) return o.innerHTML = err('Digite a resistência em ohms.');
  if (R < rt(-200) || R > rt(850)) return o.innerHTML = err('Fora da faixa: ' + fmt(rt(-200)) + ' a ' + fmt(rt(850)) + ' Ω.');
  let a = -200, b = 850;                       // bisseção: rt() é crescente
  for (let i = 0; i < 60; i++) { const m = (a + b) / 2; rt(m) < R ? a = m : b = m; }
  const T = (a + b) / 2;
  o.innerHTML = `<div class="bx"><div class="m">Temperatura</div><div class="val">${fmt(Math.round(T * 100) / 100)} <small>°C</small></div></div>
    <div class="sc"><span>Fahrenheit (°F)</span><b>${fmt(T * 9 / 5 + 32)}</b></div><div class="sc"><span>Kelvin (K)</span><b>${fmt(T + 273.15)}</b></div>`;
}
on(['#r_v'], calcR); calcR();

// ===== Ferramenta 4: Corrente dos cabos (cobre) =====
const SEC = [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150];
const IA = [[15, 21, 28, 36, 50, 68, 89, 111, 134, 171, 207, 239, 275], [19, 27, 36, 46, 66, 88, 117, 144, 175, 222, 269, 312, 358]]; // PVC, XLPE
const RES = [12.1, 7.41, 4.61, 3.08, 1.83, 1.15, .727, .524, .387, .268, .193, .153, .124]; // Ω/km a 20 °C
$('#c_s').innerHTML = SEC.map((s, i) => `<option value="${i}">${fmt(s)} mm²</option>`).join('');
$('#c_t').innerHTML = '<tr><th>Seção (mm²)</th><th>PVC 70 °C (A)</th><th>XLPE/EPR 90 °C (A)</th></tr>' + SEC.map((s, i) => `<tr data-i="${i}"><td>${fmt(s)}</td><td>${IA[0][i]}</td><td>${IA[1][i]}</td></tr>`).join('');
function calcC() {
  const k = +$('#c_i').value, i = +$('#c_s').value, I = num('#c_a'), L = num('#c_l');
  $$('#c_t tr[data-i]').forEach(r => r.classList.toggle('on', +r.dataset.i === i));
  let h = `<div class="bx"><div class="m">Corrente admissível</div><div class="val">${IA[k][i]} <small>A</small></div></div><div class="sc"><span>Resistência do condutor</span><b>${fmt(RES[i])} Ω/km</b></div>`;
  if (isNaN(I) || isNaN(L) || I < 0 || L < 0) h += err('Informe corrente e comprimento válidos (≥ 0).');
  else h += `<div class="sc"><span>Queda de tensão ΔV</span><b>${fmt(2 * I * L * RES[i] / 1000)} V</b></div>` + (I > IA[k][i] ? err('A corrente informada excede a capacidade de referência desta seção.') : '');
  $('#c_out').innerHTML = h;
}
['#c_i', '#c_s'].forEach(i => $(i).onchange = calcC); on(['#c_a', '#c_l'], calcC); calcC();

// ===== Ferramenta 5: Guia de sensores =====
// nome | categoria | funcionamento | aplicações | vantagens | limitações
const SENS = [
  'Indutivo|Proximidade|Campo eletromagnético detecta metais sem contato.|Fim de curso, contagem de peças metálicas.|Robusto, sem desgaste.|Só detecta metais; alcance curto.',
  'Capacitivo|Proximidade|Detecta variação de capacitância (metais, líquidos, plásticos, pós).|Nível em tanques e silos.|Detecta vários materiais.|Sensível a umidade e sujeira.',
  'Fotoelétrico|Óptico|Emissor e receptor de luz detectam interrupção ou reflexão.|Esteiras, embalagem, contagem.|Longo alcance e resposta rápida.|Sujeira e luz ambiente interferem.',
  'Ultrassônico|Distância|Mede o tempo de eco de uma onda sonora.|Nível de tanques, distância.|Sem contato; vários materiais.|Afetado por vapor, espuma e temperatura.',
  'RTD / PT100|Temperatura|A resistência da platina varia com a temperatura (100 Ω a 0 °C).|Processos e fluidos.|Precisão e estabilidade.|Resposta mais lenta; usa 3 ou 4 fios.',
  'Termopar|Temperatura|Tensão gerada na junção de dois metais diferentes (efeito Seebeck).|Fornos e altas temperaturas.|Faixa ampla, robusto, barato.|Menos preciso; exige compensação de junta fria.',
  'Pressão|Pressão|Elemento sensível se deforma e gera sinal elétrico (ex.: 4–20 mA).|Linhas, bombas, tanques.|Saída padronizada.|Sensível a sobrepressão; exige calibração.',
  'Nível|Nível|Mede por boia, pressão hidrostática, radar ou ultrassom.|Tanques e silos.|Há tecnologia para cada fluido.|A escolha depende do meio (espuma, vapor).',
  'Vazão|Vazão|Eletromagnético, Coriolis, vórtex ou turbina medem o fluxo.|Dosagem e balanço de massa.|Medição contínua.|Cada tecnologia tem restrições de fluido e instalação.',
  'Encoder|Posição|Disco codificado gera pulsos de posição e velocidade.|Motores e posicionamento.|Alta resolução.|Sensível a vibração e sujeira.'
].map(s => s.split('|'));
let cat = 'Todos';
function showSens() {
  const q = $('#q').value.toLowerCase().trim();
  const r = SENS.filter(s => (cat === 'Todos' || s[1] === cat) && (s[0] + ' ' + s[1]).toLowerCase().includes(q));
  $('#sens').innerHTML = r.length ? r.map(s => `<article class="card"><small>${s[1]}</small><h3>${s[0]}</h3><p>${s[2]}</p><p><b>Aplicações:</b> ${s[3]}</p><p><b>Vantagens:</b> ${s[4]}</p><p><b>Limitações:</b> ${s[5]}</p></article>`).join('') : err('Nenhum sensor encontrado. Tente outro termo.');
}
on(['#q'], showSens); showSens();
$('#cats').innerHTML = ['Todos', ...new Set(SENS.map(s => s[1]))].map(c => `<button data-c="${c}" class="${c === 'Todos' ? 'on' : ''}">${c}</button>`).join('');
$('#cats').onclick = e => { const b = e.target.closest('button'); if (!b) return; cat = b.dataset.c; $$('#cats button').forEach(x => x.classList.toggle('on', x === b)); showSens(); };

const TC_DATA = {"B":{"min":0,"max":1820,"segments":[{"min":0,"max":630.615,"c":[0,-0.00024650818346,0.0000059040421171,-1.3257931636e-9,1.5668291901e-12,-1.694452924e-15,6.2990347094e-19],"exp":null},{"min":630.615,"max":1820,"c":[-3.8938168621,0.02857174747,-0.000084885104785,1.5785280164e-7,-1.6835344864e-10,1.1109794013e-13,-4.4515431033e-17,9.8975640821e-21,-9.3791330289e-25],"exp":null}]},"E":{"min":-270,"max":1000,"segments":[{"min":-270,"max":0,"c":[0,0.058665508708,0.000045410977124,-7.7998048686e-7,-2.5800160843e-8,-5.9452583057e-10,-9.3214058667e-12,-1.0287605534e-13,-8.0370123621e-16,-4.3979497391e-18,-1.6414776355e-20,-3.9673619516e-23,-5.5827328721e-26,-3.4657842013e-29],"exp":null},{"min":0,"max":1000,"c":[0,0.05866550871,0.000045032275582,2.8908407212e-8,-3.3056896652e-10,6.502440327e-13,-1.9197495504e-16,-1.2536600497e-18,2.1489217569e-21,-1.4388041782e-24,3.5960899481e-28],"exp":null}]},"J":{"min":-210,"max":1200,"segments":[{"min":-210,"max":760,"c":[0,0.050381187815,0.00003047583693,-8.568106572e-8,1.3228195295e-10,-1.7052958337e-13,2.0948090697e-16,-1.2538395336e-19,1.5631725697e-23],"exp":null},{"min":760,"max":1200,"c":[296.45625681,-1.4976127786,0.0031787103924,-0.0000031847686701,1.5720819004e-9,-3.0691369056e-13],"exp":null}]},"K":{"min":-270,"max":1372,"segments":[{"min":-270,"max":0,"c":[0,0.039450128025,0.000023622373598,-3.2858906784e-7,-4.9904828777e-9,-6.7509059173e-11,-5.7410327428e-13,-3.1088872894e-15,-1.0451609365e-17,-1.9889266878e-20,-1.6322697486e-23],"exp":null},{"min":0,"max":1372,"c":[-0.017600413686,0.038921204975,0.000018558770032,-9.9457592874e-8,3.1840945719e-10,-5.6072844889e-13,5.6075059059e-16,-3.2020720003e-19,9.7151147152e-23,-1.2104721275e-26],"exp":{"a0":0.1185976,"a1":-0.0001183432,"a2":126.9686}}]},"N":{"min":-270,"max":1300,"segments":[{"min":-270,"max":0,"c":[0,0.026159105962,0.000010957484228,-9.3841111554e-8,-4.6412039759e-11,-2.6303357716e-12,-2.2653438003e-14,-7.6089300791e-17,-9.3419667835e-20],"exp":null},{"min":0,"max":1300,"c":[0,0.025929394601,0.00001571014188,4.3825627237e-8,-2.5261169794e-10,6.4311819339e-13,-1.0063471519e-15,9.9745338992e-19,-6.0863245607e-22,2.0849229339e-25,-3.0682196151e-29],"exp":null}]},"R":{"min":-50,"max":1768.1,"segments":[{"min":-50,"max":1064.18,"c":[0,0.00528961729765,0.0000139166589782,-2.38855693017e-8,3.56916001063e-11,-4.62347666298e-14,5.00777441034e-17,-3.73105886191e-20,1.57716482367e-23,-2.81038625251e-27],"exp":null},{"min":1064.18,"max":1664.5,"c":[2.95157925316,-0.00252061251332,0.0000159564501865,-7.64085947576e-9,2.05305291024e-12,-2.93359668173e-16],"exp":null},{"min":1664.5,"max":1768.1,"c":[152.232118209,-0.268819888545,0.000171280280471,-3.45895706453e-8,-9.34633971046e-15],"exp":null}]},"S":{"min":-50,"max":1768.1,"segments":[{"min":-50,"max":1064.18,"c":[0,0.00540313308631,0.000012593428974,-2.32477968689e-8,3.22028823036e-11,-3.31465196389e-14,2.55744251786e-17,-1.25068871393e-20,2.71443176145e-24],"exp":null},{"min":1064.18,"max":1664.5,"c":[1.32900444085,0.00334509311344,0.00000654805192818,-1.64856259209e-9,1.29989605174e-14],"exp":null},{"min":1664.5,"max":1768.1,"c":[146.628232636,-0.258430516752,0.000163693574641,-3.30439046987e-8,-9.43223690612e-15],"exp":null}]},"T":{"min":-270,"max":400,"segments":[{"min":-270,"max":0,"c":[0,0.038748106364,0.000044194434347,1.1844323105e-7,2.0032973554e-8,9.0138019559e-10,2.2651156593e-11,3.6071154205e-13,3.8493939883e-15,2.8213521925e-17,1.4251594779e-19,4.8768662286e-22,1.079553927e-24,1.3945027062e-27,7.9795153927e-31],"exp":null},{"min":0,"max":400,"c":[0,0.038748106364,0.00003329222788,2.0618243404e-7,-2.1882256846e-9,1.0996880928e-11,-3.0815758772e-14,4.547913529e-17,-2.7512901673e-20],"exp":null}]}};

// ===== Ferramenta 8: Conversor de termopares (NIST ITS-90) =====
const TC_NAMES = {
  B: 'Platina-ródio / platina-ródio',
  E: 'Cromel / constantan',
  J: 'Ferro / constantan',
  K: 'Cromel / alumel',
  N: 'Nicrosil / nisil',
  R: 'Platina-ródio 13% / platina',
  S: 'Platina-ródio 10% / platina',
  T: 'Cobre / constantan'
};
const tcType = $('#tc_type');
tcType.innerHTML = Object.keys(TC_DATA).map(k => `<option value="${k}">Tipo ${k}</option>`).join('');
function tcPoly(coeffs, x) {
  let y = 0;
  for (let i = coeffs.length - 1; i >= 0; i--) y = y * x + coeffs[i];
  return y;
}
function tcEmf(type, temp) {
  const spec = TC_DATA[type];
  if (!spec || temp < spec.min || temp > spec.max) throw new Error('Temperatura fora da faixa de referência.');
  const seg = spec.segments.find((s, i) => temp >= s.min && (temp < s.max || i === spec.segments.length - 1));
  let emf = tcPoly(seg.c, temp);
  if (seg.exp && temp >= 0) emf += seg.exp.a0 * Math.exp(seg.exp.a1 * Math.pow(temp - seg.exp.a2, 2));
  return emf;
}
function tcTemperature(type, emf) {
  const spec = TC_DATA[type];
  // Tipo B não é unívoco abaixo de aproximadamente 250 °C.
  let lo = type === 'B' ? 250 : spec.min;
  let hi = spec.max;
  let flo = tcEmf(type, lo), fhi = tcEmf(type, hi);
  if (emf < flo - 1e-9 || emf > fhi + 1e-9) {
    if (type === 'B' && emf < flo) throw new Error('No tipo B, a conversão mV → °C não é unívoca abaixo de aproximadamente 250 °C. Use a tabela ou informe a temperatura dentro da faixa válida de inversão.');
    throw new Error('Tensão compensada fora da faixa de referência deste termopar.');
  }
  for (let i = 0; i < 90; i++) {
    const mid = (lo + hi) / 2;
    if (tcEmf(type, mid) < emf) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}
function tcUpdateInfo() {
  const type = tcType.value, spec = TC_DATA[type];
  $('#tc_range').textContent = `${fmt(spec.min)} a ${fmt(spec.max)} °C`;
  $('#tc_pair').textContent = TC_NAMES[type];
  $('#tc_mode_label').textContent = $('#tc_mode').value === 'mv2t' ? 'Tensão medida (mV)' : 'Temperatura da junta quente (°C)';
  $('#tc_ref_label').textContent = $('#tc_mode').value === 'mv2t' ? 'Temperatura da junta de referência (°C)' : 'Temperatura da junta de referência (°C)';
  $('#tc_value').value = $('#tc_mode').value === 'mv2t' ? '4.096' : '100';
  $('#tc_ref').value = '0';
  calcTC();
}
function calcTC() {
  const type = tcType.value, mode = $('#tc_mode').value;
  const value = num('#tc_value'), ref = num('#tc_ref'), out = $('#tc_out');
  if (!Number.isFinite(value) || !Number.isFinite(ref)) return out.innerHTML = err('Informe valores numéricos válidos.');
  try {
    const refEmf = tcEmf(type, ref);
    if (mode === 'mv2t') {
      const hotEmf = value + refEmf;
      const temp = tcTemperature(type, hotEmf);
      out.innerHTML = `<div class="bx"><div class="m">Temperatura da junta quente</div><div class="val">${fmt(temp)} <small>°C</small></div></div>
        <div class="sc"><span>mV medido</span><b>${fmt(value)} mV</b></div>
        <div class="sc"><span>Compensação da junta de referência</span><b>${fmt(refEmf)} mV</b></div>
        <div class="sc"><span>mV equivalente a 0 °C</span><b>${fmt(hotEmf)} mV</b></div>
        <p class="note">A compensação foi calculada somando a FEM da junta de referência à tensão medida.</p>`;
    } else {
      const hotEmf = tcEmf(type, value);
      const measured = hotEmf - refEmf;
      out.innerHTML = `<div class="bx"><div class="m">Tensão entre os terminais</div><div class="val">${fmt(measured)} <small>mV</small></div></div>
        <div class="sc"><span>FEM da junta quente (referência 0 °C)</span><b>${fmt(hotEmf)} mV</b></div>
        <div class="sc"><span>FEM da junta de referência</span><b>${fmt(refEmf)} mV</b></div>
        <p class="note">Resultado diferencial: FEM da junta quente menos FEM da junta de referência.</p>`;
    }
  } catch (e) {
    out.innerHTML = err(e.message);
  }
}
tcType.onchange = tcUpdateInfo;
$('#tc_mode').onchange = tcUpdateInfo;
on(['#tc_value', '#tc_ref'], calcTC);
$('#tc_table').innerHTML = '<thead><tr><th>Tipo</th><th>Faixa de referência</th><th>Par termoelétrico</th></tr></thead><tbody>' +
  Object.keys(TC_DATA).map(k => `<tr><td><b>${k}</b></td><td>${fmt(TC_DATA[k].min)} a ${fmt(TC_DATA[k].max)} °C</td><td>${TC_NAMES[k]}</td></tr>`).join('') + '</tbody>';
tcUpdateInfo();
