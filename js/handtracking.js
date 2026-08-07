/* ===================================================================
   Módulo de seguimiento de manos con MediaPipe Hand Landmarker
   Se carga como módulo ES: requiere servidor HTTP y conexión a internet
   la primera vez (descarga el modelo desde CDN)
   Ruta Viva · Turismo Inteligente (G2)
   =================================================================== */

const btn = document.getElementById('btn-camara');
const video = document.getElementById('video');
const lienzo = document.getElementById('lienzo');
const ctx = lienzo.getContext('2d');
let detector = null, corriendo = false, ultimoT = -1;

const CONEX = [[0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[7,8],[5,9],[9,10],[10,11],[11,12],
               [9,13],[13,14],[14,15],[15,16],[13,17],[17,18],[18,19],[19,20],[0,17]];

btn.addEventListener('click', async ()=>{
  if(corriendo){ detener(); return; }
  btn.textContent = 'Cargando modelo…'; btn.disabled = true;
  try{
    const {FilesetResolver, HandLandmarker} = await import('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14');
    const vision = await FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm');
    detector = await HandLandmarker.createFromOptions(vision, {
      baseOptions:{ modelAssetPath:'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task', delegate:'GPU' },
      runningMode:'VIDEO', numHands:1, minHandDetectionConfidence:0.6, minTrackingConfidence:0.6
    });
    const stream = await navigator.mediaDevices.getUserMedia({video:{width:320,height:240}});
    video.srcObject = stream;
    await video.play();
    document.getElementById('sin-camara').style.display='none';
    corriendo = true; btn.disabled=false; btn.textContent='Detener cámara';
    requestAnimationFrame(bucle);
  }catch(err){
    console.error(err);
    btn.disabled=false; btn.textContent='Iniciar cámara';
    document.getElementById('sin-camara').innerHTML =
      'No se pudo iniciar el seguimiento.<br><small>'+(err.message||err)+'</small><br>Usa el <b>simulador de gestos</b> ↓';
  }
});

function detener(){
  corriendo=false;
  video.srcObject?.getTracks().forEach(t=>t.stop());
  video.srcObject=null;
  ctx.clearRect(0,0,lienzo.width,lienzo.height);
  document.getElementById('sin-camara').style.display='grid';
  btn.textContent='Iniciar cámara';
  window.sinMano();
}

function bucle(){
  if(!corriendo) return;
  if(video.currentTime !== ultimoT){
    ultimoT = video.currentTime;
    const res = detector.detectForVideo(video, performance.now());
    ctx.clearRect(0,0,lienzo.width,lienzo.height);
    if(res.landmarks && res.landmarks.length){
      const lm = res.landmarks[0];
      dibujar(lm);
      window.procesarMano(lm);
    } else {
      window.sinMano();
    }
  }
  requestAnimationFrame(bucle);
}

function dibujar(lm){
  const W=lienzo.width, H=lienzo.height;
  ctx.strokeStyle='#F2A03D'; ctx.lineWidth=2.5;
  CONEX.forEach(([a,b])=>{ ctx.beginPath(); ctx.moveTo(lm[a].x*W,lm[a].y*H); ctx.lineTo(lm[b].x*W,lm[b].y*H); ctx.stroke(); });
  ctx.fillStyle='#0E7C86';
  lm.forEach(p=>{ ctx.beginPath(); ctx.arc(p.x*W,p.y*H,3.4,0,7); ctx.fill(); });
}
