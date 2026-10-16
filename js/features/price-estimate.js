/* =========================================================
   ESTIMATIVA IA
   ========================================================= */
function estimate(serviceId,urgency,size,radius,quantity){
  const s=svc(serviceId);
  const uf={agora:1.35,hoje:1.15,agendar:1.0}[urgency]||1;
  const sf=serviceId==='cftv'?1:({pequeno:.8,medio:1.1,grande:1.6}[size]||1);
  const rf=1+(Number(radius||5)/100);
  const count=serviceId==='cftv'?Math.max(1,Math.min(16,Number(quantity)||1)):1;
  const base=(s.min+s.max)/2*sf*uf*rf*count;
  const min=Math.round(base*.78/5)*5, max=Math.round(base*1.28/5)*5;
  const availablePros=S.pros.filter(p=>p.service===serviceId&&Number(p.dist)<=Number(radius||5));
  const eta=availablePros.length?Math.round(availablePros.reduce((sum,p)=>sum+Number(p.eta||0),0)/availablePros.length):0;
  return {min,max,avg:Math.round((min+max)/2),unit:s.unit,quantity:count,
    pros:availablePros.length,eta,confidence:rand(88,97),
    factors:[
      ...(serviceId==='cftv'?[['Pontos de câmera',count],['Equipamentos','Cobrados à parte']]:[['Complexidade do serviço',sf>1.2?'Alta':sf<1?'Baixa':'Média']]),
      ['Urgência',{agora:'Imediata (+35%)',hoje:'Ainda hoje (+15%)',agendar:'Agendada (padrão)'}[urgency]||'Padrão'],
      ['Profissionais no raio',radius+' km'],
      ['Preço médio da região','R$ '+Math.round(base)]
    ]};
}

