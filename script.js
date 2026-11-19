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
  automation:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3m14 0h3M4.9 4.9 7 7m10 10 2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1"/><path d="M8 12h-3m14 0h-3M12 8V5m0 14v-3"/>',
  optimization:'<path d="M4 18a8 8 0 1 1 16 0"/><path d="m12 14 4-5M6 18h12"/><circle cx="12" cy="14" r="1.5"/>',
  processAutomation:'<rect x="3" y="5" width="6" height="5" rx="1"/><rect x="15" y="14" width="6" height="5" rx="1"/><path d="M9 7.5h3a3 3 0 0 1 3 3V14M12 12l3 3 3-3"/><path d="M6 10v4h6"/>',
  equipment:'<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 4V2m6 2V2M9 22v-2m6 2v-2M4 9H2m2 6H2m20-6h-2m2 6h-2"/><circle cx="12" cy="12" r="3"/><path d="M12 9v6m-3-3h6"/>',
  currentCable:'<path d="M4 4v5a4 4 0 0 0 4 4h8a4 4 0 0 1 4 4v3"/><path d="M2 4h4M18 20h4M12 5l-3 5h4l-1 5 4-7h-4l1-3z"/>',
  gear:'<circle cx="12" cy="12" r="3.2"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.7 2.94-.09-.03a1.7 1.7 0 0 0-1.83.46l-.07.07h-3.4l-.02-.1a1.7 1.7 0 0 0-1.2-1.38 1.7 1.7 0 0 0-1.78.45l-.07.07-2.94-1.7.03-.09a1.7 1.7 0 0 0-.46-1.83l-.07-.07v-3.4l.1-.02a1.7 1.7 0 0 0 1.38-1.2 1.7 1.7 0 0 0-.45-1.78l-.07-.07 1.7-2.94.09.03a1.7 1.7 0 0 0 1.83-.46l.07-.07h3.4l.02.1a1.7 1.7 0 0 0 1.2 1.38 1.7 1.7 0 0 0 1.78-.45l.07-.07 2.94 1.7-.03.09a1.7 1.7 0 0 0 .46 1.83l.07.07v3.4z"/>',
  panel:'<rect x="5" y="2.8" width="14" height="18.4" rx="1.5"/><path d="M8 6.5h8M8 10h3v3H8zM14 10h2M14 13h2M8 17h8M3 6h2M19 18h2"/>',
  monitor:'<rect x="2.5" y="3.5" width="19" height="13" rx="1.5"/><path d="M8 21h8M12 16.5V21M6 12l3-3 2.5 2 4-4 2.5 2"/>',
  tool:'<path d="M14.5 6.5a5 5 0 0 0 6.1 6.1L11 22.2 7.8 19z"/><path d="M5 4l4 4M3 6l4-4M4 20l7-7M15 4l5 5"/>',
  headset:'<path d="M3 13v-1a9 9 0 0 1 18 0v1"/><rect x="2.5" y="12" width="4.5" height="7" rx="1.5"/><rect x="17" y="12" width="4.5" height="7" rx="1.5"/><path d="M17 19c-.8 2-2.5 2.5-5 2.5h-1"/>',
  cap:'<path d="m2 9 10-5 10 5-10 5zM6 11v5c3.5 3 8.5 3 12 0v-5M22 9v6"/>',
  wave:'<path d="M2 12h4l2.2-6 4 12 3.6-9 2.1 3H22"/>',
  check:'<path d="M12 2.8 14.5 5l3.3-.1.9 3.1 2.8 1.8-1 3.1 1 3.1-2.8 1.8-.9 3.1-3.3-.1-2.5 2.2-2.5-2.2-3.3.1-.9-3.1-2.8-1.8 1-3.1-1-3.1 2.8-1.8.9-3.1 3.3.1zM8 12.2l2.6 2.6 5.6-5.7"/>',
  user:'<circle cx="12" cy="6.5" r="3"/><path d="M5 21v-2a7 7 0 0 1 14 0v2M8 13l4 3 4-3M12 16v5"/>',
  chart:'<path d="M3 20.5h18M5 18v-5h4v5M11 18V8h4v10M17 18V3h4v15M4 9l5-4 4 2 6-5"/>',
  target:'<circle cx="11" cy="13" r="8"/><circle cx="11" cy="13" r="4"/><path d="m11 13 9-9M15 4h5v5"/>',
  eye:'<path d="M2 12s3.7-7 10-7 10 7 10 7-3.7 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  hand:'<path d="m3 12 4-4 4 2 3-2 7 5-5 6-4-1-3 1zM8 15l3 3M11 10l4 4M14 8l3 3"/>',
  wire:'<rect x="2.5" y="7" width="6" height="10" rx="1"/><rect x="15.5" y="7" width="6" height="10" rx="1"/><path d="M8.5 12h7M5.5 4v3M18.5 4v3M5.5 17v3M18.5 17v3"/>',
  sensor:'<rect x="4" y="8" width="10" height="8" rx="1.5"/><path d="M14 10h3v4h-3M18 7q4 5 0 10M20 4q6 8 0 16M7 8V5h4v3"/>',
  ladder:'<path d="M4 3v18M20 3v18M4 7h5M15 7h5M9 5v4M15 5v4M4 17h5M15 17h5M9 15v4M15 15v4"/>',
  cable:'<path d="M2 12a4 4 0 1 0 8 0 4 4 0 0 0-8 0zM10 12h3M13 12l8-6M13 12h9M13 12l8 6M4 9l3 6"/>',
  code:'<rect x="2.5" y="3.5" width="19" height="14" rx="1.5"/><path d="M9 21h6M12 17.5V21M10 8l-3 2.5 3 2.5M14 8l3 2.5-3 2.5"/>'
};
$$('.ic[data-i]').forEach(e => e.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${ICO[e.dataset.i] || ''}</svg>`);

// ===== Áreas de atuação: pictogramas industriais mais reconhecíveis =====
const AREA_ICONS = {
  motor:'<rect x="5" y="7" width="13" height="10" rx="2"/><path d="M18 10h2v4h-2M5 10H3v4h2M8 7V5h7v2M9 17v2h5v-2M10 10l4 2-4 2z"/>',
  plc:'<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 8h3v3H8zM14 8h2M14 11h2M8 15h8M10 20v2M14 20v2M2 8h2M20 16h2"/>',
  instrument:'<circle cx="12" cy="12" r="8"/><path d="M12 12l4-4M12 4V2M8 20v2M16 20v2M5 18l-2 2M19 18l2 2"/><circle cx="12" cy="12" r="1.2"/>',
  process:'<path d="M3 19V5M3 19h18M5 16l4-5 3 2 5-7 4 3"/><circle cx="17" cy="6" r="1.2"/>',
  network:'<rect x="3" y="3" width="6" height="5" rx="1"/><rect x="15" y="3" width="6" height="5" rx="1"/><rect x="9" y="16" width="6" height="5" rx="1"/><path d="M6 8v4h12V8M12 12v4"/>',
  integration:'<rect x="8" y="8" width="8" height="8" rx="1"/><path d="M2 12h6M16 12h6M12 2v6M12 16v6M4 9v6M20 9v6"/>'
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
