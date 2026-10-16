/* =========================================================
   PÁGINAS PÚBLICAS
   ========================================================= */
function pageHome(){
  const pop=SERVICES.filter(s=>s.pop).concat(SERVICES.filter(s=>!s.pop)).slice(0,8);
  const heroVideo='<video class="hero-bg-video" autoplay muted loop playsinline preload="metadata" aria-hidden="true"><source src="assets/8853466-hd_1920_1080_24fps.mp4" type="video/mp4"></video>';
  return '<section class="hero"><div class="hero-bg">'+heroVideo+'</div><div class="hero-grid"></div><div class="wrap"><div class="hero-inner">'+
  '<div><span class="pill pill-brand">'+ic('sparkle')+' Estimativa de preço gerada por IA</span>'+
  '<h1>Encontre o <span>profissional certo</span> em segundos.</h1>'+
  '<p class="hero-sub">Eletricistas, diaristas, técnicos de ar-condicionado, encanadores e muito mais. Profissionais verificados perto de você, com preço estimado na hora, rastreio em tempo real e pagamento protegido via PIX.</p>'+
  '<form class="searchbox" onsubmit="heroSearch(event)">'+
    '<div class="field"><label>Tipo de serviço</label>'+
      '<select class="select" id="hSvc">'+SERVICES.map(s=>'<option value="'+s.id+'">'+s.n+'</option>').join('')+'</select></div>'+
    '<div class="field"><label>Raio de proximidade</label>'+
      '<select class="select" id="hRad"><option value="5">Até 5 km</option><option value="10" selected>Até 10 km</option><option value="20">Até 20 km</option><option value="40">Até 40 km</option></select></div>'+
    '<button class="btn btn-grad" type="submit">'+ic('sparkle')+' Gerar estimativa</button>'+
  '</form>'+
  '<div class="trust">'+
    '<div><b>+38 mil</b><span>serviços concluídos</span></div>'+
    '<div><b>4.9/5</b><span>nota média</span></div>'+
    '<div><b>+6.200</b><span>profissionais verificados</span></div>'+
    '<div><b>12 min</b><span>tempo médio de resposta</span></div>'+
  '</div></div>'+
  '<div style="position:relative"></div></div></div></section>'+

  '<div class="marquee"><div class="marquee-track">'+
    Array(2).fill(SERVICES.map(s=>'<span class="marquee-item">'+ic(s.ico)+' '+s.n+'</span>').join('')).join('')+
  '</div></div>'+

  /* SERVIÇOS */
  '<section class="section"><div class="wrap">'+
  '<div class="sec-head center"><span class="eyebrow">'+ic('grid')+' Categorias</span><h2>Serviços que a TaskGO oferece</h2>'+
  '<p>Mais de 14 categorias com profissionais avaliados, orçamento transparente e garantia de 90 dias em todo serviço contratado pelo app.</p></div>'+
  '<div class="grid g4">'+pop.map(s=>svcCard(s)).join('')+'</div>'+
  '<div class="center" style="margin-top:34px"><a class="btn btn-ghost btn-lg" href="#/servicos">Ver todas as categorias '+ic('arrow')+'</a></div>'+
  '</div></section>'+

  /* COMO FUNCIONA */
  '<section class="section" style="background:var(--bg-soft);border-block:1px solid var(--line)"><div class="wrap">'+
  '<div class="sec-head center"><span class="eyebrow">'+ic('route')+' Como funciona</span><h2>Do pedido à conclusão em 4 passos</h2>'+
  '<p>Um fluxo simples, transparente e seguro — pensado para você resolver seu problema sem dor de cabeça.</p></div>'+
  '<div class="steps">'+[
    ['Descreva o serviço','Conte o que você precisa, o tamanho do serviço e a urgência. Leva menos de 1 minuto.'],
    ['Receba a estimativa da IA','Nossa inteligência artificial calcula uma faixa de preço justa com base na sua região e no histórico da plataforma.'],
    ['Escolha o profissional','Compare notas, avaliações reais, distância e preço. Você decide quem entra na sua casa.'],
    ['Acompanhe e pague','Veja o profissional chegando em tempo real, valide o código de segurança e pague via PIX com proteção TaskGO.']
  ].map(s=>'<div class="step"><h3>'+s[0]+'</h3><p>'+s[1]+'</p></div>').join('')+'</div>'+
  '<div class="center" style="margin-top:38px"><a class="btn btn-primary btn-lg" href="#/contratar">Contratar agora '+ic('arrow')+'</a></div>'+
  '</div></section>'+

  /* DIFERENCIAIS */
  '<section class="section"><div class="wrap">'+
  '<div class="sec-head"><span class="eyebrow">'+ic('zap2')+' Tecnologia</span><h2>Muito mais que uma lista de contatos</h2>'+
  '<p>A TaskGO junta inteligência artificial, geolocalização e pagamentos instantâneos numa experiência única.</p></div>'+
  '<div class="grid g3">'+[
    ['sparkle','Estimativa por IA','Preço justo calculado em segundos com base em milhares de serviços já executados na sua região.'],
    ['nav','Rastreio em tempo real','Acompanhe o deslocamento do profissional no mapa, com distância e tempo estimado de chegada.'],
    ['key','Código de chegada','Um código de 4 dígitos confirma que o profissional certo chegou ao local certo. Segurança de verdade.'],
    ['pix','PIX instantâneo','Receba e pague via PIX, acompanhe o saldo e saque quando quiser, direto pela carteira TaskGO.'],
    ['shield','Garantia TaskGO','90 dias de garantia no serviço executado e cobertura em caso de danos comprovados.'],
    ['chat','Chat integrado','Combine detalhes, envie fotos do problema e mantenha tudo registrado dentro do app.']
  ].map(f=>'<div class="card card-hover"><div class="ico-box">'+ic(f[0])+'</div><h3 style="margin:16px 0 8px">'+f[1]+'</h3><p class="muted" style="font-size:.92rem">'+f[2]+'</p></div>').join('')+'</div>'+
  '</div></section>'+

  /* SEGURANÇA SPLIT */
  '<section class="section" style="background:var(--bg-soft);border-block:1px solid var(--line)"><div class="wrap"><div class="split">'+
  '<div><span class="eyebrow">'+ic('shield')+' Segurança</span><h2 style="margin-top:14px">Sua casa, suas regras.<br>Nossa responsabilidade.</h2>'+
  '<p class="muted" style="margin-top:14px">Todo profissional passa por verificação de identidade, checagem de antecedentes e validação de experiência antes de receber o selo TaskGO Verificado.</p>'+
  '<ul class="list-check">'+[
    'Verificação de CPF, documento com foto e selfie biométrica',
    'Código de 4 dígitos validado no momento da chegada',
    'Compartilhamento de rota com contatos de confiança',
    'Botão de emergência com acionamento direto durante o atendimento',
    'Pagamento retido até a confirmação da conclusão do serviço'
  ].map(t=>'<li>'+ic('checkCircle')+'<span>'+t+'</span></li>').join('')+'</ul>'+
  '<a class="btn btn-ghost" style="margin-top:26px" href="#/seguranca">Conheça nossa política '+ic('arrow')+'</a></div>'+
  '<div class="card" style="padding:26px">'+
    '<div style="display:flex;align-items:center;gap:12px;margin-bottom:18px">'+ic('key','')+'<b>Validação de chegada</b></div>'+
    '<p class="muted" style="font-size:.9rem">Informe ao profissional o código exibido no seu app. Sem o código, o serviço não é iniciado.</p>'+
    '<div class="big-code" style="margin:26px 0">7429</div>'+
    '<div class="track-steps">'+['Aceito','A caminho','Chegou','Concluído'].map((s,i)=>'<div class="tstep '+(i<2?'done':i===2?'now':'')+'">'+s+'</div>').join('')+'</div>'+
    '<div style="margin-top:22px;padding:14px;border-radius:14px;background:color-mix(in srgb,var(--accent) 10%,transparent);border:1px solid color-mix(in srgb,var(--accent) 26%,transparent);font-size:.86rem;display:flex;gap:10px">'+ic('shield')+'<span>Serviço coberto pela Garantia TaskGO de 90 dias.</span></div>'+
  '</div></div></div></section>'+

  /* DESAFIOS E PROPOSTA */
  '<section class="section"><div class="wrap">'+
  '<div class="sec-head center"><span class="eyebrow">'+ic('route')+' Desafio × proposta</span><h2>O que queremos melhorar com a TaskGO</h2>'+
  '<p>Como estamos desenvolvendo o MVP e ainda não temos clientes, apresentamos aqui os desafios que queremos resolver e a proposta da TaskGO.</p></div>'+
  '<div class="grid g3">'+[
    ['search','Encontrar um profissional','Buscar por indicação pode deixar informações e opções espalhadas.','Reunir busca por categoria e região, com informações para ajudar na escolha.'],
    ['sparkle','Ter uma referência de preço','Sem uma referência inicial, fica mais difícil planejar o serviço.','Apresentar uma estimativa antes do pedido e permitir combinar o valor com clareza.'],
    ['chat','Acompanhar o atendimento','Pedido, conversa e pagamento podem acabar em canais diferentes.','Organizar as etapas e a comunicação do serviço em um só fluxo.']
  ].map(t=>'<article class="card" style="height:100%"><div style="display:flex;align-items:center;gap:10px;margin-bottom:18px;color:var(--brand)">'+ic(t[0])+'<h3 style="font-size:1.05rem;color:var(--text)">'+t[1]+'</h3></div>'+
    '<div style="margin-bottom:16px"><span class="muted" style="font-size:.76rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase">Desafio</span><p style="font-size:.9rem;color:var(--text-2);margin-top:6px">'+t[2]+'</p></div>'+
    '<div style="padding-top:14px;border-top:1px solid var(--line)"><span style="font-size:.76rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--brand)">Proposta TaskGO</span><p style="font-size:.9rem;color:var(--text-2);margin-top:6px">'+t[3]+'</p></div></article>').join('')+'</div>'+
  '</div></section>'+

  /* PRO CTA */
  '<section class="section" style="padding-top:0"><div class="wrap"><div class="ribbon">'+
  '<span class="pill" style="background:rgba(255,255,255,.18);border-color:rgba(255,255,255,.3);color:#fff">'+ic('award')+' Para profissionais</span>'+
  '<h2 style="margin-top:16px">Ganhe mais trabalhando quando quiser</h2>'+
  '<p>Cadastre-se grátis, receba pedidos na sua região e saque seus ganhos via PIX no mesmo dia. Sem mensalidade no plano inicial.</p>'+
  '<div style="display:flex;gap:12px;justify-content:center;margin-top:26px;flex-wrap:wrap">'+
  '<a class="btn btn-ghost btn-lg" href="#/entrar?tipo=profissional">Quero me cadastrar '+ic('arrow')+'</a>'+
  '<a class="btn btn-lg" style="background:rgba(255,255,255,.16);color:#fff" href="#/profissionais">Simular meus ganhos</a></div>'+
  '</div></div></section>'+

  /* FAQ */
  '<section class="section" style="padding-top:0"><div class="wrap" style="max-width:820px">'+
  '<div class="sec-head center"><span class="eyebrow">'+ic('help')+' Dúvidas</span><h2>Perguntas frequentes</h2></div>'+faqList(FAQ.slice(0,6))+
  '<div class="center" style="margin-top:24px"><a class="btn btn-ghost" href="#/ajuda">Ver central de ajuda completa</a></div>'+
  '</div></section>';
}
function svcCard(s){
  return '<a class="card card-hover svc" href="#/servicos/'+s.id+'"><div class="ico-box">'+ic(s.ico)+'</div>'+
  '<h3>'+s.n+'</h3><p>'+s.d+'</p>'+
  '<div class="price"><span>a partir de <b>R$ '+s.min+'</b></span><span class="tag tag-muted">'+s.cat+'</span></div></a>';
}
function heroSearch(e){
  e.preventDefault();
  const s=$('#hSvc').value,r=$('#hRad').value;
  go('/contratar?servico='+s+'&raio='+r);
}

