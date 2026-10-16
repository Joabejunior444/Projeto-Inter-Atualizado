/* ---------- VERIFICAÇÃO FACIAL ---------- */
let faceCb=null,faceStream=null,faceTimers=[];
const FACE_STEPS=[
  ['Posicione o rosto dentro do círculo','Mantenha o ambiente iluminado',18],
  ['Pisque os olhos devagar','Estamos detectando movimento real',42],
  ['Vire levemente o rosto para a direita','Quase lá',66],
  ['Comparando com o documento enviado','Analisando 128 pontos faciais',88],
  ['Identidade confirmada','',100]
];
function faceScan(titulo,sub,cb){
  faceCb=cb;
  openModal('<div class="modal-head"><div><h3>'+esc(titulo)+'</h3><p>'+esc(sub)+'</p></div>'+
  '<button class="icon-btn" onclick="closeModal()">'+ic('x')+'</button></div>'+
  '<div id="faceBody">'+
    '<div style="position:relative;display:grid;place-items:center">'+
      '<svg class="face-arc" viewBox="0 0 236 236"><circle cx="118" cy="118" r="110" id="faceArc"/></svg>'+
      '<div class="face-ring"><video id="fsVideo" autoplay playsinline muted></video>'+
        '<svg class="ic sil" id="fsSil" viewBox="0 0 24 24">'+I.user+'</svg>'+
        '<div class="scan" id="fsScan" style="display:none"></div></div>'+
    '</div>'+
    '<p class="center" id="fsCamNote" style="font-size:.76rem;color:var(--muted);margin-top:10px;min-height:14px"></p>'+
    '<div class="center" style="margin-top:20px"><b id="fsStep" style="font-size:1rem;display:block">Verificação de identidade</b>'+
    '<span class="muted" id="fsSub" style="font-size:.86rem">Usamos biometria facial para garantir que é você quem está atendendo.</span></div>'+
    '<div class="bar" style="margin:18px 0 6px"><i id="fsBar" style="width:0%"></i></div>'+
    '<button class="btn btn-grad btn-block" id="fsBtn" style="margin-top:14px" onclick="faceStart()">'+ic('camera')+' Iniciar verificação</button>'+
    '<p class="hint center" style="margin-top:10px">Seus dados biométricos não são compartilhados com clientes.</p>'+
  '</div>');
}
function faceCamNote(msg,ok){
  const n=document.getElementById('fsCamNote');
  if(n){n.textContent=msg;n.style.color=ok?'var(--accent)':'var(--muted)';}
}
function faceStart(){
  const btn=$('#fsBtn'); if(btn){btn.disabled=true;btn.innerHTML='Verificando...';}
  const sc=$('#fsScan'); if(sc)sc.style.display='block';
  if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){
    faceCamNote('Este navegador não permite acesso à câmera aqui.',false);
  }else{
    faceCamNote('Solicitando acesso à câmera...',false);
    navigator.mediaDevices.getUserMedia({video:{facingMode:'user'},audio:false}).then(st=>{
      faceStream=st;const v=$('#fsVideo');
      if(v){v.srcObject=st;const pp=v.play&&v.play();if(pp&&pp.catch)pp.catch(()=>{});}
      const s=$('#fsSil');if(s)s.style.display='none';
      faceCamNote('Câmera conectada — imagem ao vivo.',true);
    }).catch(err=>{
      const msg=(err&&err.name==='NotAllowedError')?'Permissão de câmera negada pelo navegador.':
                 (err&&err.name==='NotFoundError')?'Nenhuma câmera encontrada neste dispositivo.':
                 'Não foi possível acessar a câmera neste preview (comum dentro de iframes/artefatos).';
      faceCamNote(msg,false);
    });
  }
  FACE_STEPS.forEach((st,i)=>{
    faceTimers.push(setTimeout(()=>{
      const a=$('#fsStep'),b=$('#fsSub'),bar=$('#fsBar'),arc=$('#faceArc');
      if(a)a.textContent=st[0];
      if(b)b.textContent=st[1];
      if(bar)bar.style.width=st[2]+'%';
      if(arc)arc.style.strokeDashoffset=String(691-691*st[2]/100);
      if(i===FACE_STEPS.length-1)faceSucesso();
    },1200+i*1450));
  });
}
function faceSucesso(){
  stopFace(true);
  const body=$('#faceBody');
  if(body)body.innerHTML='<div class="center" style="padding:10px 0 4px">'+
    '<div class="face-ok">'+ic('check')+'</div>'+
    '<h3 style="margin:18px 0 6px">Identidade confirmada</h3>'+
    '<p class="muted" style="font-size:.9rem;max-width:340px;margin:0 auto">Biometria validada com sucesso. A verificação vale para esta sessão de trabalho.</p>'+
    '<button class="btn btn-grad btn-block" style="margin-top:22px" onclick="faceDone()">Continuar</button></div>';
}
function stopFace(keepModal){
  faceTimers.forEach(t=>clearTimeout(t));faceTimers=[];
  if(faceStream){try{faceStream.getTracks().forEach(t=>t.stop());}catch(e){}faceStream=null;}
  if(!keepModal)faceCb=null;
}
function faceDone(){const cb=faceCb;faceCb=null;closeModal();if(cb)cb();}

