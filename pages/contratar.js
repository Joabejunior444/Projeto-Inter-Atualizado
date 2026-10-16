/* =========================================================
   CONTRATAR (wizard)
   ========================================================= */
let W={step:1,service:'',urgency:'hoje',size:'medio',cameraCount:'1',radius:'10',addr:'',notes:'',date:'',pro:null,proQuote:null,est:null,pay:'pix',presetService:'',savedEstimateKeys:{}};
function pageContratar(){
  if(route.q.servico&&W.step===1&&W.presetService!==route.q.servico){W.service=route.q.servico;W.presetService=route.q.servico;}
  if(route.q.raio)W.radius=route.q.raio;
  const names=['Serviço','Detalhes','Estimativa','Profissional','Confirmação'];
  const nav='<div class="wizard-nav">'+names.map((n,i)=>'<span class="wnav '+(W.step===i+1?'on':W.step>i+1?'ok':'')+'"><i>'+(W.step>i+1?'✓':i+1)+'</i>'+n+'</span>').join('')+'</div>';
  let body='';
  if(W.step===1)body=wStep1();
  else if(W.step===2)body=wStep2();
  else if(W.step===3)body=wStep3();
  else if(W.step===4)body=wStep4();
  else body=wStep5();
  return '<section class="section"><div class="wrap" style="max-width:920px">'+
  '<div class="sec-head" style="margin-bottom:26px"><span class="eyebrow">'+ic('sparkle')+' Contratar</span><h2>Peça seu serviço em minutos</h2></div>'+
  nav+'<div class="card" style="padding:28px">'+body+'</div></div></section>';
}
function wSet(k,v){
  W[k]=v;
  if(k==='service'){W.est=null;W.pro=null;W.proQuote=null;}
  if(k==='pro')W.proQuote=quoteForProfessional(proById(v),W.est||currentEstimate());
  render();
}
function currentEstimate(){return estimate(W.service,W.urgency,W.size,W.radius,W.cameraCount);}
function quoteForProfessional(pro,est){
  const rating=Number(pro.rating)||4.5;
  const reviews=Number(pro.reviews)||0;
  const distance=Number(pro.dist)||0;
  const profileFactor=1+Math.max(-.02,Math.min(.10,(rating-4.5)*.10+Math.min(reviews,500)/500*.04+Math.min(distance,20)*.001));
  const quote=Math.round(est.avg*profileFactor/5)*5;
  return Math.max(est.min,Math.min(est.max,quote));
}
function wGo(n){
  if(n===2&&!W.service)return toast('Escolha um serviço para continuar','err');
  if(n===3){
    if(!W.addr)return toast('Informe o endereço do atendimento','err');
    W.est=currentEstimate();
    W.pro=null;W.proQuote=null;
    const cliente=me();
    const pedidoEstimativa={
      servico:W.service,
      distancia:String(W.radius)+' km',
      emailCliente:cliente&&cliente.email?cliente.email:'cliente@taskgo.com'
    };
    const chaveEstimativa=JSON.stringify(pedidoEstimativa);
    W.savedEstimateKeys=W.savedEstimateKeys||{};
    const chavesEstimativas=W.savedEstimateKeys;
    if(!chavesEstimativas[chaveEstimativa]){
      chavesEstimativas[chaveEstimativa]=true;
      fetch('https://heftiness-crummiest-wildly.ngrok-free.dev/api/pedidos/estimar',{
        method:'POST',
        headers:{'Content-Type':'application/json','ngrok-skip-browser-warning':'69420'},
        body:JSON.stringify(pedidoEstimativa)
      })
        .then(response=>{
          if(!response.ok)throw new Error('Falha ao salvar estimativa: HTTP '+response.status);
          console.log('Pedido salvo no DB');
          return response.json();
        })
        .catch(error=>{
          delete chavesEstimativas[chaveEstimativa];
          console.error('Erro ao salvar pedido de estimativa:',error);
        });
    }
  }
  if(n===5&&!W.pro)return toast('Escolha um profissional','err');
  W.step=n;render();
}
function wStep1(){
  return '<h3 style="margin-bottom:6px">Qual serviço você precisa?</h3><p class="muted" style="font-size:.9rem;margin-bottom:20px">Selecione a categoria mais próxima do seu problema.</p>'+
  '<div class="opt-grid">'+SERVICES.map(s=>'<div class="opt '+(W.service===s.id?'sel':'')+'" onclick="wSet(\'service\',\''+s.id+'\')">'+ic(s.ico)+'<b>'+s.n+'</b><span>R$ '+s.min+'+</span></div>').join('')+'</div>'+
  '<div style="display:flex;justify-content:flex-end;margin-top:26px"><button class="btn btn-primary" onclick="wGo(2)">Continuar '+ic('arrow')+'</button></div>';
}
function wStep2(){
  const u=me();
  const scopeField=W.service==='cftv'
    ?'<div class="field"><label>Quantidade de câmeras</label><select class="select" onchange="wSet(\'cameraCount\',this.value)">'+[1,2,4,6,8,12,16].map(n=>'<option value="'+n+'" '+(Number(W.cameraCount)===n?'selected':'')+'>'+n+(n===1?' câmera':' câmeras')+'</option>').join('')+'</select><div class="hint">A estimativa considera a instalação. Equipamentos são cobrados à parte.</div></div>'
    :'<div class="field"><label>Porte do serviço</label><select class="select" onchange="W.size=this.value">'+[['pequeno','Pequeno (até 1h)'],['medio','Médio (2 a 4h)'],['grande','Grande (dia inteiro ou mais)']].map(o=>'<option value="'+o[0]+'" '+(W.size===o[0]?'selected':'')+'>'+o[1]+'</option>').join('')+'</select></div>';
  return '<h3 style="margin-bottom:20px">Conte os detalhes</h3>'+
  '<div class="field"><label>Endereço do atendimento</label><input class="input" id="wAddr" placeholder="Rua, número, bairro, cidade" value="'+esc(W.addr||(u?u.address:''))+'" oninput="W.addr=this.value"></div>'+
  '<div class="grid g2" style="gap:16px">'+
  scopeField+
  '<div class="field"><label>Urgência</label><select class="select" onchange="wSet(\'urgency\',this.value)">'+
  [['agora','Agora (emergência)'],['hoje','Ainda hoje'],['agendar','Quero agendar']].map(o=>'<option value="'+o[0]+'" '+(W.urgency===o[0]?'selected':'')+'>'+o[1]+'</option>').join('')+'</select></div></div>'+
  (W.urgency==='agendar'?'<div class="field"><label>Data e hora desejadas</label><input class="input" type="datetime-local" onchange="W.date=this.value" value="'+esc(W.date)+'"></div>':'')+
  '<div class="field"><label>Raio de busca</label><select class="select" onchange="W.radius=this.value">'+
  ['5','10','20','40'].map(r=>'<option value="'+r+'" '+(W.radius===r?'selected':'')+'>Até '+r+' km</option>').join('')+'</select></div>'+
  '<div class="field"><label>Descreva o problema (opcional)</label><textarea class="textarea" placeholder="Ex.: disjuntor desarmando toda vez que ligo o chuveiro" oninput="W.notes=this.value">'+esc(W.notes)+'</textarea></div>'+
  '<div class="field"><label>Fotos do local (opcional)</label><input class="input" type="file" accept="image/*" multiple><div class="hint">Fotos ajudam o profissional a levar as ferramentas certas.</div></div>'+
  '<div style="display:flex;justify-content:space-between;margin-top:26px"><button class="btn btn-ghost" onclick="wGo(1)">'+ic('arrowLeft')+' Voltar</button>'+
  '<button class="btn btn-grad" onclick="wGo(3)">'+ic('sparkle')+' Gerar estimativa com IA</button></div>';
}
function wStep3(){
  const e=W.est||currentEstimate(),s=svc(W.service);
  const rangeLabel=s.id==='cftv'?'TOTAL PARA '+e.quantity+' '+(e.quantity===1?'CÂMERA':'CÂMERAS'):'FAIXA ESTIMADA POR '+s.unit.toUpperCase();
  return '<div style="display:flex;align-items:center;gap:12px;margin-bottom:6px">'+ic('sparkle')+'<h3>Estimativa gerada por IA</h3></div>'+
  '<p class="muted" style="font-size:.9rem;margin-bottom:22px">Faixa calculada para '+s.n.toLowerCase()+' na sua região, com '+e.confidence+'% de confiança.</p>'+
  '<div style="text-align:center;padding:30px;border-radius:18px;background:linear-gradient(135deg,color-mix(in srgb,var(--brand) 14%,transparent),color-mix(in srgb,var(--purple) 12%,transparent));border:1px solid color-mix(in srgb,var(--brand) 28%,transparent)">'+
  '<span class="muted" style="font-size:.82rem;font-weight:700">'+rangeLabel+'</span>'+
  '<div style="font-size:clamp(1.8rem,5vw,2.8rem);font-weight:800;letter-spacing:-.04em;margin:8px 0">R$ '+e.min+' – R$ '+e.max+'</div>'+
  '<span class="pill pill-brand">'+ic('users')+' '+(e.pros?e.pros+' profissionais disponíveis · chegada em ~'+e.eta+' min':'Nenhum profissional disponível neste raio')+'</span></div>'+
  '<h3 style="font-size:1rem;margin:26px 0 12px">Como chegamos nesse valor</h3>'+
  '<div class="card" style="background:var(--surface-2);padding:6px 18px">'+e.factors.map(f=>'<div style="display:flex;justify-content:space-between;padding:12px 0;border-bottom:1px solid var(--line)"><span class="muted" style="font-size:.88rem">'+f[0]+'</span><b style="font-size:.88rem">'+f[1]+'</b></div>').join('')+'</div>'+
  '<p class="hint" style="margin-top:14px">O valor final é confirmado pelo profissional após avaliar o serviço. Você aprova antes da execução.</p>'+
  '<div style="display:flex;justify-content:space-between;margin-top:26px"><button class="btn btn-ghost" onclick="wGo(2)">'+ic('arrowLeft')+' Voltar</button>'+
  '<button class="btn btn-primary" onclick="wGo(4)">Ver profissionais '+ic('arrow')+'</button></div>';
}
function wStep4(){
  const radius=Number(W.radius)||10;
  let list=S.pros.filter(p=>p.service===W.service&&Number(p.dist)<=radius);
  list=list.slice(0,6).sort((a,b)=>a.dist-b.dist);
  return '<h3 style="margin-bottom:6px">Escolha seu profissional</h3><p class="muted" style="font-size:.9rem;margin-bottom:20px">'+list.length+' disponíveis num raio de '+W.radius+' km.</p>'+
  (list.length?list.map(p=>'<div onclick="wSet(\'pro\',\''+p.id+'\')">'+proRow(p,W.pro===p.id,quoteForProfessional(p,W.est||currentEstimate()))+'</div>').join(''):'<div class="card emptystate"><b>Nenhum profissional disponível</b><p style="margin-top:6px">Ainda não temos profissionais desta categoria na sua região.</p></div>')+
  '<div style="display:flex;justify-content:space-between;margin-top:22px"><button class="btn btn-ghost" onclick="wGo(3)">'+ic('arrowLeft')+' Voltar</button>'+
  '<button class="btn btn-primary" onclick="wGo(5)">Continuar '+ic('arrow')+'</button></div>';
}
function wStep5(){
  const p=proById(W.pro),s=svc(W.service),e=W.est||currentEstimate();
  const quote=W.proQuote==null?quoteForProfessional(p,e):W.proQuote;
  return '<h3 style="margin-bottom:20px">Confirme seu pedido</h3>'+
  '<div class="card" style="background:var(--surface-2);margin-bottom:18px">'+
  [['Serviço',s.n],['Profissional',p.name],['Endereço',W.addr||'—'],
   ['Quando',W.urgency==='agora'?'Imediato':W.urgency==='hoje'?'Ainda hoje':(W.date?new Date(W.date).toLocaleString('pt-BR'):'A agendar')],
   ['Estimativa','R$ '+e.min+' – R$ '+e.max],['Valor deste profissional','R$ '+quote]]
  .map(r=>'<div style="display:flex;justify-content:space-between;gap:20px;padding:11px 0;border-bottom:1px solid var(--line)"><span class="muted" style="font-size:.88rem">'+r[0]+'</span><b style="font-size:.88rem;text-align:right">'+esc(r[1])+'</b></div>').join('')+'</div>'+
  '<div style="margin-top:20px;padding:14px;border-radius:14px;background:color-mix(in srgb,var(--brand) 10%,transparent);border:1px solid color-mix(in srgb,var(--brand) 26%,transparent);font-size:.86rem;display:flex;gap:10px">'+ic('shield')+
  '<span>Escolha PIX, cartão ou saldo no checkout. Esta é uma simulação para o MVP; nenhum valor será cobrado.</span></div>'+ 
  '<div style="display:flex;justify-content:space-between;margin-top:26px;gap:12px;flex-wrap:wrap"><button class="btn btn-ghost" onclick="wGo(4)">'+ic('arrowLeft')+' Voltar</button>'+ 
  '<button class="btn btn-grad btn-lg" onclick="abrirCheckout()">'+ic('check')+' Ir para pagamento</button></div>';
}
function imagemQrDemonstrativo(){
  const svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 220"><rect width="220" height="220" rx="12" fill="#fff"/><g fill="#111827"><path d="M16 16h58v58H16zm130 0h58v58h-58zM16 146h58v58H16z"/><path d="M88 16h14v14H88zm28 0h14v14h-14zM88 44h28v14H88zm42 0h14v14h-14zM88 72h14v14H88zm28 0h28v14h-28zM16 88h14v14H16zm28 0h14v14H44zm28 0h14v14H72zm30 0h14v14h-14zm28 0h14v14h-14zm28 0h14v14h-14zm28 0h14v14h-14zM16 116h28v14H16zm42 0h14v14H58zm30 0h28v14H88zm42 0h14v14h-14zm28 0h14v14h-14zm28 0h14v14h-14zM88 146h14v14H88zm28 0h14v14h-14zm42 0h14v14h-14zm28 0h14v14h-14zM88 174h28v14H88zm42 0h14v14h-14zm28 0h14v14h-14z"/></g><g fill="#fff"><path d="M28 28h34v34H28zm130 0h34v34h-34zM28 158h34v34H28z"/></g><g fill="#111827"><path d="M37 37h16v16H37zm130 0h16v16h-16zM37 167h16v16H37z"/></g><text x="110" y="215" text-anchor="middle" font-family="Arial,sans-serif" font-size="9" fill="#64748b">QR DEMONSTRATIVO</text></svg>';
  return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
}
function abrirCheckout(){
  if(!me()){toast('Faça login para concluir o pedido','err');return go('/entrar?next=contratar');}
  const p=proById(W.pro),e=W.est||currentEstimate();
  const valor=W.proQuote==null?quoteForProfessional(p,e):W.proQuote;
  const pixCode='TASKGO-PIX-DEMO-'+String(rand(100000,999999))+'-'+String(rand(100000,999999));
  window.__checkoutPixCode=pixCode;
  window.__checkoutMockEmAndamento=false;
  openModal(
    '<section class="checkout-shell" id="checkout-shell">'+
      '<header class="checkout-head"><div><span class="checkout-kicker">CHECKOUT DE DEMONSTRAÇÃO</span><h2>Escolha como pagar</h2><p>Selecione uma forma de pagamento para continuar.</p></div><button class="icon-btn" type="button" onclick="closeModal()" aria-label="Fechar checkout">'+ic('x')+'</button></header>'+
      '<div class="checkout-total"><span>Total do pedido</span><b>'+money(valor)+'</b></div>'+
      '<div class="checkout-tabs" role="tablist" aria-label="Forma de pagamento">'+
        '<button type="button" class="checkout-tab" role="tab" data-metodo="pix" onclick="trocarMetodoCheckout(\'pix\')">'+ic('pix')+' PIX</button>'+
        '<button type="button" class="checkout-tab" role="tab" data-metodo="card" onclick="trocarMetodoCheckout(\'card\')">'+ic('card')+' Cartão</button>'+
        '<button type="button" class="checkout-tab" role="tab" data-metodo="wallet" onclick="trocarMetodoCheckout(\'wallet\')">'+ic('wallet')+' Saldo</button>'+
      '</div>'+
      '<div id="checkout-method-panel"></div>'+
      '<p class="checkout-disclaimer">Simulação de checkout: nenhum pagamento real será processado.</p>'+
    '</section>',
    {className:'checkout-modal'}
  );
  trocarMetodoCheckout(['pix','card','wallet'].includes(W.pay)?W.pay:'pix');
}
function trocarMetodoCheckout(metodo){
  if(!['pix','card','wallet'].includes(metodo))metodo='pix';
  W.pay=metodo;
  document.querySelectorAll('.checkout-tab').forEach(tab=>{
    const ativo=tab.dataset.metodo===metodo;
    tab.classList.toggle('active',ativo);
    tab.setAttribute('aria-selected',String(ativo));
  });
  const painel=document.getElementById('checkout-method-panel');
  if(!painel)return;
  if(metodo==='pix'){
    painel.innerHTML='<div class="checkout-pix"><img class="checkout-qr" src="'+imagemQrDemonstrativo()+'" alt="QR Code ilustrativo do PIX, sem validade para pagamento"><div><b>PIX instantâneo</b><p class="muted">Escaneie o QR demonstrativo ou copie o código abaixo.</p><div class="checkout-code"><code>'+esc(window.__checkoutPixCode||'')+'</code><button type="button" class="btn btn-ghost btn-sm" onclick="copiarCodigoCheckout()">Copiar</button></div><button type="button" class="btn btn-grad btn-block" onclick="confirmarPagamentoMock()">Confirmar pagamento PIX</button></div></div>';
  }else if(metodo==='card'){
    painel.innerHTML='<form class="checkout-card-form" onsubmit="confirmarPagamentoMock(event)"><div class="field"><label for="checkout-card-number">Número do cartão</label><input id="checkout-card-number" class="input" inputmode="numeric" autocomplete="cc-number" placeholder="0000 0000 0000 0000" required maxlength="19"></div><div class="field"><label for="checkout-card-name">Nome no cartão</label><input id="checkout-card-name" class="input" autocomplete="cc-name" placeholder="Como aparece no cartão" required></div><div class="checkout-card-row"><div class="field"><label for="checkout-card-expiry">Validade</label><input id="checkout-card-expiry" class="input" autocomplete="cc-exp" placeholder="MM/AA" required maxlength="5"></div><div class="field"><label for="checkout-card-cvv">CVV</label><input id="checkout-card-cvv" class="input" type="password" inputmode="numeric" autocomplete="cc-csc" placeholder="123" required maxlength="4"></div></div><button type="submit" class="btn btn-grad btn-block">Pagar com Cartão</button></form>';
  }else{
    painel.innerHTML='<div class="checkout-balance"><div class="ico-box">'+ic('wallet')+'</div><div><span>Seu saldo atual</span><b>R$ 850,00</b><small>Saldo demonstrativo</small></div></div><button type="button" class="btn btn-grad btn-block" onclick="confirmarPagamentoMock()">Usar Saldo</button>';
  }
  enhanceInteractiveButtons(painel);
}
async function copiarCodigoCheckout(){
  const codigo=window.__checkoutPixCode||'';
  try{
    if(navigator.clipboard&&window.isSecureContext)await navigator.clipboard.writeText(codigo);
    else{
      const campo=document.createElement('textarea');campo.value=codigo;campo.style.position='fixed';campo.style.opacity='0';
      document.body.appendChild(campo);campo.select();document.execCommand('copy');campo.remove();
    }
    toast('Código demonstrativo copiado','ok');
  }catch(erro){toast('Não foi possível copiar o código','err');}
}
function confirmarPagamentoMock(evento){
  if(evento)evento.preventDefault();
  if(window.__checkoutMockEmAndamento)return;
  const modal=document.querySelector('#modal-root .checkout-modal');
  if(!modal)return;
  window.__checkoutMockEmAndamento=true;
  modal.innerHTML='<div class="checkout-state" role="status" aria-live="polite"><span class="checkout-spinner" aria-hidden="true"></span><h2>Processando pagamento em ambiente seguro...</h2><p>Estamos confirmando os dados da simulação.</p></div>';
  setTimeout(()=>{
    if(!modal.isConnected){window.__checkoutMockEmAndamento=false;return;}
    modal.innerHTML='<div class="checkout-state checkout-state--success" role="status" aria-live="polite"><svg class="checkout-success-icon" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="29"></circle><path d="m18 33 9 9 19-21"></path></svg><h2>Pagamento Aprovado!</h2><p>Valor retido pela TaskGO.</p></div>';
    setTimeout(()=>{
      if(!modal.isConnected){window.__checkoutMockEmAndamento=false;return;}
      closeModal();
      window.__checkoutMockEmAndamento=false;
      finalizarPedido();
    },2000);
  },4000);
}
function finalizarPedido(){
  if(!me()){toast('Faça login para concluir o pedido','err');return go('/entrar?next=contratar');}
  const e=W.est||currentEstimate();
  const o={id:'o_'+uid(),code:String(rand(1000,9999)),created:Date.now(),status:'aguardando',
    price:W.proQuote==null?e.avg:W.proQuote,service:W.service,proId:W.pro,clientId:me().id,address:W.addr,rating:null,notes:W.notes,
    paid:W.pay,dist:proById(W.pro).dist,eta:proById(W.pro).eta,progress:0};
  S.orders.unshift(o);
  notifyOrderOther(o,'Novo pedido recebido',me().name+' solicitou '+svc(o.service).n+'. Confirme o atendimento para iniciar o deslocamento.',{kind:'order',type:'client_order_request'});
  Store.save();
  W={step:1,service:'',urgency:'hoje',size:'medio',cameraCount:'1',radius:'10',addr:'',notes:'',date:'',pro:null,proQuote:null,est:null,pay:'pix',presetService:'',savedEstimateKeys:{}};
  toast('Pedido enviado. Aguarde a confirmação do profissional.','ok');
  go('/painel/pedido/'+o.id);
}

