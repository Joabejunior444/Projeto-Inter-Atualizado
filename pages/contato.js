/* ---------- CONTATO ---------- */
function pageContato(){
  return '<section class="section"><div class="wrap"><div class="split">'+
  '<div><span class="eyebrow">'+ic('mail')+' Contato</span><h2 style="margin:14px 0">Vamos conversar</h2>'+
  '<p class="t2">Dúvidas, parcerias, imprensa ou suporte: nosso time responde em até 1 dia útil — e em minutos pelo chat.</p>'+
  '<div style="display:flex;flex-direction:column;gap:14px;margin-top:28px">'+
  [['mail','E-mail','contato@taskgo.com.br'],['wa','WhatsApp','(81) 97337-0508'],['clock','Atendimento','Seg a Sex, 8h às 20h · Emergências 24h']]
  .map(c=>'<div style="display:flex;gap:14px;align-items:center"><div class="ico-box" style="width:42px;height:42px">'+ic(c[0])+'</div>'+
  '<div><span class="muted" style="font-size:.78rem;font-weight:700">'+c[1]+'</span><div style="font-size:.95rem;font-weight:600">'+(c[0]==='wa'?'<a href="https://wa.me/5581973370508" target="_blank" rel="noopener noreferrer" style="color:inherit;text-decoration:none">'+c[2]+'</a>':c[2])+'</div></div></div>').join('')+'</div></div>'+
  '<div class="card"><h3 style="margin-bottom:18px">Envie uma mensagem</h3>'+
  '<form onsubmit="enviarContato(event)">'+
  '<div class="field"><label>Nome</label><input class="input" required placeholder="Seu nome completo"></div>'+
  '<div class="field"><label>E-mail</label><input class="input" type="email" required placeholder="voce@email.com"></div>'+
  '<div class="field"><label>Assunto</label><select class="select"><option>Suporte ao cliente</option><option>Quero ser profissional</option><option>Parcerias / Empresas</option><option>Imprensa</option><option>Outro</option></select></div>'+
  '<div class="field"><label>Mensagem</label><textarea class="textarea" required placeholder="Como podemos ajudar?"></textarea></div>'+
  '<button class="btn btn-grad btn-block">Enviar mensagem '+ic('arrow')+'</button></form></div>'+
  '</div></div></section>';
}
function enviarContato(e){e.preventDefault();e.target.reset();toast('Mensagem enviada! Responderemos em breve.','ok');}

