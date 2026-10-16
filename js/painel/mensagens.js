/* ---------- MENSAGENS ---------- */
let chatAtivo='';
function chatPeer(ch){
  const o=S.orders.find(x=>x.id===ch.orderId);
  return o?counterpart(o):{name:'TaskGO',rating:5};
}
function myChats(){const ids=myOrders().map(o=>o.id);return S.chats.filter(c=>ids.indexOf(c.orderId)>=0);}
function dashMensagens(){
  const isPro=me().role==='profissional',list=myChats();
  const c=list.find(x=>x.id===chatAtivo)||list[0];
  if(!c)return dashHead('Mensagens','')+'<div class="card emptystate">'+ic('chat')+'Nenhuma conversa ainda</div>';
  chatAtivo=c.id;
  const p=chatPeer(c);
  return dashHead('Mensagens',isPro?'Converse com os clientes dos seus atendimentos.':'Converse com os profissionais dos seus pedidos.')+
  '<div class="grid g2" style="grid-template-columns:.7fr 1.3fr;align-items:start">'+
  '<div class="card" style="padding:12px">'+list.map(ch=>{
    const pp=chatPeer(ch),last=ch.msgs[ch.msgs.length-1]||{t:'Conversa iniciada após a confirmação do pedido.'},oo=S.orders.find(x=>x.id===ch.orderId);
    return '<div class="rowitem" style="cursor:pointer;'+(ch.id===chatAtivo?'border-color:var(--brand)':'')+'" onclick="chatAtivo=\''+ch.id+'\';render()">'+avatar({name:pp.name},40)+
    '<div class="grow"><b>'+esc(pp.name)+'</b><small style="display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+esc(last.t)+'</small></div>'+
    (oo?'<span class="tag tag-muted">'+svc(oo.service).n.split(' ')[0]+'</span>':'')+'</div>';
  }).join('')+'</div>'+
  '<div class="card"><div style="display:flex;align-items:center;gap:12px;padding-bottom:16px;border-bottom:1px solid var(--line);margin-bottom:16px">'+
  avatar({name:p.name},44)+'<div style="flex:1"><b style="display:block">'+esc(p.name)+'</b><span class="muted" style="font-size:.8rem"><span class="dot-live" style="display:inline-block"></span> online agora</span></div>'+
  '<a class="btn btn-ghost btn-sm" href="#/painel/pedido/'+c.orderId+'">Ver pedido</a></div>'+
  '<div class="chat" id="chatBox">'+(c.msgs.length?c.msgs.map(m=>'<div class="msg '+(m.me?'me':'them')+'">'+esc(m.t)+'<small>'+new Date(m.ts).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})+'</small></div>').join(''):'<p class="hint center">Conversa iniciada. Envie uma mensagem para combinar os detalhes do atendimento.</p>')+'</div>'+ 
  '<form style="display:flex;gap:10px;margin-top:16px" onsubmit="enviarMsg(event)">'+
  '<button type="button" class="icon-btn" onclick="toast(\'Envio de foto disponível no app\')">'+ic('clip')+'</button>'+
  '<input class="input" id="msgIn" placeholder="Escreva uma mensagem..." autocomplete="off">'+
  '<button class="btn btn-primary">'+ic('arrow')+'</button></form></div></div>';
}
function enviarMsg(e){
  e.preventDefault();
  const v=($('#msgIn')||{}).value.trim();if(!v)return;
  const c=S.chats.find(x=>x.id===chatAtivo);if(!c)return;
  c.msgs.push({me:true,t:v,ts:Date.now()});
  const order=S.orders.find(o=>o.id===c.orderId);
  notifyOrderOther(order,'Nova mensagem',me().name+' enviou uma mensagem sobre o pedido.',{kind:'message',route:'/painel/mensagens'});
  Store.save();render();
  setTimeout(()=>{
    const isPro=me()&&me().role==='profissional';
    const reps=isPro?['Perfeito, combinado!','Certo, vou te aguardar aqui.','Pode subir, estou em casa.','Obrigado pelo retorno!','Tudo bem, sem pressa.']
                    :['Perfeito, combinado!','Certo, já estou a caminho.','Consigo sim, sem problema.','Vou levar a ferramenta necessária.','Obrigado pelo contato!'];
    const reply=reps[rand(0,reps.length-1)];
    c.msgs.push({me:false,t:reply,ts:Date.now()});
    const current=me();if(current)notifyUser(current.id,'Nova mensagem de '+chatPeer(c).name,reply,{kind:'message',route:'/painel/mensagens'});
    Store.save();
    if(route.page==='painel'&&route.sub==='mensagens')render();
  },1400);
}

