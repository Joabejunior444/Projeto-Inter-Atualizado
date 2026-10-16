/* ---------- CARTEIRA ---------- */
function qrSVG(seed){
  let s=0;for(let i=0;i<seed.length;i++)s=(s*31+seed.charCodeAt(i))>>>0;
  const n=25,c=[];
  const rnd=()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296;};
  for(let y=0;y<n;y++)for(let x=0;x<n;x++){
    const fin=(x<7&&y<7)||(x>n-8&&y<7)||(x<7&&y>n-8);
    let on=fin?((x%6===0||y%6===0)?false:true):rnd()>.52;
    if(fin){const lx=x%(n-7),ly=y%(n-7);}
    if(on)c.push('<rect x="'+x+'" y="'+y+'" width="1" height="1"/>');
  }
  const eye=(x,y)=>'<rect x="'+x+'" y="'+y+'" width="7" height="7" fill="none" stroke="#000" stroke-width="1"/><rect x="'+(x+2)+'" y="'+(y+2)+'" width="3" height="3"/>';
  return '<svg class="qr" viewBox="-1 -1 27 27"><rect x="-1" y="-1" width="27" height="27" fill="#fff"/><g fill="#000">'+c.join('')+'</g>'+
  '<g fill="#fff"><rect x="0" y="0" width="7" height="7"/><rect x="18" y="0" width="7" height="7"/><rect x="0" y="18" width="7" height="7"/></g>'+
  '<g fill="#000">'+eye(0,0)+eye(18,0)+eye(0,18)+'</g></svg>';
}
/* Visao financeira separada por perfil. */
function dashCarteira(){
  const u=me(),isPro=u.role==='profissional';
  const ownedTx=S.tx.filter(t=>t.ownerId===u.id);
  const clientOrders=myOrders().filter(o=>o.status!=='cancelado');
  const clientOrderTx=clientOrders.map(o=>({id:'order_'+o.id,type:'out',label:'Pagamento de servi\u00e7o — '+svc(o.service).n,amount:Number(o.price)||0,ts:o.created||Date.now(),method:{pix:'PIX',card:'Cart\u00e3o',wallet:'Carteira'}[o.paid]||'PIX',status:'ok'}));
  const clientCreditTx=ownedTx.filter(t=>t.type==='in');
  const txList=(isPro?ownedTx:clientOrderTx.concat(clientCreditTx)).sort((a,b)=>(b.ts||0)-(a.ts||0));
  const entradas=ownedTx.filter(t=>t.type==='in').reduce((a,t)=>a+(Number(t.amount)||0),0);
  const saidas=ownedTx.filter(t=>t.type==='out').reduce((a,t)=>a+(Number(t.amount)||0),0);
  const gasto=clientOrders.reduce((a,o)=>a+(Number(o.price)||0),0);
  const bonus=clientCreditTx.filter(t=>/bonus|cashback|credito|indicacao/i.test((t.label||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase())).reduce((a,t)=>a+(Number(t.amount)||0),0);
  const actions='<button class="btn btn-ghost" onclick="abrirPix()">'+ic('pix')+' '+(isPro?'Receber':'Adicionar saldo')+'</button>'+(isPro?'<button class="btn btn-grad" onclick="abrirSaque()">'+ic('down')+' Sacar</button>':'');
  const stats=isPro?[
    '<div class="stat"><div class="lbl">Total recebido</div><div class="val" style="color:var(--accent)">'+money(entradas)+'</div><div class="delta muted">Desde o inicio</div></div>',
    '<div class="stat"><div class="lbl">Total sacado / taxas</div><div class="val">'+money(saidas)+'</div><div class="delta muted">Movimentacoes da sua conta</div></div>',
    '<div class="stat"><div class="lbl">Taxa do seu plano</div><div class="val">'+(u.plan==='plus'?'8%':'12%')+'</div><div class="delta" style="color:var(--brand)">'+(u.plan==='plus'?'TaskGO Plus ativo':'<a href="#/painel/plano" style="color:var(--brand)">Reduzir com o Plus</a>')+'</div></div>'
  ]:[
    '<div class="stat"><div class="lbl">Total gasto</div><div class="val">'+money(gasto)+'</div><div class="delta muted">Em pedidos nao cancelados</div></div>',
    '<div class="stat"><div class="lbl">Cashback e b\u00f4nus</div><div class="val" style="color:var(--accent)">'+money(bonus)+'</div><div class="delta muted">Cr\u00e9ditos da sua conta</div></div>',
    '<div class="stat"><div class="lbl">Pedidos considerados</div><div class="val">'+clientOrders.length+'</div><div class="delta muted">Pedidos n\u00e3o cancelados</div></div>'
  ];
  const transactions=txList.length?txList.map(t=>'<div class="tx"><div class="ti" style="background:color-mix(in srgb,'+(t.type==='in'?'var(--accent)':'var(--danger)')+' 14%,transparent)">'+ic(t.type==='in'?'up':'down').replace('class="ic "','class="ic" style="stroke:'+(t.type==='in'?'var(--accent)':'var(--danger)')+'"')+'</div><div style="min-width:0"><b style="font-size:.9rem;display:block">'+esc(t.label)+'</b><small class="muted" style="font-size:.78rem">'+dt(t.ts)+' · '+esc(t.method||'')+(t.status==='pendente'?' · <span style="color:var(--warn)">pendente</span>':'')+'</small></div><span class="amt '+(t.type==='in'?'in':'out')+'">'+(t.type==='in'?'+':'−')+' '+money(t.amount)+'</span></div>').join(''):'<p class="muted" style="padding:16px 0">Ainda nao ha movimentacoes nesta carteira.</p>';
  const autoSaque=isPro?'<div class="card" style="margin-top:16px"><h3 style="font-size:1rem;margin-bottom:10px">Saque autom\u00e1tico</h3><p class="muted" style="font-size:.86rem;margin-bottom:14px">Transfira o saldo para sua chave PIX automaticamente toda sexta-feira.</p><div class="check-row" style="padding-top:0"><span style="font-size:.9rem;font-weight:600">Ativar saque automatico</span><div class="switch '+(u.autoSaque?'on':'')+'" onclick="saveUser({autoSaque:!me().autoSaque});render()"></div></div></div>':'<div class="card" style="margin-top:16px"><h3 style="font-size:1rem;margin-bottom:10px">Adicionar saldo</h3><p class="muted" style="font-size:.86rem;margin:0">Use o PIX para colocar cr\u00e9ditos na carteira e pagar seus pedidos.</p></div>';
  return dashHead(isPro?'Carteira & Ganhos':'Minha carteira',isPro?'Acompanhe seus ganhos, receba via PIX e saque quando quiser.':'Acompanhe seus gastos com servi\u00e7os, recargas e b\u00f4nus.',actions)+
    '<div class="card" style="background:linear-gradient(135deg,color-mix(in srgb,var(--brand) 22%,var(--surface)),color-mix(in srgb,var(--purple) 16%,var(--surface)));border-color:color-mix(in srgb,var(--brand) 32%,var(--line));margin-bottom:20px"><div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:20px"><div><span class="muted" style="font-size:.82rem;font-weight:700">'+(isPro?'SALDO DISPON\u00cdVEL':'SALDO PARA USAR EM SERVI\u00c7OS')+'</span><div style="font-size:clamp(2rem,5vw,2.8rem);font-weight:800;letter-spacing:-.04em;margin:6px 0">'+money(u.balance)+'</div>'+(isPro?'<span class="pill">'+ic('clock')+' '+money(u.pending)+' a liberar</span>':'<span class="pill">Saldo dispon\u00edvel para novos pedidos</span>')+'</div>'+(isPro?'<div style="text-align:right"><span class="muted" style="font-size:.8rem">Chave PIX cadastrada</span><div style="font-weight:700;font-size:.95rem;margin:4px 0 10px">'+esc(u.pixKey||'—')+'</div><button class="btn btn-ghost btn-sm" onclick="editarChavePix()">'+ic('key')+' Alterar chave</button></div>':'')+'</div></div>'+
    '<div class="grid g3" style="margin-bottom:22px">'+stats.join('')+'</div><div class="grid g2" style="grid-template-columns:1.4fr .6fr;align-items:start"><div class="card"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><h3 style="font-size:1.05rem">Extrato</h3><button class="btn btn-ghost btn-sm" onclick="toast(\'Extrato exportado em CSV\',\'ok\')">'+ic('file')+' Exportar</button></div>'+transactions+'</div><div><div class="card"><h3 style="font-size:1rem;margin-bottom:14px">Formas de pagamento</h3><div class="rowitem" style="margin-bottom:10px"><div class="ico-box" style="width:38px;height:38px;border-radius:11px">'+ic('pix')+'</div><div class="grow"><b>PIX</b><small>Instant\u00e2neo · sem taxa</small></div><span class="tag tag-ok">Padrao</span></div><div class="rowitem" style="margin-bottom:10px"><div class="ico-box" style="width:38px;height:38px;border-radius:11px">'+ic('card')+'</div><div class="grow"><b>Nenhum cartão cadastrado</b><small>Adicione um cartão quando precisar.</small></div></div><button class="btn btn-ghost btn-block btn-sm" onclick="toast(\'Adicione um cart\u00e3o nas configura\u00e7\u00f5es\')">'+ic('plus')+' Adicionar forma</button></div>'+autoSaque+'</div></div>';
}

function abrirPix(){
  const u=me();
  const key='00020126580014BR.GOV.BCB.PIX0136'+uid()+uid()+'5204000053039865802BR5913TASKGO6009RECIFE62070503***6304'+rand(1000,9999);
  openModal('<div class="modal-head"><div><h3>'+(u.role==='profissional'?'Receber via PIX':'Adicionar saldo via PIX')+'</h3><p>Escaneie o QR Code ou use o PIX copia e cola.</p></div><button class="icon-btn" onclick="closeModal()">'+ic('x')+'</button></div>'+
  '<div class="field"><label>Valor</label><input class="input" id="pixVal" type="number" min="1" step="0.01" placeholder="0,00" value="100"></div>'+
  qrSVG(key)+
  '<p class="center muted" style="font-size:.82rem;margin:14px 0 10px">Validade: 30 minutos</p>'+
  '<div class="copy-box" id="pixKey">'+key+'</div>'+
  '<button class="btn btn-soft btn-block" style="margin-top:12px" onclick="copiar(document.getElementById(\'pixKey\').textContent)">'+ic('copy')+' Copiar código PIX</button>'+
  '<button class="btn btn-grad btn-block" style="margin-top:10px" onclick="simularPix()">'+ic('check')+' Já efetuei o pagamento</button>');
}
function simularPix(){
  const v=parseFloat(($('#pixVal')||{}).value||'0');
  if(!v||v<=0)return toast('Informe um valor válido','err');
  const u=me();u.balance+=v;
  S.tx.unshift({id:uid(),ownerId:u.id,type:'in',label:u.role==='profissional'?'Recebimento via PIX':'Recarga de saldo via PIX',amount:v,ts:Date.now(),method:'PIX',status:'ok'});
  notifyUser(u.id,u.role==='profissional'?'Recebimento registrado':'Saldo adicionado',money(v)+(u.role==='profissional'?' recebido via PIX.':' adicionados à sua carteira.'),{kind:'payment',route:'/painel/carteira'});
  Store.save();closeModal();toast(money(v)+' creditado na sua carteira!','ok');render();
}
function abrirSaque(){
  const u=me();
  openModal('<div class="modal-head"><div><h3>Sacar via PIX</h3><p>Disponível: <b>'+money(u.balance)+'</b></p></div><button class="icon-btn" onclick="closeModal()">'+ic('x')+'</button></div>'+
  '<div class="field"><label>Valor do saque</label><input class="input" id="sqVal" type="number" min="1" step="0.01" placeholder="0,00"></div>'+
  '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px">'+[50,100,200,'Tudo'].map(v=>'<button class="pill" onclick="document.getElementById(\'sqVal\').value='+(v==='Tudo'?u.balance:v)+'">'+(v==='Tudo'?'Sacar tudo':'R$ '+v)+'</button>').join('')+'</div>'+
  '<div class="field"><label>Chave PIX de destino</label><input class="input" id="sqKey" value="'+esc(u.pixKey||'')+'"></div>'+
  '<div style="padding:13px;border-radius:12px;background:var(--surface-2);font-size:.85rem;margin-bottom:16px;display:flex;gap:10px">'+ic('clock')+
  '<span>'+(u.plan==='plus'?'Saque <b>instantâneo e sem taxa</b> no plano Plus.':'Compensação em até 30 minutos em dias úteis. Taxa de R$ 1,99 por saque.')+'</span></div>'+
  '<button class="btn btn-grad btn-block" onclick="confirmarSaque()">'+ic('down')+' Continuar</button>');
}
let saquePend=null;
function confirmarSaque(){
  const u=me(),v=parseFloat(($('#sqVal')||{}).value||'0'),key=($('#sqKey')||{}).value;
  if(!v||v<=0)return toast('Informe um valor válido','err');
  if(v>u.balance)return toast('Saldo insuficiente','err');
  if(!key)return toast('Informe a chave PIX','err');
  saquePend={v:v,key:key};
  const taxa=u.plan==='plus'?0:1.99;
  openModal('<div class="modal-head"><div><h3>Confirme com sua senha</h3><p>Transferências exigem confirmação. Nunca compartilhe sua senha.</p></div>'+
  '<button class="icon-btn" onclick="closeModal()">'+ic('x')+'</button></div>'+
  '<div class="card" style="background:var(--surface-2);margin-bottom:18px;padding:16px">'+
  '<div style="display:flex;justify-content:space-between;padding:6px 0"><span class="muted" style="font-size:.88rem">Valor</span><b>'+money(v)+'</b></div>'+
  '<div style="display:flex;justify-content:space-between;padding:6px 0"><span class="muted" style="font-size:.88rem">Taxa</span><b>'+(taxa?money(taxa):'Grátis')+'</b></div>'+
  '<div style="display:flex;justify-content:space-between;padding:6px 0;gap:16px"><span class="muted" style="font-size:.88rem">Chave PIX</span><b style="font-size:.88rem;text-align:right;word-break:break-all">'+esc(key)+'</b></div>'+
  '<div style="display:flex;justify-content:space-between;padding-top:10px;margin-top:6px;border-top:1px solid var(--line)"><b>Você recebe</b><b style="color:var(--accent)">'+money(v-taxa)+'</b></div></div>'+
  '<div class="field"><label>Senha da conta</label><input class="input" type="password" id="sqPass" placeholder="Digite sua senha" autocomplete="current-password"></div>'+
  (u.twofa?'<div class="field"><label>Código de verificação (SMS)</label><input class="input" id="sq2fa" inputmode="numeric" maxlength="6" placeholder="Enviamos para '+esc(String(u.phone||'').slice(-4).padStart(9,'*'))+'"><div class="hint">Código de teste: <b>000000</b>.</div></div>':'')+
  '<div style="padding:12px 14px;border-radius:12px;background:color-mix(in srgb,var(--warn) 12%,transparent);font-size:.84rem;margin-bottom:16px;display:flex;gap:10px">'+ic('shield')+
  '<span>A TaskGO nunca pede sua senha por telefone, e-mail ou WhatsApp.</span></div>'+
  '<div style="display:flex;gap:10px"><button class="btn btn-ghost btn-block" onclick="closeModal()">Cancelar</button>'+
  '<button class="btn btn-grad btn-block" onclick="executarSaque()">'+ic('lock')+' Confirmar saque</button></div>');
}
function executarSaque(){
  const u=me();
  if(!saquePend)return closeModal();
  const pw=($('#sqPass')||{}).value||'';
  if(!pw)return toast('Digite sua senha para confirmar','err');
  if(pw!==u.pass)return toast('Senha incorreta','err');
  if(u.twofa){
    const c=($('#sq2fa')||{}).value||'';
    if(c!=='000000')return toast('Código de verificação inválido','err');
  }
  const v=saquePend.v,key=saquePend.key;saquePend=null;
  const taxa=u.plan==='plus'?0:1.99;
  u.balance-=v;u.pixKey=key;
  S.tx.unshift({id:uid(),ownerId:u.id,type:'out',label:'Saque para chave PIX',amount:v,ts:Date.now(),method:'PIX',status:'ok'});
  if(taxa)S.tx.unshift({id:uid(),ownerId:u.id,type:'out',label:'Taxa de saque',amount:taxa,ts:Date.now(),method:'Automático',status:'ok'});
  if(taxa)u.balance=Math.max(0,u.balance-taxa);
  notifyUser(u.id,'Saque solicitado',money(v)+' foi enviado para processamento via PIX.',{kind:'payment',route:'/painel/carteira'});
  Store.save();closeModal();toast('Saque de '+money(v)+' solicitado!','ok');render();
}
function editarChavePix(){
  const u=me();
  openModal('<div class="modal-head"><div><h3>Chave PIX</h3><p>Use CPF, e-mail, telefone ou chave aleatória.</p></div><button class="icon-btn" onclick="closeModal()">'+ic('x')+'</button></div>'+
  '<div class="field"><label>Tipo da chave</label><select class="select" id="pkType"><option>CPF</option><option>E-mail</option><option>Telefone</option><option>Chave aleatória</option></select></div>'+
  '<div class="field"><label>Chave</label><input class="input" id="pkVal" value="'+esc(u.pixKey||'')+'"></div>'+
  '<button class="btn btn-grad btn-block" onclick="salvarChavePix()">Salvar chave</button>');
}
function salvarChavePix(){saveUser({pixKey:($('#pkVal')||{}).value});closeModal();toast('Chave PIX atualizada','ok');render();}
function copiar(t){
  try{navigator.clipboard.writeText(t);}catch(e){}
  toast('Copiado para a área de transferência','ok');
}
