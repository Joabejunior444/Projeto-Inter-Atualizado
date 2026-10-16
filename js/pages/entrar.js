/* =========================================================
   AUTENTICAÇÃO
   ========================================================= */
let A={mode:'login',role:'cliente'};
function pageEntrar(){
  if(route.q.tipo&&!A._init){A.role=route.q.tipo;A.mode='signup';A._init=1;}
  if(me()){go('/painel');return '';}
  const isLogin=A.mode==='login';
  return '<div class="auth-wrap">'+
  '<div class="auth-side"><a href="#/home" class="logo" style="margin-bottom:34px"><span class="lt">Task<b>GO</b></span></a>'+
  '<h2 style="max-width:420px">O profissional certo, no momento certo, com segurança.</h2>'+
  '<ul class="list-check" style="max-width:420px">'+[
    'Estimativa de preço por IA antes de contratar',
    'Rastreio em tempo real do profissional',
    'Código de chegada e pagamento protegido',
    'Carteira com PIX e saque quando quiser'
  ].map(t=>'<li>'+ic('checkCircle')+'<span>'+t+'</span></li>').join('')+'</ul>'+
  '</div>'+
  '<div class="auth-main"><div class="auth-card">'+
  '<h2 style="font-size:1.7rem;margin-bottom:8px">'+(isLogin?'Bem-vindo de volta':'Criar sua conta')+'</h2>'+
  '<p class="muted" style="font-size:.92rem;margin-bottom:24px">'+(isLogin?'Acesse seu painel TaskGO.':'Leva menos de 1 minuto e é grátis.')+'</p>'+
  '<div class="tabs"><button class="'+(isLogin?'active':'')+'" onclick="A.mode=\'login\';render()">Entrar</button>'+
  '<button class="'+(!isLogin?'active':'')+'" onclick="A.mode=\'signup\';render()">Criar conta</button></div>'+
  '<form onsubmit="doAuth(event)">'+
  (!isLogin?'<div class="role-pick">'+
    '<div class="role-opt '+(A.role==='cliente'?'sel':'')+'" onclick="A.role=\'cliente\';render()">'+ic('user')+'<b>Quero contratar</b><span>Sou cliente</span></div>'+
    '<div class="role-opt '+(A.role==='profissional'?'sel':'')+'" onclick="A.role=\'profissional\';render()">'+ic('wrench')+'<b>Quero trabalhar</b><span>Sou profissional</span></div>'+
  '</div>'+
  '<div class="field"><label>Nome completo</label><input class="input" name="name" required placeholder="Como no seu documento"></div>'+
  '<div class="field"><label>CPF</label><input class="input" name="cpf" required placeholder="000.000.000-00" oninput="this.value=maskCPF(this.value)"></div>'+
  '<div class="field"><label>Telefone / WhatsApp</label><input class="input" name="phone" required placeholder="(81) 90000-0000" oninput="this.value=maskPhone(this.value)"></div>'+
  (A.role==='profissional'?'<div class="field"><label>Categoria principal</label><select class="select" name="service">'+SERVICES.map(s=>'<option value="'+s.id+'">'+s.n+'</option>').join('')+'</select></div>':'')
  :'')+
  '<div class="field"><label>E-mail</label><input class="input" type="email" name="email" required placeholder="voce@email.com"></div>'+
  '<div class="field"><label for="auth-pass">Senha</label><div class="password-field"><input class="input" id="auth-pass" type="password" name="pass" required minlength="6" placeholder="Mínimo 6 caracteres"><button class="password-toggle" type="button" aria-label="Mostrar senha" aria-pressed="false" onclick="alternarVisibilidadeSenha(this)">'+ic('eye')+'</button></div></div>'+
  (isLogin?'<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px"><label style="display:flex;gap:8px;align-items:center;font-size:.86rem" class="muted"><input type="checkbox" checked> Lembrar de mim</label><a href="#/ajuda" style="font-size:.86rem;color:var(--brand)">Esqueci a senha</a></div>'
  :'<label style="display:flex;gap:9px;align-items:flex-start;font-size:.84rem;margin-bottom:18px" class="muted"><input type="checkbox" required style="margin-top:3px"> Li e aceito os <a href="#/legal/termos" style="color:var(--brand)">Termos de Uso</a> e a <a href="#/legal/privacidade" style="color:var(--brand)">Política de Privacidade</a>.</label>')+
  '<button class="btn btn-grad btn-block btn-lg">'+(isLogin?'Entrar':'Criar conta')+'</button></form>'+
  '<div style="text-align:center;margin:20px 0;color:var(--muted);font-size:.84rem">ou continue com</div>'+
  '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">'+
  '<button id="btn-google" type="button" class="btn btn-ghost"><svg viewBox="0 0 48 48" aria-hidden="true" focusable="false"><path fill="#4285F4" d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11c-.5 2.5-1.9 4.6-4 6l6.4 5c3.7-3.4 6.2-8.5 6.2-14.7z"/><path fill="#34A853" d="M24 44c5.5 0 10.1-1.8 13.4-4.8l-6.4-5c-1.8 1.2-4.1 2-7 2-5.4 0-10-3.7-11.6-8.7l-6.6 5.1C9.1 39.4 16 44 24 44z"/><path fill="#FBBC05" d="M12.4 27.5a12 12 0 0 1 0-7l-6.6-5.1a20 20 0 0 0 0 17.2z"/><path fill="#EA4335" d="M24 12c3 0 5.7 1 7.8 3l5.8-5.8C34.1 5.8 29.5 4 24 4 16 4 9.1 8.6 5.8 15.4l6.6 5.1C14 15.7 18.6 12 24 12z"/></svg>Google</button>'+
  '<button id="btn-apple" type="button" class="btn btn-ghost"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M18.7 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53-1.71-2.47-3.02-6.99-1.26-10.04.87-1.52 2.43-2.49 4.12-2.51 1.29-.02 2.5.87 3.29.87.78 0 2.26-1.08 3.81-.92.65.03 2.48.26 3.65 1.97-.09.06-2.18 1.28-2.16 3.81.03 3.02 2.65 4.03 2.68 4.04-.02.07-.42 1.44-1.38 2.81zM13.98 3.45c.7-.84 1.87-1.48 2.87-1.45.13 1.17-.34 2.35-1.02 3.2-.69.86-1.83 1.52-2.95 1.43-.15-1.14.41-2.34 1.1-3.18z"/></svg>Apple</button></div>'+
  '</div></div></div>';
}
function demoLogin(kind){
  S.session=kind==='pro'?'u_pro':'u_cliente';Store.save();toast('Login realizado com sucesso!','ok');go('/painel');
}
function alternarVisibilidadeSenha(botao){
  const campo=botao.closest('.password-field')?.querySelector('input[name="pass"]');
  if(!campo)return;
  const mostrar=campo.type==='password';
  campo.type=mostrar?'text':'password';
  botao.setAttribute('aria-pressed',String(mostrar));
  botao.setAttribute('aria-label',mostrar?'Ocultar senha':'Mostrar senha');
  botao.innerHTML=ic(mostrar?'eyeOff':'eye');
}
document.addEventListener('click',e=>{
  const botao=e.target.closest('#btn-google, #btn-apple');
  if(!botao)return;
  e.preventDefault();
  toast(botao.id==='btn-apple'
    ?'O login com a Apple está em desenvolvimento.'
    :'O login com o Google está em desenvolvimento.');
});
function mostrarCadastroConcluido({nome='',aguardar,onConcluir,onErro}={}){
  const reduzir=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const espera=ms=>new Promise(resolve=>setTimeout(resolve,ms));
  const podeTentar=typeof aguardar==='function';
  const primeiroNome=String(nome).trim().split(/\s+/)[0];
  let erroAtual;
  const dlg=document.createElement('dialog');
  dlg.className='tg-success';
  dlg.tabIndex=-1;
  dlg.setAttribute('aria-labelledby','tg-success-title');
  dlg.setAttribute('aria-describedby','tg-success-msg');
  dlg.innerHTML='<svg class="tg-success__mark" viewBox="0 0 64 64" aria-hidden="true">'+
    '<circle class="tg-success__track" cx="32" cy="32" r="30"/>'+
    '<circle class="tg-success__fill" cx="32" cy="32" r="30"/>'+
    '<circle class="tg-success__arc" cx="32" cy="32" r="30"/>'+
    '<path class="tg-success__tick" d="M20 33l8 8 16-18"/>'+
    '<path class="tg-success__bang" d="M32 20v15"/>'+
    '<circle class="tg-success__dot" cx="32" cy="43.5" r="2"/>'+
    '</svg><div class="tg-success__texto" role="status" aria-live="polite">'+
    '<h2 class="tg-success__title" id="tg-success-title"></h2>'+
    '<p class="tg-success__msg" id="tg-success-msg"></p></div>'+
    '<div class="tg-success__actions"><div><div class="tg-success__actions-in">'+
    '<button type="button" class="tg-success__btn tg-success__btn--primary" data-acao="tentar">Tentar novamente</button>'+
    '<button type="button" class="tg-success__btn tg-success__btn--ghost" data-acao="voltar">Voltar ao formulário</button>'+
    '</div></div></div>';
  const texto=$('.tg-success__texto',dlg),titulo=$('.tg-success__title',dlg),msg=$('.tg-success__msg',dlg);
  const acoes=$('.tg-success__actions',dlg),btnTentar=$('[data-acao="tentar"]',dlg),btnVoltar=$('[data-acao="voltar"]',dlg);
  if(!podeTentar){btnTentar.hidden=true;btnVoltar.classList.replace('tg-success__btn--ghost','tg-success__btn--primary');}
  const definir=(estado,t,m)=>{
    dlg.dataset.estado=estado;
    dlg.setAttribute('aria-busy',String(estado==='carregando'));
    texto.setAttribute('aria-live',estado==='erro'?'assertive':'polite');
    acoes.inert=estado!=='erro';
    [[titulo,t],[msg,m]].forEach(([el,valor])=>{
      el.textContent=valor;
      if(!reduzir&&typeof el.animate==='function')el.animate(
        [{opacity:0,transform:'translateY(4px)'},{opacity:1,transform:'none'}],
        {duration:220,easing:'ease-out'});
    });
  };
  const textoDoErro=erro=>erro instanceof TypeError
    ?'Sem conexão com o servidor. Verifique sua internet e tente de novo.'
    :(erro&&erro.message)||'Não foi possível concluir o cadastro. Tente novamente.';
  const remover=()=>{if(dlg.open)dlg.close();dlg.remove();};
  async function executar(){
    definir('carregando','Criando sua conta','Estamos finalizando seu cadastro.');
    const [resultado]=await Promise.all([
      Promise.resolve().then(()=>podeTentar?aguardar():aguardar).then(()=>({}),erro=>({erro:erro||new Error()})),
      espera(1600)
    ]);
    if(resultado.erro){
      erroAtual=resultado.erro;
      definir('erro','Não foi possível criar a conta',textoDoErro(resultado.erro));
      requestAnimationFrame(()=> (podeTentar?btnTentar:btnVoltar).focus());
      return;
    }
    definir('pronto','Conta criada',primeiroNome
      ?'Bem-vindo à TaskGO, '+primeiroNome+'. Abrindo seu painel.'
      :'Bem-vindo à TaskGO. Abrindo seu painel.');
    await espera(reduzir?1200:1700);
    dlg.dataset.saindo='';
    await espera(reduzir?0:180);
    remover();
    if(typeof onConcluir==='function')onConcluir();
  }
  btnTentar.addEventListener('click',executar);
  btnVoltar.addEventListener('click',()=>{
    remover();
    requestAnimationFrame(()=>{if(typeof onErro==='function')onErro(erroAtual);});
  });
  dlg.addEventListener('cancel',evento=>{
    evento.preventDefault();
    if(dlg.dataset.estado==='erro')btnVoltar.click();
  });
  document.body.appendChild(dlg);
  dlg.showModal();
  executar();
}
async function doAuth(e){
  e.preventDefault();
  const f=new FormData(e.target),email=(f.get('email')||'').trim().toLowerCase(),pass=f.get('pass');
  if(A.mode==='login'){
    const botao=e.submitter||e.target.querySelector('button[type="submit"]');
    if(botao)botao.disabled=true;
    try{
      const resposta=await fetch('http://localhost:8080/api/auth/login',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({email:email,senha:pass})
      });
      if(!resposta.ok)throw new Error('Credenciais inválidas');

      const usuarioApi=await resposta.json();
      const emailApi=String(usuarioApi.email||email).trim().toLowerCase();
      const role=usuarioApi.tipo==='profissional'?'profissional':'cliente';
      const nome=usuarioApi.nome||emailApi.split('@')[0];
      let usuarioLocal=S.users.find(u=>String(u.email||'').toLowerCase()===emailApi);
      if(!usuarioLocal){
        usuarioLocal={
          id:usuarioApi.id!=null?'db_'+usuarioApi.id:'u_'+uid(),role:role,name:nome,email:emailApi,pass:pass,
          cpf:usuarioApi.cpf||'',phone:usuarioApi.telefone||'',photo:null,city:'Recife, PE',address:'',bio:'',
          balance:0,pending:0,rating:0,since:Date.now(),plan:'free',
          refCode:String(nome).split(' ')[0].toUpperCase()+'-TG'+rand(100,999),referredBy:null,pixKey:emailApi,
          notif:{push:true,email:true,promo:true,sms:false},twofa:false,paymentMethods:[],
          verified:false,jobs:0,acceptRadius:10
        };
        S.users.push(usuarioLocal);
      }
      Object.assign(usuarioLocal,{
        role:role,name:nome,email:emailApi,pass:pass,
        cpf:usuarioApi.cpf||usuarioLocal.cpf||'',phone:usuarioApi.telefone||usuarioLocal.phone||''
      });
      S.session=usuarioLocal.id;Store.save();
      toast('Bem-vindo, '+String(nome).split(' ')[0]+'!','ok');
      return go(route.q.next?'/'+route.q.next:'/painel');
    }catch(erro){
      console.error('Erro no login:',erro);
      toast('E-mail ou senha incorretos','err');
    }finally{
      if(botao)botao.disabled=false;
    }
    return;
  }
  const u={id:'u_'+uid(),role:A.role,name:f.get('name'),email:email,pass:pass,cpf:f.get('cpf'),phone:f.get('phone'),
    photo:null,city:'Recife, PE',address:'',bio:'',balance:0,pending:0,rating:0,since:Date.now(),plan:'free',
    refCode:(String(f.get('name')).split(' ')[0].toUpperCase())+'-TG'+rand(100,999),referredBy:null,pixKey:email,
    notif:{push:true,email:true,promo:true,sms:false},twofa:false,paymentMethods:[],service:f.get('service')||'marido',verified:false,jobs:0,acceptRadius:10};
  const enviarCadastro=continuar=>{
    const usuario={
      nome:u.name,
      cpf:u.cpf,
      telefone:u.phone,
      email:u.email,
      senha:u.pass,
      tipo:A.role
    };
    const criarConta=async()=>{
      const response=await fetch('http://localhost:8080/api/auth/registrar',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(usuario)
      });
      if(!response.ok){
        let dadosErro={};
        try{dadosErro=await response.json();}catch(_){/* resposta sem JSON */}
        if(response.status===409)throw new Error('Este e-mail já está cadastrado.');
        throw new Error(dadosErro.detail||dadosErro.message||'Não foi possível criar a conta no servidor. Tente novamente.');
      }
      return response;
    };
    return mostrarCadastroConcluido({
      nome:u.name,
      aguardar:criarConta,
      onConcluir:continuar,
      onErro:erro=>{
        const campoEmail=e.target.elements.namedItem('email');
        const campoInvalido=e.target.querySelector(':invalid');
        const campoProblema=/e-?mail|cadastrad/i.test((erro&&erro.message)||'')?campoEmail:(campoInvalido||campoEmail);
        if(campoProblema)campoProblema.focus();
      }
    });
  };
  if(u.role==='profissional'){
    u.available=false;u.faceVerified=false;u.lastFace=null;
    return faceScan('Verificação de identidade','Todo profissional passa por biometria facial antes de ativar o perfil.',()=>{
      return enviarCadastro(()=>{
        const service=svc(u.service);
        const np={id:'pro_'+uid(),name:u.name,service:u.service,rating:0,reviews:0,city:u.city,
          price:rand(service.min,service.max),dist:1.2,eta:20,verified:true,jobs:0,since:new Date().getFullYear(),
          bio:'Profissional recém-cadastrado na TaskGO, com identidade verificada.',skills:['Aceita PIX']};
        S.pros.unshift(np);u.proId=np.id;u.faceVerified=true;u.lastFace=Date.now();u.verified=true;u.since=Date.now();
        S.users.push(u);
        notifyUser(u.id,'Conta criada com sucesso!','Seu cadastro profissional foi confirmado e sua conta já está pronta para receber oportunidades.',{kind:'account',type:'account_created'});
        S.session=u.id;Store.save();
        go('/painel/oportunidades');
      });
    });
  }
  return enviarCadastro(()=>{
    u.since=Date.now();
    S.users.push(u);
    notifyUser(u.id,'Conta criada com sucesso!','Seu cadastro foi confirmado. Bem-vindo à TaskGO!',{kind:'account',type:'account_created'});
    S.session=u.id;Store.save();
    go('/painel');
  });
}
function logout(){S.session=null;Store.save();toast('Você saiu da sua conta');go('/home');}

