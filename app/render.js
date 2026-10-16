/* =========================================================
   RENDER
   ========================================================= */
function render(){
  if(trackTimer){clearInterval(trackTimer);trackTimer=null;}
  if(opsTimer){clearInterval(opsTimer);opsTimer=null;}
  const p=route.page;
  if(p!=='contratar')W.presetService='';
  let body='',full=false;
  if(p==='entrar'){body=pageEntrar();full=true;}
  else if(p==='painel'){body=pageDash();full=true;}
  else if(p==='servicos')body=pageServicos();
  else if(p==='como-funciona')body=pageComo();
  else if(p==='sobre')body=pageSobre();
  else if(p==='profissionais')body=pageProfissionais();
  else if(p==='planos')body=pagePlanos();
  else if(p==='seguranca')body=pageSeguranca();
  else if(p==='ajuda')body=pageAjuda();
  else if(p==='contato')body=pageContato();
  else if(p==='legal')body=pageLegal();
  else if(p==='contratar')body=pageContratar();
  else body=pageHome();
  document.getElementById('root').innerHTML=header()+body+(full?'':footer())+
    (p==='painel'||p==='entrar'?'':'<button class="fab-help" onclick="abrirChatSuporte()" title="Ajuda">'+ic('chat')+'</button>');
  enhanceInteractiveButtons(document.getElementById('root'));
  /* pós-render */
  if(p==='profissionais')simular();
  if(p==='painel'){
    if(route.sub==='pedido')setTimeout(startTracking,60);
    else if(!route.sub)setTimeout(()=>placeMarker('mini',(S.orders.find(o=>['a_caminho','chegou','em_andamento','aguardando'].includes(o.status))||{}).progress||0),30);
    if(route.sub==='mensagens'){const b=$('#chatBox');if(b)b.scrollTop=b.scrollHeight;}
    if(route.sub==='oportunidades')setTimeout(carregarPedidos,40);
  }
}
function abrirChatSuporte(){
  openModal('<div class="modal-head"><div style="display:flex;gap:12px;align-items:center">'+
  '<div class="ico-box">'+ic('chat')+'</div><div><h3>Suporte TaskGO</h3><p><span class="dot-live" style="display:inline-block"></span> Atendimento online agora</p></div></div>'+
  '<button class="icon-btn" onclick="closeModal()">'+ic('x')+'</button></div>'+
  '<div class="chat" style="max-height:220px"><div class="msg them">Olá! Sou o assistente da TaskGO. Como posso ajudar você hoje?<small>agora</small></div></div>'+
  '<div style="display:flex;gap:8px;flex-wrap:wrap;margin:16px 0">'+
  ['Como funciona o pagamento?','Quero cancelar um pedido','Falar com um humano','Quero ser profissional']
  .map(q=>'<button class="pill" onclick="toast(\'Encaminhando para o atendimento...\')">'+q+'</button>').join('')+'</div>'+
  '<div style="display:flex;gap:10px"><input class="input" placeholder="Digite sua dúvida..."><button class="btn btn-primary" onclick="toast(\'Mensagem enviada ao suporte\',\'ok\')">'+ic('arrow')+'</button></div>');
}

