/* ---------- OPORTUNIDADES (PRO) ---------- */
const OPS_POOL=[
  {s:'eletrica',d:2.1,v:280,t:'Chuveiro não esquenta e disjuntor desarma',b:'Boa Viagem',u:'Agora',c:'Camila Ribeiro',end:'Av. Boa Viagem, 3200 — Boa Viagem, Recife/PE'},
  {s:'ar',d:4.8,v:420,t:'Instalação de split 12.000 BTUs',b:'Pina',u:'Hoje',c:'Condomínio Aurora',end:'Rua Padre Carapuceiro, 890 — Pina, Recife/PE'},
  {s:'eletrica',d:6.3,v:190,t:'Troca de 4 tomadas e 1 interruptor',b:'Espinheiro',u:'Amanhã',c:'Roberto Farias',end:'Rua Sete de Setembro, 145 — Espinheiro, Recife/PE'},
  {s:'marido',d:1.4,v:150,t:'Fixar 3 prateleiras e 1 TV na parede',b:'Madalena',u:'Hoje',c:'Juliana Prado',end:'Rua Benfica, 77 — Madalena, Recife/PE'},
  {s:'eletrica',d:3.7,v:540,t:'Instalação de quadro de distribuição novo',b:'Casa Forte',u:'Hoje',c:'Marcelo Duarte',end:'Rua Dom Bosco, 410 — Casa Forte, Recife/PE'},
  {s:'cftv',d:5.2,v:860,t:'Instalação de 4 câmeras e DVR',b:'Graças',u:'Amanhã',c:'Padaria São José',end:'Rua das Graças, 78 — Graças, Recife/PE'},
  {s:'eletrica',d:1.1,v:120,t:'Troca de lâmpadas e luminárias de LED',b:'Boa Viagem',u:'Agora',c:'Fernanda Lopes',end:'Rua Setúbal, 900 — Boa Viagem, Recife/PE'},
  {s:'ar',d:7.4,v:320,t:'Higienização de 2 splits',b:'Olinda',u:'Esta semana',c:'Studio Vitória',end:'Av. Getúlio Vargas, 120 — Olinda/PE'}
];
let liveOps=[],opsTimer=null;
function dashOportunidades(){
  const u=me();
  if(!u.available){
    return dashHead('Oportunidades','Você está offline. Nenhum pedido é enviado enquanto sua identidade não for confirmada.')+
    '<div class="card" style="text-align:center;padding:clamp(28px,5vw,46px)">'+
      '<div class="ico-box" style="margin:0 auto 16px;width:58px;height:58px;border-radius:18px">'+ic('camera')+'</div>'+
      '<h3>Confirme sua identidade para ficar disponível</h3>'+
      '<p class="muted" style="font-size:.93rem;max-width:460px;margin:12px auto 0">Por segurança dos clientes, fazemos uma verificação facial rápida sempre que você entra em modo disponível. Leva menos de 10 segundos.</p>'+
      '<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin:24px 0 6px">'+
      [['shield','Antifraude'],['user','Prova de vida'],['lock','Dados protegidos']].map(x=>'<span class="pill">'+ic(x[0])+' '+x[1]+'</span>').join('')+'</div>'+
      '<button class="btn btn-grad btn-lg" style="margin-top:14px" onclick="ficarDisponivel()">'+ic('camera')+' Fazer verificação facial</button>'+
      (u.lastFace?'<p class="hint" style="margin-top:14px">Última verificação: '+dt(u.lastFace)+'</p>':'')+
    '</div>';
  }
  return dashHead('Oportunidades','Estimativas de serviço registradas pelos clientes.',
    '<button class="btn btn-ghost" onclick="ajustarRaio()">'+ic('filter')+' Ajustar raio</button>')+
  '<div class="card" style="margin-bottom:20px;display:flex;gap:16px;align-items:center;flex-wrap:wrap;border-color:color-mix(in srgb,var(--accent) 34%,var(--line))">'+
  '<div class="ico-box" style="background:color-mix(in srgb,var(--accent) 14%,transparent);border-color:color-mix(in srgb,var(--accent) 28%,transparent)">'+ic('checkCircle')+'</div>'+
  '<div style="flex:1;min-width:220px"><b><span class="dot-live" style="display:inline-block;margin-right:6px"></span>Disponível · identidade confirmada</b>'+
  '<p class="muted" style="font-size:.88rem">Verificação facial feita '+(me().lastFace?dt(me().lastFace):'agora')+'. Seu perfil está marcado como disponível.</p></div>'+ 
  '<div class="switch on" onclick="ficarOffline()"></div></div>'+
  '<div id="mural-pedidos" aria-live="polite">'+
    '<div class="card center" style="padding:30px"><div class="radar">'+ic('target')+'</div>'+ 
    '<b>Carregando pedidos salvos…</b></div>'+ 
  '</div>';
}
function carregarPedidos(){
  const container=document.getElementById('mural-pedidos');
  if(!container)return Promise.resolve();
  container.innerHTML='<div class="card center" style="padding:30px"><div class="radar">'+ic('target')+'</div><b>Carregando pedidos salvos…</b></div>';
  return fetch('http://localhost:8080/api/pedidos',{method:'GET'})
    .then(response=>{
      if(!response.ok)throw new Error('Falha ao carregar pedidos: HTTP '+response.status);
      return response.json();
    })
    .then(pedidos=>{
      if(!Array.isArray(pedidos))throw new Error('A resposta da API não contém uma lista de pedidos.');
      const porSolicitacao=new Map();
      pedidos.forEach(pedido=>{
        const campos=[pedido.servico,pedido.distancia,pedido.emailCliente].map(valor=>String(valor||'').trim().toLowerCase());
        const chave=campos.every(Boolean)?JSON.stringify(campos):'id:'+String(pedido.id);
        const anterior=porSolicitacao.get(chave);
        if(!anterior||Number(pedido.id||0)>=Number(anterior.id||0))porSolicitacao.set(chave,pedido);
      });
      const pedidosVisiveis=Array.from(porSolicitacao.values()).sort((a,b)=>Number(b.id||0)-Number(a.id||0));
      container.innerHTML='';
      if(!pedidosVisiveis.length){
        container.innerHTML='<div class="card center" style="padding:26px"><p class="muted" style="font-size:.9rem">Nenhuma estimativa foi cadastrada ainda.</p></div>';
        return;
      }
      pedidosVisiveis.forEach(pedido=>{
        const categoria=SERVICES.find(item=>item.id===pedido.servico);
        const nomeServico=categoria?categoria.n:(pedido.servico||'Serviço não informado');
        const icone=categoria?categoria.ico:'wrench';
        const distancia=pedido.distancia||'Raio não informado';
        const email=pedido.emailCliente||'E-mail não informado';
        container.insertAdjacentHTML('beforeend',
          '<article class="card op-in" style="margin-bottom:12px"><div style="display:flex;gap:14px;align-items:flex-start;flex-wrap:wrap">'+
          '<div class="ico-box">'+ic(icone)+'</div>'+ 
          '<div style="flex:1;min-width:200px"><b style="display:block">'+esc(nomeServico)+'</b>'+ 
          '<small class="muted">Solicitado por '+esc(email)+'</small>'+ 
          '<div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap"><span class="tag tag-muted">'+ic('mapPin')+' Raio: '+esc(distancia)+'</span>'+ 
          '<span class="tag tag-info">'+ic('clock')+' Estimativa salva</span></div></div>'+ 
          '<div style="text-align:right"><b style="font-size:1.05rem;display:block">Pedido #'+esc(String(pedido.id??''))+'</b><small class="muted">TaskGO</small></div>'+ 
          '</div></article>'
        );
      });
    })
    .catch(error=>{
      console.error('Erro ao carregar pedidos:',error);
      container.innerHTML='<div class="card center" style="padding:26px"><p class="muted" style="font-size:.9rem;margin-bottom:14px">Não foi possível carregar os pedidos. Confira se o servidor está ativo.</p><button class="btn btn-ghost btn-sm" type="button" onclick="carregarPedidos()">Tentar novamente</button></div>';
    });
}
function ficarDisponivel(){
  faceScan('Verificação facial','Confirme que é você antes de entrar em modo disponível.',()=>{
    saveUser({available:true,faceVerified:true,lastFace:Date.now()});
    liveOps=[];
    toast('Você está disponível! Buscando pedidos…','ok');
    render();
  });
}
function ficarOffline(){
  liveOps=[];
  if(opsTimer){clearInterval(opsTimer);opsTimer=null;}
  saveUser({available:false});
  toast('Você está offline. Nenhum pedido será enviado.');
  render();
}
function pushOp(){
  if(liveOps.length>=OPS_POOL.length)return;
  const op=Object.assign({},OPS_POOL[liveOps.length],{ts:Date.now()});
  liveOps.unshift(op);
  notifyRole('profissional','Novo pedido disponível',op.t+' · '+money(op.v)+' · '+op.d+' km',{kind:'order',route:'/painel/oportunidades'});
  Store.save();
  toast('Novo pedido: '+op.t,'ok');
  if(route.page==='painel'&&route.sub==='oportunidades')render();
}
function startOpsFeed(){
  if(opsTimer){clearInterval(opsTimer);opsTimer=null;}
  const u=me();
  if(!u||u.role!=='profissional'||!u.available)return;
  if(liveOps.length>=OPS_POOL.length)return;
  opsTimer=setInterval(pushOp,liveOps.length?6500:2600);
}
function recusarOp(i){liveOps.splice(i,1);toast('Pedido recusado');render();}
function aceitarPedido(i){
  const u=me(),op=liveOps[i];
  if(!u||!op)return;
  if(!u.proId){toast('Complete seu cadastro profissional para aceitar pedidos','err');return go('/painel/config');}
  let cli=(S.clients||[]).find(c=>c.name===op.c);
  if(!cli){cli={id:'c_'+uid(),name:op.c,address:op.end,phone:'(81) 9'+rand(1000,9999)+'-'+rand(1000,9999),rating:4.8,jobs:rand(1,12),since:Date.now()-rand(30,400)*864e5};S.clients.push(cli);}
  const o={id:'o_'+uid(),code:String(rand(1000,9999)),created:Date.now(),status:'a_caminho',
    price:op.v,service:op.s,proId:u.proId,clientId:cli.id,address:op.end,rating:null,
    notes:op.t,paid:'pix',dist:op.d,eta:Math.round(op.d*3.4)+4,progress:0};
  S.orders.unshift(o);
  S.chats.unshift({id:'ch_'+uid(),orderId:o.id,msgs:[{me:false,t:'Oi! '+op.t+'. Consegue vir hoje?',ts:Date.now()}]});
  notifyOrderOther(o,'Profissional a caminho','O profissional aceitou o pedido e está a caminho.',{kind:'order',type:'professional_accepted'});
  liveOps.splice(i,1);
  Store.save();toast('Pedido aceito! Siga para o endereço do cliente.','ok');go('/painel/pedido/'+o.id);
}
function ajustarRaio(){
  const u=me();
  openModal('<div class="modal-head"><div><h3>Raio de atendimento</h3><p>Receba apenas pedidos dentro da distância escolhida.</p></div><button class="icon-btn" onclick="closeModal()">'+ic('x')+'</button></div>'+
  '<div class="field"><label>Distância máxima: <b id="raioL">'+(u.acceptRadius||10)+' km</b></label>'+
  '<input type="range" min="1" max="50" value="'+(u.acceptRadius||10)+'" style="width:100%" oninput="document.getElementById(\'raioL\').textContent=this.value+\' km\';window.__raio=this.value"></div>'+
  '<button class="btn btn-grad btn-block" onclick="saveUser({acceptRadius:+(window.__raio||'+(u.acceptRadius||10)+')});closeModal();toast(\'Raio atualizado\',\'ok\');render()">Salvar</button>');
}

