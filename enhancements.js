(() => {
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const fmt = n => Number(n).toLocaleString('pt-BR',{maximumFractionDigits:4});
  const num = id => { const s=$(id)?.value?.trim().replace(',','.'); return s===''||s==null?NaN:Number(s); };
  const err = s => `<p class="err">${s}</p>`;
  const lin = k => [v=>v*k,v=>v/k];

  // Recria a área das ferramentas sem alterar o restante do site.
  const plat=$('#plat');
  plat.innerHTML = `
    <div class="tabs" role="tablist" aria-label="Ferramentas técnicas">
      <button class="tab" role="tab" aria-selected="false" data-p="p-signal">Sinais</button>
      <button class="tab on" role="tab" aria-selected="true" data-p="p-un">Unidades</button>
      <button class="tab" role="tab" aria-selected="false" data-p="p-rtd">RTD PT100</button>
      <button class="tab" role="tab" aria-selected="false" data-p="p-ele">Corrente e cabos</button>
      <button class="tab" role="tab" aria-selected="false" data-p="p-sens">Sensores</button>
      <button class="tab" role="tab" aria-selected="false" data-p="p-panel">Dimensionamento de painéis</button>
      <button class="tab" role="tab" aria-selected="false" data-p="p-thermo">Termopares</button>
    </div>
    <div class="pane" id="p-signal" hidden>
      <div class="in"><h3>Conversor de sinais industriais</h3>
        <label for="s-type">Tipo de sinal</label><select id="s-type"><option>4–20 mA</option><option>0–20 mA</option><option>0–10 V</option><option>0–5 V</option><option>Personalizado</option></select>
        <label for="s-mode">Conversão</label><select id="s-mode"><option value="s2e">Sinal → engenharia</option><option value="e2s">Engenharia → sinal</option></select>
        <label for="s-value" id="s-value-label">Valor do sinal</label><input id="s-value" value="12" inputmode="decimal">
        <div class="row"><div><label for="s-min">Sinal mínimo</label><input id="s-min" value="4" inputmode="decimal"></div><div><label for="s-max">Sinal máximo</label><input id="s-max" value="20" inputmode="decimal"></div><div><label for="s-unit">Unidade do sinal</label><input id="s-unit" value="mA"></div></div>
        <div class="row"><div><label for="s-eng-min">Engenharia mínima</label><input id="s-eng-min" value="0" inputmode="decimal"></div><div><label for="s-eng-max">Engenharia máxima</label><input id="s-eng-max" value="100" inputmode="decimal"></div><div><label for="s-eng-unit">Unidade de engenharia</label><input id="s-eng-unit" value="%"></div></div>
        <label class="chk"><input type="checkbox" id="s-invert"> Inverter escala de engenharia</label>
      </div><div class="out"><h3>Resultado</h3><div id="s-result" aria-live="polite"></div><p class="fm">Y = Ymín + (X − Xmín) / (Xmáx − Xmín) × (Ymáx − Ymín)</p></div>
    </div>
    <div class="pane" id="p-un">
      <div class="in"><h3>Conversor de unidades</h3><p class="m">Conversões usuais em instrumentação, elétrica e processos industriais.</p>
        <label for="un-cat">Grandeza</label><select id="un-cat"></select>
        <label for="un-val">Valor</label><input id="un-val" inputmode="decimal" value="1">
        <div class="row"><div><label for="un-from">De</label><select id="un-from"></select></div><div><label for="un-to">Para</label><select id="un-to"></select></div></div>
      </div><div class="out"><h3>Resultado</h3><div id="un-out" aria-live="polite"></div><p class="note">Para coluna d'água, considera água com densidade de referência de 1.000 kg/m³ e gravidade padrão de 9,80665 m/s².</p></div>
    </div>
    <div class="pane" id="p-rtd" hidden>
      <div class="in"><h3>Conversor RTD – PT100</h3><p class="m">Conversão bidirecional conforme IEC 60751, R₀ = 100 Ω a 0 °C.</p>
        <label for="r-mode">Tipo de conversão</label><select id="r-mode"><option value="r2t">Resistência → temperatura</option><option value="t2r">Temperatura → resistência</option></select>
        <div id="r-res-box"><label for="r-res">Resistência (Ω)</label><input id="r-res" inputmode="decimal" value="138,50"></div>
        <div id="r-temp-box" hidden><label for="r-temp">Temperatura informada</label><input id="r-temp" inputmode="decimal" value="100"><label for="r-unit">Unidade da temperatura</label><select id="r-unit"><option>°C</option><option>°F</option><option>K</option></select></div>
        <div class="fm fixed-eq">R(T) = R₀ · [1 + A·T + B·T² + C·(T − 100)·T³ (para T &lt; 0 °C)]<br>R₀ = 100 Ω · A = 3,9083×10⁻³ · B = −5,775×10⁻⁷ · C = −4,183×10⁻¹²</div>
      </div><div class="out"><h3>Resultado</h3><div id="r-result" aria-live="polite"></div><p class="note">Faixa nominal considerada: −200 a 850 °C. Para aplicações reais, considere classe do sensor, ligação a 2/3/4 fios e tolerância do conjunto.</p></div>
    </div>
    <div class="pane" id="p-ele" hidden>
      <div class="in"><h3>Calculadora de corrente e dimensionamento de cabos</h3>
        <div class="warning-big"><strong>ATENÇÃO — ESTIMATIVA PRELIMINAR</strong><br>Os resultados são referenciais e não substituem projeto elétrico, consulta à NBR 5410, método de instalação, fatores de correção, agrupamento, temperatura ambiente, queda de tensão admissível e coordenação das proteções.</div>
        <label for="el-mode">Sistema elétrico</label><select id="el-mode"><option value="dc">Corrente contínua (CC)</option><option value="mono">Monofásico</option><option value="tri" selected>Trifásico</option></select>
        <div class="row"><div><label for="el-v">Tensão (V)</label><input id="el-v" value="380" inputmode="decimal"></div><div><label for="el-p">Potência (kW)</label><input id="el-p" value="5,5" inputmode="decimal"></div></div>
        <div class="row" id="el-factors"><div><label for="el-fp">Fator de potência</label><input id="el-fp" value="0,85" inputmode="decimal"></div><div><label for="el-eta">Rendimento (%)</label><input id="el-eta" value="90" inputmode="decimal"></div></div>
        <hr class="soft-hr"><h3>Verificação do cabo</h3>
        <div class="row"><div><label for="el-ins">Isolação</label><select id="el-ins"><option value="0">PVC (70 °C)</option><option value="1">XLPE/EPR (90 °C)</option></select></div><div><label for="el-sec">Seção do cabo</label><select id="el-sec"></select></div></div>
        <div class="row"><div><label for="el-len">Comprimento (m)</label><input id="el-len" value="50" inputmode="decimal"></div><div><label for="el-par">Condutores em paralelo por fase</label><input id="el-par" value="1" min="1" step="1" inputmode="numeric"></div></div>
      </div><div class="out"><h3>Resultados do cálculo</h3><div id="el-out" aria-live="polite"></div>
        <div class="scroll"><table id="el-table"></table></div>
      </div>
      <div class="equations"><h3>Equações utilizadas — referência fixa</h3>
        <div class="equation-grid"><div><b>CC</b><code>I = P / V</code></div><div><b>Monofásico</b><code>I = P / (V · FP · η)</code></div><div><b>Trifásico</b><code>I = P / (√3 · V · FP · η)</code></div><div><b>Queda de tensão monofásica / CC</b><code>ΔV = 2 · I · L · R / (1000 · n)</code></div><div><b>Queda de tensão trifásica</b><code>ΔV = √3 · I · L · R / (1000 · n)</code></div><div><b>Percentual</b><code>ΔV% = (ΔV / V) · 100</code></div></div>
        <p class="m">R em Ω/km a 20 °C; L em metros; n = número de condutores em paralelo por fase. A tabela de ampacidade é uma referência simplificada para cobre, 30 °C e 3 condutores carregados.</p>
      </div>
    </div>
    <div class="pane one" id="p-sens" hidden><div class="sensor-banner"><img src="assets/sensors.webp" alt="Sensores e instrumentos industriais"></div><div class="in"><h3>Sensores e instrumentos industriais (24)</h3><p class="m">Consulte o princípio de funcionamento e exemplos de aplicação na indústria.</p><label for="sens-q">Buscar instrumento</label><input id="sens-q" type="search" placeholder="Ex.: nível, vazão, pressão, motor"><div id="sens-cats" class="chips"></div><div id="sens-list" class="grid sg"></div></div></div>
    <div class="pane one" id="p-panel" hidden><div class="in"><h3>Dimensionador preliminar de painéis elétricos</h3>
      <div class="warning-big"><strong>ATENÇÃO — ESTIMATIVA DE MATERIAIS</strong><br>Esta ferramenta reproduz os critérios e fórmulas da planilha fornecida. A lista deve ser revisada conforme arquitetura do CLP, fabricantes, padrão construtivo, dissipação térmica, curto-circuito, reserva técnica e projeto executivo.</div>
      <h3>Configuração de I/O</h3><div class="panel-io" id="panel-io"></div>
      <h3>Dimensões e estrutura</h3><div class="row"><div><label for="pn-h">Altura do painel (m)</label><input id="pn-h" value="2,10" inputmode="decimal"></div><div><label for="pn-w">Largura do painel (m)</label><input id="pn-w" value="0,80" inputmode="decimal"></div><div><label for="pn-door">Número de portas</label><input id="pn-door" value="1" min="1" step="1" inputmode="numeric"></div></div>
      <button class="btn sm" id="pn-calc" type="button">Atualizar dimensionamento</button>
      </div><div class="out"><h3>Lista estimada de materiais</h3><div id="pn-results" aria-live="polite"></div><h3>Estimativa de cabos por cor</h3><div id="pn-cables"></div><div class="bom-download"><p class="m">Baixe a relação completa de materiais e cabos para conferência e cotação.</p><button class="btn" id="pn-download" type="button" disabled>Baixar lista de materiais (CSV)</button></div><div class="bx"><div class="m">Dimensão informada</div><div class="val" id="pn-dim">2,10 × 0,80 m</div></div></div>
    </div>
    <div class="pane" id="p-thermo" hidden>
      <div class="in"><h3>Conversor de termopares – ITS-90</h3>
        <label for="tc_type">Tipo de termopar</label><select id="tc_type"></select>
        <div class="sc"><span>Faixa de referência</span><b id="tc_range">—</b></div>
        <div class="sc"><span>Par termoelétrico</span><b id="tc_pair">—</b></div>
        <label for="tc_mode">Conversão</label><select id="tc_mode"><option value="mv2t">Tensão (mV) → Temperatura (°C)</option><option value="t2mv">Temperatura (°C) → Tensão (mV)</option></select>
        <label for="tc_value" id="tc_mode_label">Tensão medida (mV)</label><input id="tc_value" inputmode="decimal" value="4.096">
        <label for="tc_ref">Temperatura da junta de referência (°C)</label><input id="tc_ref" inputmode="decimal" value="0">
        <p class="note">Informe 0 °C quando a medição já estiver compensada pelo instrumento ou quando usar uma junta de referência em banho de gelo. Caso contrário, informe a temperatura real dos terminais de referência.</p>
      </div>
      <div class="out" aria-live="polite"><h3>Resultado</h3><div id="tc_out"></div>
        <p class="fm">E<sub>quente</sub> = E<sub>medida</sub> + E(T<sub>referência</sub>)</p>
      </div>
      <div class="in tc-reference"><h3>Faixas dos tipos de termopar</h3><div class="scroll"><table id="tc_table" class="tc-table"></table></div>
        <p class="note">Faixas das funções de referência ITS-90; não representam necessariamente a faixa operacional contínua de qualquer sonda comercial. Consulte a classe de tolerância, o revestimento e os limites do fabricante.</p>
        <p class="note">No tipo B, a relação FEM-temperatura não é unívoca na região inferior a aproximadamente 250 °C; por isso, a conversão inversa é limitada à região em que há uma única solução.</p>
      </div>
    </div>
  `;

  // Inicializa o conversor de termopares após recriar a área de ferramentas.
  const tcNames = {
    B:'Platina-ródio / platina-ródio', E:'Cromel / constantan',
    J:'Ferro / constantan', K:'Cromel / alumel', N:'Nicrosil / nisil',
    R:'Platina-ródio 13% / platina', S:'Platina-ródio 10% / platina',
    T:'Cobre / constantan'
  };
  const tcType=$('#tc_type');
  tcType.innerHTML=Object.keys(TC_DATA).map(k=>`<option value="${k}">Tipo ${k}</option>`).join('');
  function tcPoly(coeffs,x){let y=0;for(let i=coeffs.length-1;i>=0;i--)y=y*x+coeffs[i];return y;}
  function tcEmf(type,temp){
    const spec=TC_DATA[type];
    if(!spec||temp<spec.min||temp>spec.max)throw new Error('Temperatura fora da faixa de referência.');
    const seg=spec.segments.find((s,i)=>temp>=s.min&&(temp<s.max||i===spec.segments.length-1));
    let emf=tcPoly(seg.c,temp);
    if(seg.exp&&temp>=0)emf+=seg.exp.a0*Math.exp(seg.exp.a1*Math.pow(temp-seg.exp.a2,2));
    return emf;
  }
  function tcTemperature(type,emf){
    const spec=TC_DATA[type];let lo=type==='B'?250:spec.min,hi=spec.max;
    const flo=tcEmf(type,lo),fhi=tcEmf(type,hi);
    if(emf<flo-1e-9||emf>fhi+1e-9){
      if(type==='B'&&emf<flo)throw new Error('No tipo B, a conversão mV → °C não é unívoca abaixo de aproximadamente 250 °C.');
      throw new Error('Tensão compensada fora da faixa de referência deste termopar.');
    }
    for(let i=0;i<90;i++){const mid=(lo+hi)/2;if(tcEmf(type,mid)<emf)lo=mid;else hi=mid;}
    return (lo+hi)/2;
  }
  function calcTC(){
    const type=tcType.value,mode=$('#tc_mode').value,value=num('#tc_value'),ref=num('#tc_ref'),out=$('#tc_out');
    if(!Number.isFinite(value)||!Number.isFinite(ref))return out.innerHTML=err('Informe valores numéricos válidos.');
    try{
      const refEmf=tcEmf(type,ref);
      if(mode==='mv2t'){
        const hotEmf=value+refEmf,temp=tcTemperature(type,hotEmf);
        out.innerHTML=`<div class="bx"><div class="m">Temperatura da junta quente</div><div class="val">${fmt(temp)} <small>°C</small></div></div>
          <div class="sc"><span>mV medido</span><b>${fmt(value)} mV</b></div>
          <div class="sc"><span>Compensação da junta de referência</span><b>${fmt(refEmf)} mV</b></div>
          <div class="sc"><span>mV equivalente a 0 °C</span><b>${fmt(hotEmf)} mV</b></div>
          <p class="note">A compensação foi calculada somando a FEM da junta de referência à tensão medida.</p>`;
      }else{
        const hotEmf=tcEmf(type,value),measured=hotEmf-refEmf;
        out.innerHTML=`<div class="bx"><div class="m">Tensão calculada nos terminais</div><div class="val">${fmt(measured)} <small>mV</small></div></div>
          <div class="sc"><span>Temperatura informada</span><b>${fmt(value)} °C</b></div>
          <div class="sc"><span>FEM da junta quente (referência 0 °C)</span><b>${fmt(hotEmf)} mV</b></div>
          <div class="sc"><span>Compensação da junta de referência</span><b>${fmt(refEmf)} mV</b></div>
          <p class="note">${Math.abs(ref)<1e-12?'Como a junta de referência está a 0 °C, a tensão calculada é a FEM tabelada do termopar.':'Tensão nos terminais = FEM da junta quente − FEM da junta de referência.'}</p>`;
      }
    }catch(e){out.innerHTML=err(e.message);}
  }
  function updateTCInfo(){
    const type=tcType.value,spec=TC_DATA[type];
    $('#tc_range').textContent=`${fmt(spec.min)} a ${fmt(spec.max)} °C`;
    $('#tc_pair').textContent=tcNames[type];
    $('#tc_mode_label').textContent=$('#tc_mode').value==='mv2t'?'Tensão medida (mV)':'Temperatura da junta quente (°C)';
    calcTC();
  }
  tcType.addEventListener('change',updateTCInfo);
  $('#tc_mode').addEventListener('change',()=>{$('#tc_value').value=$('#tc_mode').value==='mv2t'?'4.096':'100';updateTCInfo();});
  ['#tc_value','#tc_ref'].forEach(id=>$(id).addEventListener('input',calcTC));
  $('#tc_table').innerHTML='<thead><tr><th>Tipo</th><th>Faixa de referência</th><th>Par termoelétrico</th></tr></thead><tbody>'+
    Object.keys(TC_DATA).map(k=>`<tr><td><b>${k}</b></td><td>${fmt(TC_DATA[k].min)} a ${fmt(TC_DATA[k].max)} °C</td><td>${tcNames[k]}</td></tr>`).join('')+'</tbody>';
  updateTCInfo();

  // Navegação das ferramentas e páginas independentes do site.
  const tabs=[...plat.querySelectorAll('.tab')], panes=[...plat.querySelectorAll('.pane')];
  function openPane(id){tabs.forEach(t=>{const active=t.dataset.p===id;t.classList.toggle('on',active);t.setAttribute('aria-selected',String(active));});panes.forEach(p=>p.hidden=p.id!==id);}
  tabs.forEach(t=>t.addEventListener('click',()=>openPane(t.dataset.p)));

  const main=$('main');
  const homeNodes=[main.querySelector('#inicio'),main.querySelector('.strip'),main.querySelector('.home-highlights'),main.querySelector('.home-highlights + .cta')];
  const pageMap={inicio:homeNodes,sobre:[$('#sobre')],servicos:[$('#servicos')],portfolio:[$('#portfolio')],ferramentas:[$('#ferramentas')],ligacoes:[$('#ligacoes')],contato:[$('#contato')]};
  const mainChildren=[...main.children];
  function showPage(name,scroll=true){
    const selected=pageMap[name]||pageMap.inicio;
    mainChildren.forEach(node=>{node.hidden=!selected.includes(node);});
    document.querySelectorAll('#nav a[href^="#"], .ft nav a[href^="#"], a[href="#inicio"]').forEach(a=>{
      const key=a.getAttribute('href').slice(1);a.classList.toggle('active',key===name);
    });
    if(scroll) window.scrollTo({top:0,behavior:'auto'});
    closeMenuIfAvailable();
  }
  function closeMenuIfAvailable(){const nav=$('#nav'),mb=$('#mb');if(nav){nav.classList.remove('open');}if(mb)mb.setAttribute('aria-expanded','false');}
  document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{
    const key=a.getAttribute('href').slice(1);
    if(pageMap[key]){e.preventDefault();showPage(key);history.replaceState(null,'','#'+key);}
  }));
  document.querySelectorAll('[data-open-page]').forEach(b=>b.addEventListener('click',()=>{
    const page=b.dataset.openPage;
    if(pageMap[page]){
      showPage(page);
      history.replaceState(null,'','#'+page);
    }
  }));
  document.querySelectorAll('[data-go]').forEach(b=>{b.onclick=null;b.addEventListener('click',()=>{
    showPage('ferramentas');
    const map={p1:'p-signal',p2:'p-un',p3:'p-ele',p4:'p-ele',p5:'p-sens',p6:'p-rtd',p7:'p-panel',p8:'p-thermo'};
    openPane(map[b.dataset.go]||b.dataset.go);
    $('#plat').scrollIntoView({behavior:'auto',block:'start'});
  });});
  const initial=location.hash.slice(1);
  showPage(pageMap[initial]?initial:'inicio',false);

  // Conversor de sinais industriais preservado do site original.
  const signalRanges={'4–20 mA':[4,20,'mA'],'0–20 mA':[0,20,'mA'],'0–10 V':[0,10,'V'],'0–5 V':[0,5,'V']};
  function calcSignal(){const reverse=$('#s-mode').value==='e2s';$('#s-value-label').textContent=reverse?'Valor de engenharia':'Valor do sinal';const v=num('#s-value'),smin=num('#s-min'),smax=num('#s-max'),emin=num('#s-eng-min'),emax=num('#s-eng-max'),o=$('#s-result');if([v,smin,smax,emin,emax].some(x=>!Number.isFinite(x)))return o.innerHTML=err('Preencha os campos com valores numéricos.');if(smin===smax||emin===emax)return o.innerHTML=err('Os limites mínimo e máximo não podem ser iguais.');let a=emin,b=emax;if($('#s-invert').checked)[a,b]=[b,a];const p=reverse?(v-a)/(b-a):(v-smin)/(smax-smin);const result=reverse?smin+p*(smax-smin):a+p*(b-a);const unit=reverse?$('#s-unit').value:$('#s-eng-unit').value;o.innerHTML=`<div class="val">${fmt(result)} <small>${unit}</small></div><p>Escala: ${fmt(p*100)}%</p><div class="bar"><i style="width:${Math.max(0,Math.min(100,p*100))}%"></i></div>${p<0||p>1?err('Valor fora da faixa configurada; resultado extrapolado.'):''}`;}
  $('#s-type').addEventListener('change',()=>{const v=$('#s-type').value;if(signalRanges[v]){$('#s-min').value=signalRanges[v][0];$('#s-max').value=signalRanges[v][1];$('#s-unit').value=signalRanges[v][2];}calcSignal();});
  ['#s-mode','#s-value','#s-min','#s-max','#s-unit','#s-eng-min','#s-eng-max','#s-eng-unit','#s-invert'].forEach(s=>$(s).addEventListener('input',calcSignal));calcSignal();

  // Conversor de unidades.
  const U={
    'Pressão':{'Pa':lin(1),'kPa':lin(1000),'MPa':lin(1e6),'bar':lin(1e5),'mbar':lin(100),'psi':lin(6894.757293),'atm':lin(101325),'mmHg':lin(133.322368),'mmH₂O':lin(9.80665),'mH₂O':lin(9806.65),'mca':lin(9806.65)},
    'Temperatura':{'°C':[v=>v+273.15,v=>v-273.15],'°F':[v=>(v-32)*5/9+273.15,v=>(v-273.15)*9/5+32],'K':[v=>v,v=>v]},
    'Comprimento':{'mm':lin(.001),'cm':lin(.01),'m':lin(1),'km':lin(1000),'pol (in)':lin(.0254),'ft':lin(.3048)},
    'Área':{'mm²':lin(1e-6),'cm²':lin(1e-4),'m²':lin(1),'ha':lin(10000)},
    'Volume':{'mL':lin(1e-6),'L':lin(.001),'m³':lin(1),'cm³':lin(1e-6),'gal (EUA)':lin(.003785411784)},
    'Vazão volumétrica':{'L/min':lin(1/60000),'L/h':lin(1/3600000),'m³/h':lin(1/3600),'m³/s':lin(1),'mL/min':lin(1/60000000)},
    'Massa':{'mg':lin(1e-6),'g':lin(.001),'kg':lin(1),'t':lin(1000)},
    'Velocidade':{'m/s':lin(1),'km/h':lin(1/3.6),'ft/s':lin(.3048)},
    'Frequência e rotação':{'Hz':lin(1),'kHz':lin(1000),'RPM':lin(1/60),'rps':lin(1)},
    'Corrente elétrica':{'µA':lin(1e-6),'mA':lin(.001),'A':lin(1),'kA':lin(1000)},
    'Tensão elétrica':{'mV':lin(.001),'V':lin(1),'kV':lin(1000)},
    'Resistência elétrica':{'mΩ':lin(.001),'Ω':lin(1),'kΩ':lin(1000),'MΩ':lin(1e6)},
    'Potência':{'W':lin(1),'kW':lin(1000),'MW':lin(1e6),'cv':lin(735.49875),'hp':lin(745.699872)},
    'Energia':{'J':lin(1),'kJ':lin(1000),'Wh':lin(3600),'kWh':lin(3600000),'cal':lin(4.184)}
  };
  const uc=$('#un-cat'),uf=$('#un-from'),ut=$('#un-to');
  uc.innerHTML=Object.keys(U).map(x=>`<option>${x}</option>`).join('');
  function fillUnits(){const a=Object.keys(U[uc.value]);uf.innerHTML=a.map(x=>`<option>${x}</option>`).join('');ut.innerHTML=a.map((x,i)=>`<option ${i===1?'selected':''}>${x}</option>`).join('');calcUnits();}
  function calcUnits(){const v=num('#un-val'),a=uf.value,b=ut.value,c=uc.value,o=$('#un-out');if(!Number.isFinite(v))return o.innerHTML=err('Digite um valor numérico válido.');const base=U[c][a][0](v);if(c==='Temperatura'&&base<0)return o.innerHTML=err('Temperatura abaixo do zero absoluto.');o.innerHTML=`<div class="val">${fmt(U[c][b][1](base))} <small>${b}</small></div><p>${fmt(v)} ${a} = ${fmt(U[c][b][1](base))} ${b}</p>`;}
  uc.addEventListener('change',fillUnits);uf.addEventListener('change',calcUnits);ut.addEventListener('change',calcUnits);$('#un-val').addEventListener('input',calcUnits);fillUnits();

  // PT100 IEC 60751, conversão bidirecional.
  const A=3.9083e-3,B=-5.775e-7,C=-4.183e-12;
  const rtd=t=>100*(1+A*t+B*t*t+(t<0?C*(t-100)*t**3:0));
  function tempToC(v,u){return u==='°F'?(v-32)*5/9:u==='K'?v-273.15:v;}
  function solveT(R){let lo=-200,hi=850;for(let i=0;i<80;i++){const mid=(lo+hi)/2;if(rtd(mid)<R)lo=mid;else hi=mid;}return (lo+hi)/2;}
  function calcRTD(){const mode=$('#r-mode').value,o=$('#r-result');$('#r-res-box').hidden=mode!=='r2t';$('#r-temp-box').hidden=mode!=='t2r';if(mode==='r2t'){const R=num('#r-res');if(!Number.isFinite(R))return o.innerHTML=err('Informe a resistência em ohms.');if(R<rtd(-200)||R>rtd(850))return o.innerHTML=err(`Fora da faixa: ${fmt(rtd(-200))} a ${fmt(rtd(850))} Ω.`);const t=solveT(R);o.innerHTML=`<div class="bx"><div class="m">Temperatura</div><div class="val">${fmt(t)} <small>°C</small></div></div><div class="sc"><span>Fahrenheit</span><b>${fmt(t*9/5+32)} °F</b></div><div class="sc"><span>Kelvin</span><b>${fmt(t+273.15)} K</b></div>`;}else{const v=num('#r-temp'),u=$('#r-unit').value;if(!Number.isFinite(v))return o.innerHTML=err('Informe a temperatura.');const t=tempToC(v,u);if(t< -200||t>850)return o.innerHTML=err('Temperatura fora da faixa de −200 a 850 °C.');o.innerHTML=`<div class="bx"><div class="m">Resistência calculada</div><div class="val">${fmt(rtd(t))} <small>Ω</small></div></div><div class="sc"><span>Temperatura em Celsius</span><b>${fmt(t)} °C</b></div><div class="sc"><span>Temperatura em Fahrenheit</span><b>${fmt(t*9/5+32)} °F</b></div><div class="sc"><span>Temperatura em Kelvin</span><b>${fmt(t+273.15)} K</b></div>`;}}
  ['#r-mode','#r-res','#r-temp','#r-unit'].forEach(s=>{ $(s).addEventListener('input',calcRTD); $(s).addEventListener('change',calcRTD); });calcRTD();

  // Corrente + cabos em um único bloco.
  const SEC=[1.5,2.5,4,6,10,16,25,35,50,70,95,120,150];
  const IA=[[15,21,28,36,50,68,89,111,134,171,207,239,275],[19,27,36,46,66,88,117,144,175,222,269,312,358]];
  const RES=[12.1,7.41,4.61,3.08,1.83,1.15,.727,.524,.387,.268,.193,.153,.124];
  $('#el-sec').innerHTML=SEC.map((v,i)=>`<option value="${i}">${fmt(v)} mm²</option>`).join('');
  $('#el-table').innerHTML='<tr><th>Seção (mm²)</th><th>PVC 70 °C (A)</th><th>XLPE/EPR 90 °C (A)</th></tr>'+SEC.map((v,i)=>`<tr data-i="${i}"><td>${fmt(v)}</td><td>${IA[0][i]}</td><td>${IA[1][i]}</td></tr>`).join('');
  function calcElectrical(){const mode=$('#el-mode').value,V=num('#el-v'),P=num('#el-p')*1000,fp=num('#el-fp'),eta=num('#el-eta')/100,ins=+$('#el-ins').value,idx=+$('#el-sec').value,L=num('#el-len'),par=num('#el-par'),o=$('#el-out');$('#el-factors').hidden=mode==='dc';if(!(V>0&&P>0))return o.innerHTML=err('Informe tensão e potência maiores que zero.');if(mode!=='dc'&&(!(fp>0&&fp<=1)||!(eta>0&&eta<=1)))return o.innerHTML=err('FP deve estar entre 0 e 1 e rendimento entre 0 e 100%.');if(!(L>=0&&par>=1&&Number.isInteger(par)))return o.innerHTML=err('Comprimento deve ser ≥ 0 e condutores em paralelo deve ser inteiro ≥ 1.');const I=mode==='dc'?P/V:mode==='mono'?P/(V*fp*eta):P/(Math.sqrt(3)*V*fp*eta);const amp=IA[ins][idx]*par,drop=(mode==='tri'?Math.sqrt(3):2)*I*L*RES[idx]/(1000*par),pct=drop/V*100;$$('#el-table tr[data-i]').forEach(r=>r.classList.toggle('on',+r.dataset.i===idx));o.innerHTML=`<div class="bx"><div class="m">Corrente estimada</div><div class="val">${fmt(I)} <small>A</small></div></div><div class="sc"><span>Capacidade de referência do cabo</span><b>${fmt(amp)} A</b></div><div class="sc"><span>Queda de tensão estimada</span><b>${fmt(drop)} V (${fmt(pct)}%)</b></div><div class="sc"><span>Resistência de referência</span><b>${fmt(RES[idx])} Ω/km</b></div>${I>amp?err('A corrente calculada supera a ampacidade de referência selecionada.'):''}<p class="m">Sistema: ${mode==='dc'?'CC':mode==='mono'?'monofásico':'trifásico'} · Seção: ${fmt(SEC[idx])} mm² · Paralelos/fase: ${par}</p>`;}
  ['#el-mode','#el-v','#el-p','#el-fp','#el-eta','#el-ins','#el-sec','#el-len','#el-par'].forEach(s=>$(s).addEventListener('input',calcElectrical));calcElectrical();

  // Catálogo de 24 sensores e instrumentos fornecido pelo usuário.
  const SENS=[
    ['Pt100','Temperatura','Funciona pela variação da resistência elétrica de um elemento de platina conforme a temperatura.','Monitoramento e controle de temperatura em reatores, tanques, tubulações, trocadores de calor e processos industriais.'],
    ['Termopares','Temperatura','Geram uma tensão elétrica a partir da diferença de temperatura entre duas junções de metais diferentes.','Fornos, caldeiras, motores, estufas e processos industriais de alta temperatura.'],
    ['Sensor indutivo','Detecção e posição','Gera um campo eletromagnético que detecta a presença de objetos metálicos sem contato físico.','Detecção de peças metálicas, contagem de produtos, confirmação de posição e presença em máquinas.'],
    ['Sensor capacitivo','Detecção e posição','Detecta objetos pela alteração da capacitância elétrica causada pela aproximação de materiais. Pode identificar sólidos, líquidos e materiais não metálicos.','Detecção de nível em silos e tanques, presença de plásticos, grãos, pós e líquidos em linhas de produção.'],
    ['Sensor magnético','Detecção e posição','Detecta campos magnéticos por meio de elementos sensíveis, identificando a presença de ímãs ou componentes magnéticos.','Detecção de posição de êmbolos em cilindros pneumáticos, sistemas de segurança e confirmação de posição.'],
    ['Sensor de vibração','Vibração','Detecta oscilações mecânicas e transforma essas vibrações em sinais elétricos.','Monitoramento de motores, bombas, ventiladores e rolamentos para identificar desbalanceamento, desalinhamento e falhas mecânicas.'],
    ['Transmissor de nível','Nível','Mede a quantidade ou altura de um líquido ou sólido dentro de um reservatório.','Controle contínuo de tanques, silos, reservatórios, caldeiras e processos de armazenamento.'],
    ['Transmissor de vazão','Vazão','Mede a quantidade de fluido que passa por uma tubulação em determinado intervalo de tempo.','Controle de consumo de água, produtos químicos, combustíveis e outros fluidos industriais.'],
    ['Vazão por placa de orifício','Vazão','Utiliza uma restrição na tubulação para gerar uma diferença de pressão proporcional à vazão do fluido.','Medição de líquidos, gases e vapor em linhas de processo, utilidades e balanços de consumo.'],
    ['Vazão por diferencial de temperatura','Vazão','Utiliza a transferência de calor entre um sensor aquecido e o fluido para determinar sua velocidade ou vazão.','Medição de gases, ar comprimido, sistemas de ventilação e monitoramento de fluxo de ar.'],
    ['Transmissor com efeito Coriolis','Vazão','Mede a vazão mássica por meio das forças geradas pelo movimento do fluido em tubos vibratórios.','Dosagem de produtos químicos, combustíveis, alimentos e processos que exigem alta precisão mássica.'],
    ['Sonda de Brix','Processos e análise','Mede a concentração de açúcar em líquidos por meio da análise de suas propriedades ópticas.','Indústria alimentícia, sucroalcooleira, fabricação de bebidas, xaropes e controle de concentração.'],
    ['Transmissor de pressão','Pressão','Converte a pressão de um fluido em um sinal elétrico proporcional à grandeza medida.','Controle de bombas, compressores, tubulações, filtros, caldeiras e reservatórios.'],
    ['Transdutor','Medição','Converte uma grandeza física em outro tipo de sinal, geralmente elétrico, permitindo sua medição.','Medição de pressão, força, temperatura, deslocamento, peso e outras grandezas em máquinas e processos.'],
    ['Sensor de deslocamento','Detecção e posição','Mede a distância ou movimentação de um objeto em relação a uma referência.','Posicionamento de máquinas, controle dimensional, medição de curso e sistemas automatizados.'],
    ['Pick Up','Rotação e velocidade','Utiliza a variação do campo magnético causada pela passagem de dentes ou elementos metálicos para gerar pulsos elétricos.','Medição de rotação e velocidade de motores, turbinas, redutores e eixos dentados.'],
    ['Encoder','Rotação e posição','Converte o movimento rotativo ou linear em sinais elétricos que indicam posição, velocidade e sentido de movimento.','Motores, esteiras transportadoras, máquinas CNC, elevadores e sistemas de posicionamento.'],
    ['pHmetro','Processos e análise','Mede o nível de acidez ou alcalinidade de uma solução por meio de um eletrodo sensível à concentração de íons hidrogênio.','Tratamento de água e efluentes, indústrias químicas, alimentícias, bebidas e controle de processos.'],
    ['Condutivímetro','Processos e análise','Mede a capacidade de uma solução conduzir corrente elétrica, relacionada à quantidade de íons dissolvidos.','Tratamento de água, osmose reversa, controle de qualidade, caldeiras e processos químicos.'],
    ['Pressostato','Pressão','Dispositivo que comuta seus contatos elétricos quando a pressão atinge um valor previamente ajustado.','Acionamento e desligamento automático de bombas e compressores, alarmes e proteção de sistemas pressurizados.'],
    ['Fim de curso','Detecção e posição','Detecta a chegada de uma parte móvel a uma posição limite por meio de acionamento mecânico.','Portões automáticos, elevadores, máquinas operatrizes, cilindros e limites de movimento.'],
    ['Radar','Nível','Utiliza ondas eletromagnéticas refletidas pela superfície de um material para determinar sua distância ou nível.','Medição de nível de líquidos e sólidos em tanques, silos e reservatórios, inclusive em condições severas.'],
    ['Chave boia','Nível','Utiliza um mecanismo flutuante que acompanha o nível do líquido e aciona contatos elétricos em determinadas posições.','Acionamento automático de bombas, controle de nível mínimo/máximo e prevenção de transbordamentos.'],
    ['Inversor de frequência','Controle de motores','Controla a velocidade e o torque de motores elétricos por meio da variação da frequência e tensão fornecidas ao motor.','Bombas, ventiladores, esteiras, misturadores, compressores e sistemas de automação industrial.']
  ];
  let sensorCat='Todos';const cats=['Todos',...new Set(SENS.map(x=>x[1]))];
  $('#sens-cats').innerHTML=cats.map(c=>`<button type="button" data-cat="${c}" class="${c==='Todos'?'on':''}">${c}</button>`).join('');
  function showSensors(){const q=$('#sens-q').value.toLocaleLowerCase('pt-BR');const list=SENS.filter(s=>(sensorCat==='Todos'||s[1]===sensorCat)&&s.join(' ').toLocaleLowerCase('pt-BR').includes(q));$('#sens-list').innerHTML=list.map((s,i)=>`<article class="card sensor-entry"><small>${s[1]}</small><h3>${s[0]}</h3><p><b>Funcionamento:</b> ${s[2]}</p><p><b>Aplicações industriais:</b> ${s[3]}</p></article>`).join('')||err('Nenhum instrumento encontrado.');}
  $('#sens-q').addEventListener('input',showSensors);$('#sens-cats').addEventListener('click',e=>{const b=e.target.closest('button[data-cat]');if(!b)return;sensorCat=b.dataset.cat;$$('#sens-cats button').forEach(x=>x.classList.toggle('on',x===b));showSensors();});showSensors();

  // Dimensionador de painéis: expressões da planilha anexada (Planilha1).
  const io=[['Entradas digitais','di',16],['Entradas digitais (válvulas)','div',16],['Saídas digitais','do',16],['Saídas digitais (válvulas)','dov',16],['Entradas analógicas','ai',8],['Saídas analógicas','ao',4],['Entradas PT100','pt',8],['Entradas termopar','tc',8]];
  $('#panel-io').innerHTML=io.map(([name,key,q])=>`<div class="panel-io-row"><label for="pn-${key}">${name} — I/Os por cartão</label><input id="pn-${key}" type="number" min="0" step="1" value="${q}"><label for="pn-${key}-cards">Cartões</label><input id="pn-${key}-cards" type="number" min="0" step="1" value="1"></div>`).join('');
  const get=(k)=>({n:num(`#pn-${k}`),c:num(`#pn-${k}-cards`)});
  let lastBom=[];
  function calcPanel(){const v=Object.fromEntries(io.map(x=>[x[1],get(x[1])]));const H=num('#pn-h'),W=num('#pn-w'),D=num('#pn-door');if([H,W,D,...Object.values(v).flatMap(x=>[x.n,x.c])].some(x=>!Number.isFinite(x)||x<0)||H<=.6||W<=0||D<1)return $('#pn-results').innerHTML=err('Confira as quantidades, cartões e dimensões. Altura deve ser maior que 0,60 m, largura maior que zero e portas ≥ 1.');
    const {di,div,do:dout,dov,ai,ao,pt,tc}=v;
    const dup={DI:di.n*di.c+2*di.c,'DI válvulas':div.n*.5*div.c+2*div.c,DO:2*dout.c,'DO válvulas':dov.n*dov.c+2*dov.c,AI:2*ai.n*ai.c,AO:ao.c,PT100:pt.c,Termopar:tc.c};
    const pass={AI:ai.n*ai.c,AO:ao.n*ao.c,PT100:pt.n*pt.c*3,Termopar:tc.n*tc.c};
    const fuseTerm={'DI válvulas':div.n*div.c,'AI':ai.n*ai.c*2,'AO':ao.n*ao.c,'Termopar':tc.n*tc.c};
    const fuses={DI:dup.DI,'DI válvulas':fuseTerm['DI válvulas']+dup['DI válvulas'],DO:dup.DO,'DO válvulas':dup['DO válvulas'],AI:fuseTerm.AI,AO:fuseTerm.AO,PT100:pt.c,Termopar:fuseTerm.Termopar};
    const relayBases=dout.n*dout.c+dov.n*dov.c, relays=relayBases;
    const terminals={DI:dup.DI*4+di.n*di.c, 'DI válvulas':fuseTerm['DI válvulas']*2+dup['DI válvulas']*4, DO:dout.n*dout.c*4+dup.DO*4, 'DO válvulas':dov.n*dov.c*4+dup['DO válvulas']*4, AI:fuseTerm.AI*2+pass.AI*2,AO:ao.n*ao.c*2+pass.AO*2,PT100:pt.n*pt.c*4+pass.PT100*2,Termopar:tc.n*tc.c*4+pass.Termopar*2+fuseTerm.Termopar*2};
    const fonte=(di.c+div.c+dout.c+dov.c>1?1:0)+(ai.c+ao.c+pt.c+tc.c>1?1:0);
    const totalCards=Object.values(v).reduce((s,x)=>s+x.c,0);
    const materials=[
      ['Bornes duplos',Object.values(dup).reduce((s,x)=>s+x,0),'Conexão dos sinais de campo e módulos.'],
      ['Bornes passantes',Object.values(pass).reduce((s,x)=>s+x,0),'Interligação dos sinais analógicos e de temperatura.'],
      ['Bornes fusíveis',Object.values(fuseTerm).reduce((s,x)=>s+x,0),'Proteção dos circuitos indicados na configuração.'],
      ['Fusíveis',Object.values(fuses).reduce((s,x)=>s+x,0),'Proteção individual dos circuitos.'],
      ['Bases de relés',relayBases,'Bases para relés de interface das saídas digitais.'],['Relés',relays,'Interface de acionamento das cargas.'],
      ['Terminais (ponteira)',Object.values(terminals).reduce((s,x)=>s+x,0),'Acabamento e conexão dos condutores.'],
      ['Borne identificador',totalCards+div.c+dov.c,'Um para cada cartão; dois para cada cartão de válvulas.'],
      ['Disjuntor 10 A (monopolar)',fonte+2,'Proteção dos circuitos de alimentação.'],['Fonte 24 Vcc',fonte,'Alimentação dos circuitos de comando.'],
      ['Switch',1,'Comunicação industrial entre CLP, IHM e dispositivos.'],['Barra de aterramento (m)',(H-.6)*2,'Distribuição do condutor de proteção.'],
      ['Caixa de distribuição',2,'Distribuição e organização das ligações internas.'],['Bornes 4 mm² para alimentação',3,'Três bornes de 4 mm² para alimentação.'],
      ['Canaleta (m)',H*2+3*W+2*(H-.6),'Organização e separação dos cabos internos.'],['Porta-documentos',1,'Acondicionamento dos diagramas e documentos do painel.'],
      ['Termostato',1,'Controle automático da temperatura interna.'],['Calefator',1,'Aquecimento para reduzir condensação.'],['Grade do calefator',1,'Proteção mecânica do calefator.'],
      ['Luminária',1,'Iluminação interna para inspeção e manutenção.'],['Fim de curso',D,'Detecção da abertura/fechamento das portas.'],['Tomada',1,'Ponto de energia para manutenção.'],
      ['Ventilador',D,'Um ventilador por porta.'],['Proteção do ventilador',D*2,'Duas proteções por porta.'],['Grade/filtro de ventilação',D*2,'Admissão e exaustão de ar com retenção de partículas.']
    ];
    const f=(x)=>Math.max(0,x);const route=(H-.3)*.8+W*.5;
    const cables=[['Verde',route*di.n*di.c+route*div.n*div.c],['Azul',route*dout.n*dout.c+route*dov.n*dov.c],['Amarelo',route*ai.n*ai.c+route*pt.n*pt.c*3+route*tc.n*tc.c],['Marrom',route*ao.n*ao.c*2],['Vermelho',(H-.3+W*.5)*ai.n*ai.c+dov.n*.5+totalCards*.3+route*dup['DI válvulas']],['Preto',(H-.3+W*.5)*ai.n*ai.c+totalCards*.3]];
    const total=materials.filter(x=>!x[0].includes('(m)')).reduce((s,x)=>s+(Number.isFinite(x[1])?x[1]:0),0);
    const cableDescriptions={'Verde':'Entradas digitais','Azul':'Saídas digitais','Amarelo':'Entradas analógicas','Marrom':'Saídas analógicas','Vermelho':'Positivo (+24 Vcc)','Preto':'Negativo (0 Vcc)'};
    lastBom=[...materials.map(([name,qty,description])=>({name,qty,unit:name.includes('(m)')?'m':'un.',description})),...cables.map(([name,qty])=>({name:`Cabo ${name}`,qty:f(qty),unit:'m',description:cableDescriptions[name]}))];
    $('#pn-download').disabled=false;
    $('#pn-results').innerHTML=`<div class="panel-summary"><div><small>Total de componentes (contagem unitária)</small><strong>${fmt(total)}</strong></div><div><small>Cartões configurados</small><strong>${fmt(totalCards)}</strong></div></div><div class="scroll"><table><tr><th>Material</th><th>Quantidade estimada</th></tr>${materials.map(([n,q,d])=>`<tr><td><b>${n}</b><br><small>${d}</small></td><td>${fmt(q)}${n.includes('(m)')?' m':''}</td></tr>`).join('')}</table></div>`;
    $('#pn-cables').innerHTML=`<div class="scroll"><table><tr><th>Cor</th><th>Comprimento estimado</th></tr>${cables.map(([n,q])=>`<tr><td><b>${n}</b><br><small>${cableDescriptions[n]}</small></td><td>${fmt(f(q))} m</td></tr>`).join('')}</table></div>`;
    $('#pn-dim').textContent=`${fmt(H)} × ${fmt(W)} m · ${D} porta(s)`;
  }
  $('#pn-download').addEventListener('click',()=>{
    if(!lastBom.length)return;
    const esc=v=>'"'+String(v??'').replace(/"/g,'""')+'"';
    const rows=[['Material','Quantidade','Unidade','Descrição'],...lastBom.map(x=>[x.name,fmt(x.qty),x.unit,x.description])];
    const csv='\uFEFF'+rows.map(row=>row.map(esc).join(';')).join('\r\n');
    const blob=new Blob([csv],{type:'text/csv;charset=utf-8;'});const url=URL.createObjectURL(blob);
    const a=document.createElement('a');a.href=url;a.download='lista_materiais_painel_lgtech.csv';document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
  });
  $('#pn-calc').addEventListener('click',calcPanel);$('#panel-io').addEventListener('input',calcPanel);['#pn-h','#pn-w','#pn-door'].forEach(s=>$(s).addEventListener('input',calcPanel));calcPanel();


})();
