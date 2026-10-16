/* ---------- DETALHE DO PEDIDO / RASTREIO ---------- */
let trackTimer=null;
function dashPedido(id){
  const o=S.orders.find(x=>x.id===id);
  if(!o)return '<div class="card emptystate">'+ic('x')+'Pedido não encontrado<div style="margin-top:14px"><a class="btn btn-ghost" href="#/painel/pedidos">Voltar</a></div></div>';
  const p=proById(o.proId),cli=clientOf(o),s=svc(o.service),isPro=me().role==='profissional',cp=isPro?cli:p;
  const cpRating=Number(cp.rating)||0;
  const cpRatingHtml=cpRating>0?stars(cpRating)+' '+cpRating.toFixed(1):'<span class="muted">Sem avaliações</span>';
  const reviewRating=isPro?(o.clientRating||(o.reviewByRole==='profissional'?o.rating:null)):(o.reviewByRole==='profissional'?null:o.rating);
  const stepsArr=['aguardando','a_caminho','chegou','em_andamento','concluido'];
  const curIdx=Math.max(0,stepsArr.indexOf(o.status));
  const live=['a_caminho','chegou'].includes(o.status);
  return '<a href="#/painel/pedidos" class="pill" style="margin-bottom:18px">'+ic('arrowLeft')+' Meus pedidos</a>'+
  dashHead(s.n,'Pedido #'+o.id.slice(-6).toUpperCase()+' · criado em '+dt(o.created),stTag(o.status))+
  '<div class="grid g2" style="grid-template-columns:1.35fr .65fr;align-items:start">'+
  '<div>'+
    (!['cancelado','aguardando'].includes(o.status)?'<div class="card" style="padding:18px">'+
      '<div class="map tracking-map"><div id="mapa-rastreio" class="leaflet-tracking-map" role="application" aria-label="Mapa da rota do profissional até o cliente">'+mapSVG('live',o.id)+'</div>'+ 
      '<div class="map-ov"><span class="map-badge">'+ic('route')+' <span id="liveDist">'+o.dist.toFixed(1)+'</span> km</span>'+ 
      '<span class="map-badge">'+ic('clock')+' <span id="liveEta">'+o.eta+'</span> min</span>'+ 
      (live?'<span class="map-badge"><span class="dot-live"></span> Ao vivo</span>':'')+'</div></div>'+
      '<div style="display:flex;justify-content:space-between;align-items:center;margin:14px 2px 0;font-size:.85rem"><span class="muted">'+(isPro?'Rota até '+esc(cli.name.split(' ')[0]):'Rota de '+esc(p.name.split(' ')[0])+' até você')+'</span>'+
      '<span class="muted">'+esc(o.address||'')+'</span></div>'+
      '<div class="track-steps">'+['Aguardando aceite','A caminho','Chegou','Em andamento','Concluído'].map((t,i)=>'<div class="tstep '+(i<curIdx?'done':i===curIdx?'now':'')+'">'+t+'</div>').join('')+'</div>'+ 
      '<div style="display:flex;gap:10px;margin-top:20px;flex-wrap:wrap">'+
      '<a class="btn btn-ghost btn-sm" href="#/painel/mensagens">'+ic('chat')+' Mensagem</a>'+
      '<button class="btn btn-ghost btn-sm" onclick="toast(\'Ligando para '+esc(cp.name)+'...\')">'+ic('phone')+' Ligar</button>'+
      '<button class="btn btn-ghost btn-sm" onclick="compartilharRota()">'+ic('nav')+' Compartilhar rota</button>'+
      '<button class="btn btn-danger btn-sm" onclick="emergencia()">'+ic('flag')+' Emergência</button></div>'+
    '</div>':'')+
    /* CÓDIGO */
    (['a_caminho','chegou'].includes(o.status)?(isPro
     /* PROFISSIONAL: digita o código que o cliente informa */
     ?'<div class="card" style="margin-top:20px;text-align:center;border-color:color-mix(in srgb,var(--brand) 40%,var(--line))">'+
      '<div class="ico-box" style="margin:0 auto 12px">'+ic('key')+'</div>'+
      '<h3 style="font-size:1.05rem">Validação de chegada</h3>'+
      '<p class="muted" style="font-size:.88rem;margin-top:6px;max-width:440px;margin-inline:auto">Ao chegar, peça ao cliente o código de 4 dígitos que aparece no aplicativo dele e digite abaixo. O serviço só começa depois disso.</p>'+
      '<div class="code-boxes">'+[0,1,2,3].map(i=>'<input id="cb'+i+'" inputmode="numeric" maxlength="1" oninput="cbNext('+i+')">').join('')+'</div>'+
      '<button class="btn btn-grad" onclick="validarCodigo(\''+o.id+'\')">'+ic('checkCircle')+' Validar e iniciar serviço</button>'+
      '<details class="demo-note"><summary>Ambiente de teste</summary><span class="demo-note-content">Neste protótipo, use o código <b>'+o.code+'</b> para validar a chegada. Em produção, só o cliente verá esse código.</span></details></div>'
     /* CLIENTE: mostra o código para informar ao profissional */
     :'<div class="card" style="margin-top:20px;text-align:center;border-color:color-mix(in srgb,var(--brand) 40%,var(--line))">'+
      '<div class="ico-box" style="margin:0 auto 12px">'+ic('key')+'</div>'+
      '<h3 style="font-size:1.05rem">Seu código de segurança</h3>'+
      '<p class="muted" style="font-size:.88rem;margin-top:6px;max-width:440px;margin-inline:auto">Informe este código a '+esc(p.name.split(' ')[0])+' somente quando ele chegar ao local. Ele digita o código no app para iniciar o serviço.</p>'+
      '<div class="big-code" style="margin:20px 0">'+o.code+'</div>'+
      '<span class="pill '+(o.status==='chegou'?'pill-brand':'')+'">'+(o.status==='chegou'?ic('mapPin')+' O profissional chegou — informe o código':ic('clock')+' Aguardando a chegada do profissional')+'</span>'+
      '<details class="demo-note"><summary>Testar a visão do profissional</summary><span class="demo-note-content">Entre com <b>pro@taskgo.com</b> · senha <b>123456</b> e valide o código por lá.</span></details></div>'):'')+
    (o.status==='aguardando'?(isPro?
     '<div class="card" style="margin-top:20px;border-color:color-mix(in srgb,var(--brand) 40%,var(--line))">'+
     '<div style="display:flex;gap:14px;align-items:flex-start"><div class="ico-box">'+ic('bell')+'</div><div style="flex:1"><b>Novo pedido recebido</b><p class="muted" style="font-size:.88rem;margin-top:6px">'+esc(cli.name)+' solicitou '+esc(s.n)+' por '+money(o.price)+'. Revise o endereço e confirme se pode atender.</p></div></div>'+ 
     '<div style="display:flex;gap:10px;margin-top:18px;flex-wrap:wrap"><button class="btn btn-ghost" onclick="recusarPedidoCliente(\''+o.id+'\')">Recusar pedido</button><button class="btn btn-grad" onclick="confirmarPedidoCliente(\''+o.id+'\')">'+ic('check')+' Confirmar atendimento</button></div></div>'
     :'<div class="card" style="margin-top:20px;border-color:color-mix(in srgb,var(--brand) 35%,var(--line))"><b>Aguardando confirmação do profissional</b><p class="muted" style="font-size:.88rem;margin-top:6px">Seu pedido foi enviado para '+esc(p.name)+'. Avisaremos assim que ele confirmar o atendimento.</p></div>'):'')+
    (o.status==='em_andamento'?
     '<div class="card" style="margin-top:20px;display:flex;gap:16px;align-items:center;flex-wrap:wrap">'+
     '<div class="ico-box">'+ic('play')+'</div><div style="flex:1;min-width:200px"><b>Serviço em andamento</b>'+
     '<p class="muted" style="font-size:.88rem">Iniciado após validação do código. Ao terminar, confirme a conclusão para liberar o pagamento.</p></div>'+
     '<button class="btn btn-grad" onclick="concluirServico(\''+o.id+'\')">'+ic('check')+' Concluir serviço</button></div>':'')+
    (o.status==='concluido'?
     '<div class="card" style="margin-top:20px">'+
     '<div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap"><div class="ico-box" style="background:color-mix(in srgb,var(--accent) 14%,transparent)">'+ic('checkCircle')+'</div>'+
     '<div style="flex:1;min-width:200px"><b>'+(isPro?'Serviço concluído':'Pedido finalizado')+'</b><p class="muted" style="font-size:.88rem">'+(reviewRating?'Você avaliou com '+reviewRating+' estrelas.':(isPro?'Conte como foi sua experiência com o cliente.':'Avalie o profissional que realizou o serviço.'))+'</p></div>'+ 
     (reviewRating?stars(reviewRating):'<button class="btn btn-primary" onclick="abrirAvaliacao(\''+o.id+'\')">'+ic('star')+' '+(isPro?'Avaliar cliente':'Avaliar profissional')+'</button>')+'</div>'+ 
     '<div style="display:flex;gap:10px;margin-top:16px;flex-wrap:wrap"><button class="btn btn-ghost btn-sm" onclick="baixarRecibo(\''+o.id+'\')">'+ic('file')+' Baixar recibo</button>'+
     '<a class="btn btn-ghost btn-sm" href="#/contratar?servico='+o.service+'">'+ic('refresh')+' Contratar novamente</a></div></div>':'')+
    (o.notes?'<div class="card" style="margin-top:20px"><b style="font-size:.9rem">Descrição do pedido</b><p class="muted" style="font-size:.9rem;margin-top:8px">'+esc(o.notes)+'</p></div>':'')+
  '</div>'+
  '<div>'+
    '<div class="card"><h3 style="font-size:1rem;margin-bottom:16px">'+(isPro?'Cliente':'Profissional')+'</h3>'+
    '<div style="display:flex;gap:12px;align-items:center">'+avatar({name:cp.name},52)+
    '<div><b style="display:block">'+esc(cp.name)+'</b><span class="muted" style="font-size:.8rem">'+cpRatingHtml+' · '+
      (isPro?(Number(cli.jobs)||0)+' pedidos na TaskGO':p.reviews+' avaliações')+'</span>'+ 
    (isPro?'<div style="margin-top:5px"><span class="tag tag-info">'+ic('shield')+' Identidade confirmada</span></div>'
          :(p.verified?'<div style="margin-top:5px"><span class="tag tag-info">'+ic('shield')+' Verificado</span></div>':''))+'</div></div>'+
    (isPro?'<div style="margin-top:14px">'+
       '<div style="display:flex;justify-content:space-between;gap:12px;padding:9px 0;border-bottom:1px solid var(--line)"><span class="muted" style="font-size:.84rem">Telefone</span><b style="font-size:.84rem">'+esc(cli.phone||'—')+'</b></div>'+
       '<div style="display:flex;justify-content:space-between;gap:12px;padding:9px 0"><span class="muted" style="font-size:.84rem">Cliente desde</span><b style="font-size:.84rem">'+new Date(cli.since||Date.now()).toLocaleDateString('pt-BR',{month:'short',year:'numeric'})+'</b></div></div>'
          :'<p class="muted" style="font-size:.86rem;margin-top:14px">'+esc(p.bio)+'</p>')+'</div>'+
    '<div class="card" style="margin-top:16px"><h3 style="font-size:1rem;margin-bottom:14px">Resumo</h3>'+
    [['Endereço',o.address||'—'],['Categoria',s.n],['Pagamento',{pix:'PIX',card:'Cartão',wallet:'Carteira TaskGO'}[o.paid]||'PIX'],['Valor',money(o.price)]]
    .map(r=>'<div style="display:flex;justify-content:space-between;gap:14px;padding:10px 0;border-bottom:1px solid var(--line)"><span class="muted" style="font-size:.85rem">'+r[0]+'</span><b style="font-size:.85rem;text-align:right">'+esc(r[1])+'</b></div>').join('')+
    (isPro?'<div style="display:flex;justify-content:space-between;gap:14px;padding:10px 0;border-bottom:1px solid var(--line)"><span class="muted" style="font-size:.85rem">Taxa TaskGO ('+(me().plan==='plus'?'8%':'12%')+')</span><b style="font-size:.85rem;color:var(--danger)">− '+money(o.price*(me().plan==='plus'?.08:.12))+'</b></div>':'')+
    '<div style="display:flex;justify-content:space-between;padding-top:14px"><b>'+(isPro?'Você recebe':'Total')+'</b><b style="font-size:1.2rem;color:var(--brand)">'+money(isPro?o.price*(me().plan==='plus'?.92:.88):o.price)+'</b></div>'+
    (['a_caminho','agendado','aguardando'].includes(o.status)?'<button class="btn btn-danger btn-block" style="margin-top:16px" onclick="cancelarPedido(\''+o.id+'\')">Cancelar pedido</button>':'')+
    '</div>'+
    '<div class="card" style="margin-top:16px;background:color-mix(in srgb,var(--accent) 8%,var(--surface))">'+
    '<div style="display:flex;gap:10px"><div style="flex:none">'+ic(isPro?'key':'shield')+'</div><div><b style="font-size:.88rem">'+(isPro?'Antes de iniciar':'Garantia TaskGO')+'</b>'+
    '<p class="muted" style="font-size:.84rem;margin-top:4px">'+(isPro?'Peça o código de 4 dígitos ao cliente e valide no app. Só depois inicie o serviço.':'90 dias de cobertura sobre o serviço executado.')+'</p></div></div></div>'+
  '</div></div>';
}
function startTracking(){
  const o=S.orders.find(x=>x.id===route.id);
  if(!o)return;
  initTrackingMap(o.id,o.progress||0);
  placeMarker('live',o.progress||0);
  if(o.status!=='a_caminho')return;
  const duration=45000;
  if(!o.trackingStartedAt)o.trackingStartedAt=Date.now()-(Math.max(0,Math.min(1,o.progress||0))*duration);
  trackTimer=setInterval(()=>{
    o.progress=Math.max(0,Math.min(1,(Date.now()-o.trackingStartedAt)/duration));
    const totalDist=4.6;
    o.dist=+((1-o.progress)*totalDist).toFixed(1);
    o.eta=Math.max(1,Math.round((1-o.progress)*18));
    placeMarker('live',o.progress);
    const d=$('#liveDist'),e=$('#liveEta');
    if(d)d.textContent=o.dist.toFixed(1);
    if(e)e.textContent=o.eta;
    if(o.progress>=1){
      clearInterval(trackTimer);trackTimer=null;o.status='chegou';Store.save();
      notifyUser(o.clientId,'Seu profissional chegou!', 'Abra o pedido para confirmar a chegada e ver o código de segurança.',{kind:'order',type:'professional_arrived',orderId:o.id,route:'/painel/pedido/'+o.id});
      toast('O profissional chegou ao local!','ok');render();
    }else Store.save();
  },300);
}
function abrirValidacao(id){
  openModal('<div class="modal-head"><div><h3>Validar chegada</h3><p>Digite o código de 4 dígitos para iniciar o serviço.</p></div><button class="icon-btn" onclick="closeModal()">'+ic('x')+'</button></div>'+
  '<div class="code-boxes">'+[0,1,2,3].map(i=>'<input id="cb'+i+'" inputmode="numeric" maxlength="1" oninput="cbNext('+i+')">').join('')+'</div>'+
  '<p class="hint center" style="margin-bottom:16px">Nunca compartilhe o código antes do profissional chegar.</p>'+
  '<button class="btn btn-grad btn-block" onclick="validarCodigo(\''+id+'\')">Confirmar</button>',
  {onOpen:()=>{const f=$('#cb0');if(f)f.focus();}});
}
function cbNext(i){const el=$('#cb'+i);el.value=el.value.replace(/\D/g,'');if(el.value&&i<3)$('#cb'+(i+1)).focus();}
function validarCodigo(id){
  const o=S.orders.find(x=>x.id===id);
  const v=[0,1,2,3].map(i=>($('#cb'+i)||{}).value||'').join('');
  if(v!==o.code)return toast('Código incorreto. Confira com o profissional.','err');
  o.status='em_andamento';o.progress=1;o.dist=0;o.eta=0;
  notifyOrderOther(o,'Serviço iniciado','A chegada foi confirmada e o serviço já começou.',{kind:'order',type:'service_started'});
  Store.save();closeModal();
  toast('Chegada validada! Serviço iniciado.','ok');render();
}
function confirmarPedidoCliente(id){
  const o=S.orders.find(x=>x.id===id),u=me();
  if(!o||!u||u.role!=='profissional'||o.proId!==u.proId)return toast('Este pedido não pertence ao seu perfil.','err');
  if(o.status!=='aguardando')return toast('Este pedido já foi respondido.','err');
  o.status='a_caminho';o.progress=0;o.trackingStartedAt=Date.now();
  o.dist=Number(o.dist)||3.5;o.eta=Number(o.eta)||15;
  if(!S.chats.some(c=>c.orderId===o.id))S.chats.unshift({id:'ch_'+uid(),orderId:o.id,msgs:[]});
  notifyOrderOther(o,'Profissional a caminho','O profissional confirmou o atendimento e iniciou o deslocamento.',{kind:'order',type:'professional_accepted'});
  Store.save();toast('Atendimento confirmado.','ok');render();
}
function recusarPedidoCliente(id){
  const o=S.orders.find(x=>x.id===id),u=me();
  if(!o||!u||u.role!=='profissional'||o.proId!==u.proId)return toast('Este pedido não pertence ao seu perfil.','err');
  if(o.status!=='aguardando')return toast('Este pedido já foi respondido.','err');
  o.status='cancelado';o.cancelReason='professional_unavailable';
  notifyOrderOther(o,'Profissional indisponível','O profissional não poderá atender este pedido. Você pode escolher outro profissional.',{kind:'order',type:'professional_declined'});
  Store.save();toast('Pedido recusado.','ok');go('/painel/pedidos');
}
function concluirServico(id){
  const o=S.orders.find(x=>x.id===id);
  o.status='concluido';Store.save();
  const u=me();
  if(u.role==='profissional'){
    const liq=o.price*(u.plan==='plus'?.92:.88);
    u.balance+=liq;
    S.tx.unshift({id:uid(),ownerId:u.id,type:'in',label:'Pagamento recebido — '+svc(o.service).n,amount:liq,ts:Date.now(),method:'PIX',status:'ok'});
  }else{
    S.tx.unshift({id:uid(),ownerId:o.clientId,type:'out',label:'Pagamento de serviço — '+svc(o.service).n,amount:o.price,ts:Date.now(),method:{pix:'PIX',card:'Cartão',wallet:'Carteira'}[o.paid]||'PIX',status:'ok'});
  }
  notifyOrderOther(o,u.role==='profissional'?'Pedido finalizado — avalie o profissional':'Pagamento confirmado',u.role==='profissional'?'O profissional finalizou o pedido. Abra os detalhes para avaliar o atendimento.':'O pagamento do serviço foi confirmado.',{kind:u.role==='profissional'?'review':'payment',type:'service_completed'});
  Store.save();toast('Serviço concluído! 🎉','ok');abrirAvaliacao(id);
}
let ratingVal=5;
function abrirAvaliacao(id){
  ratingVal=1;
  const isPro=me().role==='profissional';
  const reviewTags=isPro
    ? ['Comunicativo','Respeitoso','Acesso facilitado','Informa\u00e7\u00f5es claras','Local organizado','Colaborativo']
    : ['Pontual','Educado','Caprichoso','Pre\u00e7o justo','Limpo','R\u00e1pido'];
  const reviewTitle=isPro?'Avalie o cliente':'Avalie o profissional';
  const reviewSubtitle=isPro
    ? 'Sua avalia\u00e7\u00e3o ajuda outros profissionais da TaskGO.'
    : 'Sua opini\u00e3o ajuda toda a comunidade TaskGO.';
  const reviewPlaceholder=isPro
    ? 'Como foi a comunica\u00e7\u00e3o e o atendimento do cliente?'
    : 'Conte como foi o servi\u00e7o...';
  openModal('<div class="modal-head"><div><h3>'+reviewTitle+'</h3><p>'+reviewSubtitle+'</p></div><button class="icon-btn" onclick="closeModal()">'+ic('x')+'</button></div>'+
  '<div id="rstars" role="group" aria-label="Escolha uma nota de 1 a 5 estrelas" style="display:flex;gap:8px;justify-content:center;margin:10px 0 20px">'+
  [1,2,3,4,5].map(i=>'<button type="button" aria-label="Avaliar com '+i+' '+(i===1?'estrela':'estrelas')+'" aria-pressed="'+(i===1?'true':'false')+'" onclick="setRating('+i+')" style="background:none;border:0;cursor:pointer;padding:0"><svg viewBox="0 0 24 24" style="width:38px;height:38px;fill:var(--warn);opacity:'+(i<=ratingVal?1:.25)+';transition:opacity .15s,transform .15s" data-s="'+i+'">'+I.star+'</svg></button>').join('')+'</div>'+ 
  '<div class="field"><label>Coment\u00e1rio (opcional)</label><textarea class="textarea" id="rcom" placeholder="'+reviewPlaceholder+'"></textarea></div>'+
  '<div id="reviewTags" style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:18px">'+reviewTags.map(t=>'<button type="button" class="pill" aria-pressed="false" onclick="toggleReviewTag(this)">'+t+'</button>').join('')+'</div>'+
  '<button class="btn btn-grad btn-block" onclick="salvarAvaliacao(\''+id+'\')">Enviar avalia\u00e7\u00e3o</button>');
}
function toggleReviewTag(button){
  const selected=button.classList.toggle('pill-brand');
  button.setAttribute('aria-pressed',selected?'true':'false');
}
function setRating(n){
  ratingVal=Math.max(1,Math.min(5,Number(n)||1));
  $$('#rstars button').forEach((b,i)=>{
    const star=i+1;
    b.setAttribute('aria-pressed',star===ratingVal?'true':'false');
    const svg=b.querySelector('svg');
    if(svg){svg.style.opacity=star<=ratingVal?1:.25;svg.style.transform=star<=ratingVal?'scale(1.06)':'scale(1)';}
  });
}
function salvarAvaliacao(id){
  const o=S.orders.find(x=>x.id===id);
  const review={rating:ratingVal,comment:($('#rcom')||{}).value||'',tags:Array.from(document.querySelectorAll('#reviewTags .pill-brand')).map(button=>button.textContent.trim())};
  if(me().role==='profissional'){
    if(o.reviewByRole==='profissional'&&o.rating&&!o.clientRating){o.clientRating=o.rating;o.clientComment=o.comment;o.clientReviewTags=o.reviewTags;}
    o.clientRating=review.rating;o.clientComment=review.comment;o.clientReviewTags=review.tags;
  }else{
    if(o.reviewByRole==='profissional'&&o.rating&&!o.clientRating){o.clientRating=o.rating;o.clientComment=o.comment;o.clientReviewTags=o.reviewTags;}
    o.rating=review.rating;o.comment=review.comment;o.reviewTags=review.tags;o.reviewByRole='cliente';
  }
  notifyOrderOther(o,'Nova avaliação recebida',me().name+' deixou uma avaliação para este atendimento.',{kind:'review',type:'review_received'});
  Store.save();closeModal();
  toast('Obrigado pela avaliação!','ok');render();
}
function cancelarPedido(id){
  openModal('<div class="modal-head"><div><h3>Cancelar pedido</h3><p>Essa ação não pode ser desfeita.</p></div><button class="icon-btn" onclick="closeModal()">'+ic('x')+'</button></div>'+
  '<div class="field"><label>Motivo do cancelamento</label><select class="select" id="cmot"><option>Resolvi o problema sozinho</option><option>Encontrei outro profissional</option><option>O valor ficou acima do esperado</option><option>Demora no atendimento</option><option>Outro motivo</option></select></div>'+
  '<div style="padding:13px;border-radius:12px;background:color-mix(in srgb,var(--warn) 12%,transparent);font-size:.85rem;margin-bottom:18px">Cancelamentos após o início do deslocamento podem gerar taxa de compensação ao profissional.</div>'+
  '<div style="display:flex;gap:10px"><button class="btn btn-ghost btn-block" onclick="closeModal()">Voltar</button>'+
  '<button class="btn btn-danger btn-block" onclick="confirmarCancel(\''+id+'\')">Cancelar pedido</button></div>');
}
function confirmarCancel(id){
  const o=S.orders.find(x=>x.id===id);o.status='cancelado';
  notifyOrderOther(o,'Pedido cancelado','O outro participante cancelou este pedido.',{kind:'order',type:'order_cancelled'});
  Store.save();closeModal();toast('Pedido cancelado');render();
}
function compartilharRota(){
  openModal('<div class="modal-head"><div><h3>Compartilhar acompanhamento</h3><p>Envie o link do rastreio para alguém de confiança.</p></div><button class="icon-btn" onclick="closeModal()">'+ic('x')+'</button></div>'+
  '<div class="copy-box" id="shareLink">https://taskgo.com.br/track/'+uid().toUpperCase()+'</div>'+
  '<button class="btn btn-soft btn-block" style="margin-top:14px" onclick="copiar(document.getElementById(\'shareLink\').textContent)">'+ic('copy')+' Copiar link</button>'+
  '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:10px">'+
  '<button class="btn btn-ghost" onclick="toast(\'Abrindo WhatsApp...\')">WhatsApp</button>'+
  '<button class="btn btn-ghost" onclick="toast(\'Abrindo SMS...\')">SMS</button></div>');
}
function emergencia(){
  openModal('<div class="modal-head"><div><h3 style="color:var(--danger)">Acionar emergência</h3><p>Nosso time de segurança será notificado imediatamente.</p></div><button class="icon-btn" onclick="closeModal()">'+ic('x')+'</button></div>'+
  '<div style="display:flex;flex-direction:column;gap:10px">'+
  '<button class="btn btn-danger btn-block" onclick="closeModal();toast(\'Time de segurança acionado. Aguarde o contato.\',\'ok\')">'+ic('flag')+' Falar com segurança TaskGO</button>'+
  '<button class="btn btn-ghost btn-block" onclick="closeModal();toast(\'Ligando para 190...\')">'+ic('phone')+' Ligar para a Polícia (190)</button>'+
  '<button class="btn btn-ghost btn-block" onclick="closeModal();compartilharRota()">'+ic('nav')+' Compartilhar minha localização</button></div>');
}
function baixarRecibo(id){toast('Recibo gerado e enviado para o seu e-mail','ok');}

