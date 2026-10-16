/* ---------- ESTADO ---------- */
const S=Store.load();
const me=()=>S.users.find(u=>u.id===S.session)||null;
const proById=id=>S.pros.find(p=>p.id===id)||S.pros[0];
function clientOf(o){
  return S.users.find(u=>u.id===o.clientId)||(S.clients||[]).find(c=>c.id===o.clientId)||
    {id:o.clientId,name:'Cliente TaskGO',address:o.address,phone:'—',rating:5,jobs:1};
}
/* quem aparece do outro lado do pedido, do ponto de vista de quem está logado */
function counterpart(o){const u=me();return (u&&u.role==='profissional')?clientOf(o):proById(o.proId);}
function counterLabel(){const u=me();return (u&&u.role==='profissional')?'Cliente':'Profissional';}
function myNotifs(){
  const u=me();if(!u)return[];
  const createdAt=Number(u.since)||0;
  return S.notifs.filter(n=>{
    if(n.userId)return n.userId===u.id;
    if(n.for&&n.for!==u.role)return false;
    // Avisos antigos de demonstração não devem aparecer para contas criadas depois deles.
    return !createdAt||!n.ts||Number(n.ts)>=createdAt;
  }).sort((a,b)=>(b.ts||0)-(a.ts||0));
}
function notifyUser(userId,t,d,meta={}){
  if(!userId||!S.users.some(u=>u.id===userId))return null;
  if(meta.type&&meta.orderId&&S.notifs.some(n=>n.userId===userId&&n.type===meta.type&&n.orderId===meta.orderId))return null;
  const n=Object.assign({id:uid(),userId,t,d,ts:Date.now(),read:false},meta);
  S.notifs.unshift(n);S.notifs=S.notifs.slice(0,200);Store.save();return n;
}
function notifyRole(role,t,d,meta={}){
  if(meta.type&&meta.orderId&&S.notifs.some(n=>n.for===role&&n.type===meta.type&&n.orderId===meta.orderId))return null;
  const n=Object.assign({id:uid(),for:role,t,d,ts:Date.now(),read:false},meta);
  S.notifs.unshift(n);S.notifs=S.notifs.slice(0,200);Store.save();return n;
}
function notifyOrderOther(o,t,d,meta={}){
  const u=me();if(!u||!o)return null;
  const other=u.role==='profissional'
    ?S.users.find(x=>x.role==='cliente'&&x.id===o.clientId)
    :S.users.find(x=>x.role==='profissional'&&x.proId===o.proId);
  return other?notifyUser(other.id,t,d,Object.assign({orderId:o.id,route:'/painel/pedido/'+o.id},meta)):null;
}
function markNotifRead(id){
  const n=myNotifs().find(x=>x.id===id);if(!n)return;
  n.read=true;Store.save();
}
function openNotif(id){
  const n=myNotifs().find(x=>x.id===id);if(!n)return;
  n.read=true;Store.save();
  if(n.route)go(n.route);else render();
}
function markAllNotifsRead(){myNotifs().forEach(n=>n.read=true);Store.save();render();}
function saveUser(patch){const u=me();if(!u)return;Object.assign(u,patch);Store.save();}

/* ---------- TEMA ---------- */
function applyTheme(t){document.documentElement.setAttribute('data-theme',t);}
applyTheme('dark');
function toggleTheme(){const cur=document.documentElement.getAttribute('data-theme');applyTheme(cur==='dark'?'light':'dark');render();}

