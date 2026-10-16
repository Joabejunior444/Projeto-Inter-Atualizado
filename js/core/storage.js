/* ---------- STORAGE ---------- */
const KEY='taskgo.v3';
const Store={
  data:null,
  load(){
    try{const raw=localStorage.getItem(KEY);if(raw)this.data=JSON.parse(raw);}catch(e){this.data=null;}
    const base=seed();
    if(!this.data||!this.data.users)this.data=base;
    else ['users','pros','clients','orders','tx','chats','notifs'].forEach(k=>{if(!Array.isArray(this.data[k]))this.data[k]=base[k];});
    let changed=false;
    this.data.tx.forEach(t=>{
      if(t.ownerId)return;
      if(/^t[1-6]$/.test(t.id))t.ownerId=t.id==='t4'?'u_cliente':'u_pro';
      else if(/^Pagamento recebido|^Taxa de servi/i.test(t.label||''))t.ownerId='u_pro';
      else if(/^Pagamento(?! recebido)/i.test(t.label||''))t.ownerId='u_cliente';
      else if(/^Dep|^Saque para chave PIX|^Taxa de saque/i.test(t.label||''))t.ownerId=this.data.session||'';
      if(t.ownerId)changed=true;
    });
    this.data.notifs.forEach(n=>{
      if(n.userId||n.for)return;
      const order=n.orderId&&this.data.orders.find(o=>o.id===n.orderId);
      n.userId=order?order.clientId:this.data.session||'';
      if(n.userId)changed=true;
    });
    base.pros.filter(p=>/^pro\d+$/.test(p.id)).forEach(template=>{
      const existing=this.data.pros.find(p=>p.id===template.id);
      if(!existing){this.data.pros.push(template);changed=true;return;}
      const service=svc(existing.service);
      if(Number(existing.price)<service.min||Number(existing.price)>service.max){existing.price=template.price;changed=true;}
    });
    if(changed)this.save();
    return this.data;
  },
  save(){try{localStorage.setItem(KEY,JSON.stringify(this.data));}catch(e){}},
  reset(){try{localStorage.removeItem(KEY);}catch(e){}this.data=seed();this.save();}
};

