/* ---------- SERVIÇOS ---------- */
function pageServicos(){
  if(route.sub)return pageServicoDetalhe(route.sub);
  const cats=['Todos'].concat(Array.from(new Set(SERVICES.map(s=>s.cat))));
  return '<section class="section"><div class="wrap">'+
  '<div class="sec-head"><span class="eyebrow">'+ic('grid')+' Catálogo</span><h2>Todos os serviços TaskGO</h2>'+
  '<p>Escolha uma categoria e receba em segundos a estimativa de preço e os profissionais disponíveis perto de você.</p></div>'+
  '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:26px" id="catBar">'+
    cats.map((c,i)=>'<button class="pill '+(i===0?'pill-brand':'')+'" data-cat="'+c+'" onclick="filterCat(this)">'+c+'</button>').join('')+'</div>'+
  '<div class="grid g4" id="svcGrid">'+SERVICES.map(s=>'<div data-cat="'+s.cat+'">'+svcCard(s)+'</div>').join('')+'</div>'+
  '</div></section>';
}
function filterCat(btn){
  const c=btn.dataset.cat;
  $$('#catBar .pill').forEach(b=>b.classList.toggle('pill-brand',b===btn));
  $$('#svcGrid > div').forEach(d=>{d.style.display=(c==='Todos'||d.dataset.cat===c)?'':'none';});
}
function pageServicoDetalhe(id){
  const s=svc(id),pros=S.pros.filter(p=>p.service===id).slice(0,4);
  return '<section class="section"><div class="wrap">'+
  '<a href="#/servicos" class="pill" style="margin-bottom:20px">'+ic('arrowLeft')+' Todos os serviços</a>'+
  '<div class="split" style="align-items:flex-start">'+
  '<div><div class="ico-box" style="width:60px;height:60px;border-radius:18px">'+ic(s.ico)+'</div>'+
  '<h2 style="margin:18px 0 12px">'+s.n+'</h2><p class="t2">'+s.d+'</p>'+
  '<div style="display:flex;gap:10px;flex-wrap:wrap;margin:22px 0">'+
    '<span class="pill">'+ic('wallet')+' R$ '+s.min+' – R$ '+s.max+' por '+s.unit+'</span>'+
    '<span class="pill">'+ic('shield')+' Garantia 90 dias</span>'+
    '<span class="pill">'+ic('clock')+' Resposta em ~12 min</span></div>'+
  '<h3 style="margin:28px 0 12px">O que está incluso</h3>'+
  '<ul class="list-check" style="margin-top:0">'+[
    'Visita técnica e diagnóstico do problema',
    'Mão de obra especializada com profissional verificado',
    'Orçamento aprovado por você antes da execução',
    'Garantia TaskGO de 90 dias sobre o serviço',
    'Nota fiscal e comprovante digital no app'
  ].map(t=>'<li>'+ic('checkCircle')+'<span>'+t+'</span></li>').join('')+'</ul>'+
  '<a class="btn btn-grad btn-lg" style="margin-top:28px" href="#/contratar?servico='+s.id+'">Contratar '+s.n+' '+ic('arrow')+'</a></div>'+
  '<div class="card"><h3 style="margin-bottom:6px">Profissionais disponíveis</h3><p class="muted" style="font-size:.86rem;margin-bottom:18px">Perto de você agora</p>'+
  (pros.length?pros.map(p=>proRow(p)).join(''):'<p class="muted">Nenhum profissional listado nesta categoria no momento. Faça um pedido e enviaremos para nossa rede.</p>')+
  '</div></div></div></section>';
}
function proRow(p,sel,quotedPrice){
  const unit=svc(p.service).unit;
  const price=quotedPrice==null?p.price:quotedPrice;
  const priceLabel=quotedPrice==null?'a partir de':'para este pedido';
  return '<div class="pro '+(sel?'sel':'')+'">'+avatar({name:p.name},46)+
  '<div style="flex:1;min-width:0"><b style="display:block;font-size:.95rem">'+esc(p.name)+' '+(p.verified?'<span class="tag tag-info" style="margin-left:4px">Verificado</span>':'')+'</b>'+
  '<span class="muted" style="font-size:.8rem">'+stars(p.rating)+' '+p.rating.toFixed(1)+' · '+p.reviews+' avaliações</span>'+
  '<div style="display:flex;gap:10px;margin-top:6px;flex-wrap:wrap"><span class="tag tag-muted">'+ic('mapPin')+' '+p.dist+' km</span><span class="tag tag-muted">'+ic('clock')+' '+p.eta+' min</span></div></div>'+
  '<div style="text-align:right"><div class="muted" style="font-size:.68rem">'+priceLabel+'</div><b style="font-size:1rem">R$ '+price+'</b><div class="muted" style="font-size:.74rem">por '+unit+'</div></div></div>';
}

