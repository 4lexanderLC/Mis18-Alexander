/* ===== CONFIGURACIÓN: cambia aquí tus datos ===== */
const CONFIG = {
  celebrant: "Alexander LC",
  parents: ["Angélica Carvajal Rosales", "Carlos Fernando López"],
eventISO: "2027-01-09T15:00:00-06:00",
eventEndISO: "2027-01-09T22:00:00-06:00",
  eventTitle: "18 años de Alexander",
  eventPlace: "Terraza D'Lucy, Tónala ",
  partyTime: "7:00 pm",
  city: "Tónala",
  guest: "Invitado",
  whatsapp: "3314137425",
  photoSrc: "assets/foto.jpg",
  audioSrc: "assets/cancion.mp3",
};

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const toast = m => { const t=$('#toast'); t.textContent=m; t.classList.add('on'); clearTimeout(toast.t); toast.t=setTimeout(()=>t.classList.remove('on'),2200); };
const copy = async (text,msg='Copiado') => {
  try{ await navigator.clipboard.writeText(text); toast(msg); }
  catch(e){ const ta=document.createElement('textarea'); ta.value=text; document.body.appendChild(ta); ta.select(); try{document.execCommand('copy'); toast(msg);}catch(_){toast('No se pudo copiar');} ta.remove(); }
};

document.body.classList.add('locked');
const invitation = $('#invitation');
invitation.inert = true;
invitation.hidden = true;

/* Apertura */
const cover = $('#cover');
function openInv(){
  if(cover.dataset.opened) return;
  cover.dataset.opened='true';
  cover.classList.add('opening');
  $('#openBtn').setAttribute('aria-disabled','true');
  $('#tagBtn').setAttribute('aria-disabled','true');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  setTimeout(()=>{
    invitation.hidden=false;
    invitation.inert=false;
    cover.classList.add('out');
    document.body.classList.remove('locked');
    window.scrollTo(0,0);
    invitation.focus({preventScroll:true});
    setupReveal();
    setTimeout(()=>cover.remove(),reduced ? 0 : 850);
  },reduced ? 0 : 1500);
}
['#openBtn','#tagBtn'].forEach(s=>{ const el=$(s);
  el.addEventListener('click',openInv);
  el.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' '){e.preventDefault();openInv();} });
});

/* Fecha en formato 22.02.2027 */
const D = new Date(CONFIG.eventISO);
const pad = n => String(n).padStart(2,'0');
const mx = new Intl.DateTimeFormat('es-MX',{timeZone:'America/Mexico_City',day:'2-digit',month:'2-digit',year:'numeric'}).formatToParts(D);
const g = t => mx.find(p=>p.type===t).value;
$$('[data-date]').forEach(e=>e.textContent=`${g('day')}.${g('month')}.${g('year')}`);

/* Datos editables y fotografía con alternativa sin imagen rota */
const firstName = CONFIG.celebrant.split(' ')[0];
$$('[data-city]').forEach(el=>el.textContent=CONFIG.city);
document.title = `Mis 18 años ${firstName}`;
$$('[data-first-name]').forEach(el=>el.textContent=firstName);
$$('[data-celebrant]').forEach(el=>el.textContent=CONFIG.celebrant);
$('#parents').replaceChildren(...CONFIG.parents.map(name=>{const el=document.createElement('div');el.textContent=name;return el;}));
$('#partyPlace').textContent=CONFIG.eventPlace;
$('#partyTime').textContent=CONFIG.partyTime;
$('#partyMap').href='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(CONFIG.eventPlace);
const photo=$('#heroPhoto');
photo.alt=CONFIG.celebrant;
photo.addEventListener('load',()=>{photo.hidden=false;});
photo.addEventListener('error',()=>{photo.hidden=true;});
if(CONFIG.photoSrc) photo.src=CONFIG.photoSrc;
/* Invitado */
const guestName = $('#guestName');
if (guestName) guestName.textContent = CONFIG.guest;
$('#fName').value = CONFIG.guest;

/* Formas orgánicas (nubes) */
function blob(path){
  const cx=150, cy=75, rx=142, ry=66, n=22, a=.065, pts=[];
  for(let i=0;i<=240;i++){ const t=i/240*Math.PI*2, r=1+a*Math.sin(n*t);
    pts.push((cx+rx*r*Math.cos(t)).toFixed(1)+' '+(cy+ry*r*Math.sin(t)).toFixed(1)); }
  path.setAttribute('d','M'+pts.join('L')+'Z');
}
$$('.bshape path').forEach(blob);

/* Reveal al hacer scroll */
function setupReveal(){
  if(matchMedia('(prefers-reduced-motion: reduce)').matches||!('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.remove('pre'); io.unobserve(e.target);} }),{threshold:.12});
  $$('.rv').forEach(el=>{ if(el.getBoundingClientRect().top>innerHeight*.9){ el.classList.add('pre'); io.observe(el);} });
}

/* Cuenta regresiva */
function tick(){
  let s = Math.max(0, Math.floor((D-Date.now())/1000));
  const d=Math.floor(s/86400), h=Math.floor(s%86400/3600), m=Math.floor(s%3600/60);
  $('#cdD').textContent=d; $('#cdH').textContent=h; $('#cdM').textContent=m;
}
tick(); setInterval(tick,15000);

/* Calendario */
const fmtUTC = d => d.toISOString().replace(/[-:]/g,'').replace(/\.\d+Z/,'Z');
const E = new Date(CONFIG.eventEndISO);
$('#calLink').href = 'https://calendar.google.com/calendar/render?action=TEMPLATE'
  +'&text='+encodeURIComponent(CONFIG.eventTitle)
  +'&dates='+fmtUTC(D)+'/'+fmtUTC(E)
  +'&location='+encodeURIComponent(CONFIG.eventPlace)
  +'&details='+encodeURIComponent(`Fiesta: ${CONFIG.partyTime}.`);
const escapeICS = value => String(value).replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');
$('#icsBtn').addEventListener('click',()=>{
  const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//18//ES','CALSCALE:GREGORIAN','BEGIN:VEVENT',
    'UID:18-'+D.getTime()+'@invitacion','DTSTAMP:'+fmtUTC(new Date()),'DTSTART:'+fmtUTC(D),'DTEND:'+fmtUTC(E),
    'SUMMARY:'+escapeICS(CONFIG.eventTitle),'LOCATION:'+escapeICS(CONFIG.eventPlace),'END:VEVENT','END:VCALENDAR'];
  const url=URL.createObjectURL(new Blob([lines.join('\r\n')+'\r\n'],{type:'text/calendar;charset=utf-8'}));
  const link=document.createElement('a');link.href=url;link.download='Alexander-18.ics';document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
});

/* Modales */
let lastFocus=null;
function openModal(id){ lastFocus=document.activeElement; const m=$('#'+id); m.classList.add('open'); (m.querySelector('input,button.x'))?.focus(); }
function closeModals(){ stopCarousel(); $('#galleryVideo').pause(); $$('.modal.open').forEach(m=>m.classList.remove('open')); lastFocus?.focus(); }
$$('[data-open]').forEach(b=>b.addEventListener('click',()=>openModal(b.dataset.open)));
$$('[data-close]').forEach(b=>b.addEventListener('click',closeModals));
$$('.modal').forEach(m=>m.addEventListener('click',e=>{ if(e.target===m) closeModals(); }));
addEventListener('keydown',e=>{ if(e.key==='Escape') closeModals(); });

/* RSVP */
const attEls = $$('input[name=att]');
let rsvpText='';
$('#rsvpForm').addEventListener('submit',e=>{
  e.preventDefault();
  const name=$('#fName').value.trim()||CONFIG.guest, yes=attEls.find(x=>x.checked).value==='si', msg=$('#fMsg').value.trim();
  rsvpText = `Hola, soy ${name}. ` + (yes ? `Confirmo mi asistencia a la fiesta de 18 años de ${CONFIG.celebrant}.` : `Lamentablemente no podré asistir a la fiesta de 18 años de ${CONFIG.celebrant}.`) + (msg?` Mensaje: ${msg}`:'');
  $('#rsvpForm').hidden=true; $('#rsvpDone').hidden=false;
  $('#doneTxt').textContent = yes ? '¡Gracias! Ya casi está listo' : 'Gracias por avisarnos';
  $('#doneMsg').textContent = rsvpText;
  const wa=$('#waLink'); if(CONFIG.whatsapp){ wa.hidden=false; wa.href='https://wa.me/'+CONFIG.whatsapp+'?text='+encodeURIComponent(rsvpText); }
});
$('#copyMsg').addEventListener('click',()=>copy(rsvpText,'Mensaje copiado'));

/* Reproductor: usa tu mp3 si lo pones en CONFIG.audioSrc, si no una melodía de ejemplo */
const P = (()=>{
  const fill=$('#barFill'), dot=$('#barDot'), ip=$('#icoPlay'), ia=$('#icoPause');
  let playing=false, audioFailed=false, audio=null, ctx=null, loopStart=0, nextLoop=0, ticker=null;
  const notes=[261.63,329.63,392,329.63,440,392,329.63,293.66, 261.63,329.63,392,523.25,440,392,349.23,329.63, 293.66,349.23,440,349.23,392,329.63,293.66,261.63, 220,261.63,329.63,293.66,261.63,246.94,261.63,196];
  const STEP=.9, TOTAL=notes.length*STEP;
  const ui=()=>{ ip.style.display=playing?'none':''; ia.style.display=playing?'':'none'; $('#play').setAttribute('aria-label',playing?'Pausar':'Reproducir'); };
  const prog=f=>{ f=Math.min(1,Math.max(0,f||0)); fill.style.width=f*100+'%'; dot.style.left=f*100+'%'; };
  function sched(t0){
    notes.forEach((f,i)=>{ const t=t0+i*STEP;
      [[f,.09],[f*2,.025]].forEach(([fr,v])=>{ const o=ctx.createOscillator(), gn=ctx.createGain(); o.type='triangle'; o.frequency.value=fr;
        gn.gain.setValueAtTime(0,t); gn.gain.linearRampToValueAtTime(v,t+.03); gn.gain.exponentialRampToValueAtTime(.0005,t+STEP*1.9);
        o.connect(gn).connect(ctx.destination); o.start(t); o.stop(t+STEP*2); });
    });
  }
  function startSynth(){
    ctx=new (window.AudioContext||window.webkitAudioContext)(); loopStart=ctx.currentTime+.1; sched(loopStart); nextLoop=loopStart+TOTAL;
  }
  function loop(){
    if(audio){ prog(audio.currentTime/(audio.duration||1)); return; }
    if(!ctx) return;
    if(ctx.currentTime>nextLoop-3){ sched(nextLoop); loopStart=nextLoop; nextLoop+=TOTAL; }
    prog(((ctx.currentTime-loopStart)%TOTAL)/TOTAL);
  }
  async function play(){
    try{
      if(CONFIG.audioSrc && !audioFailed){
        audio=audio||Object.assign(new Audio(CONFIG.audioSrc),{loop:true});
        try{await audio.play();}catch(error){
          if(error.name==='NotAllowedError') throw error;
          audio.pause();audio=null;audioFailed=true;
          if(!ctx) startSynth(); else await ctx.resume();
        }
      }
      else { if(!ctx) startSynth(); else await ctx.resume(); }
      playing=true; ui(); clearInterval(ticker); ticker=setInterval(loop,200);
    }catch(e){ toast('No se pudo reproducir el audio'); }
  }
  function pause(){ clearInterval(ticker); playing=false; ui(); if(audio) audio.pause(); else if(ctx) ctx.suspend(); }
  function restart(){
    if(audio){ audio.currentTime=0; return; }
    if(ctx){ ctx.close(); ctx=null; if(playing) startSynth(); else prog(0); }
  }
  $('#play').addEventListener('click',()=>playing?pause():play());
  $('#prev').addEventListener('click',restart);
  $('#next').addEventListener('click',()=>{ if(audio){ audio.currentTime=Math.min((audio.duration||0),audio.currentTime+15);} else restart(); });
  $('#bar').addEventListener('click',e=>{ if(audio&&audio.duration){ const r=$('#bar').getBoundingClientRect(); audio.currentTime=audio.duration*(e.clientX-r.left)/r.width; } });
  return {pause};
})();


/* Galería automática: assets/galeria.js lo genera actualizar-fotos.py. */
const galleryPage = $('#galleryPage');
let galleryPhotos = [], photoIndex = 0, galleryScroll = 0;
let carouselTimer=null, carouselPlaying=false;
function watchGalleryVideo(){
  if(carouselPlaying && galleryPhotos.length>1 && !document.hidden && !$('#galleryVideo').hidden){
    clearTimeout(carouselTimer);
    carouselTimer=setTimeout(()=>movePhoto(1),15000);
  }
}
function playGalleryVideo(){
  const video=$('#galleryVideo');
  if(video.hidden || !carouselPlaying || document.hidden)return;
  watchGalleryVideo();
  // Sin sonido permite reproducción automática también en móviles.
  video.muted=true;
  video.play().catch(()=>{if(!video.hidden)watchGalleryVideo();});
}
function stopCarousel(){clearTimeout(carouselTimer);carouselTimer=null;carouselPlaying=false;updateCarouselButton();}
function updateCarouselButton(){
  $('#carouselToggle').textContent=carouselPlaying?'Pausar':'Continuar';
  $('#carouselToggle').setAttribute('aria-pressed',String(carouselPlaying));
}
function scheduleCarousel(){
  if(carouselPlaying && galleryPhotos.length>1 && !document.hidden && !$('#galleryFull').hidden){
    clearTimeout(carouselTimer);
    carouselTimer=setTimeout(()=>movePhoto(1),500);
  }
}
function startGalleryCarousel(index=0){
  if(!galleryPhotos.length)return;
  photoIndex=index;carouselPlaying=true;updateCarouselButton();
  openModal('photoModal');showGalleryPhoto();
}
function renderGallery(){
  galleryPhotos = Array.isArray(window.GALLERY_PHOTOS) ? window.GALLERY_PHOTOS.map(item=>({...item,type:item.type==='video'||/\.mp4(?:[?#]|$)/i.test(item.src)?'video':'image'})) : [];
  $('#galleryGrid').replaceChildren();
  $('#galleryEmpty').hidden = galleryPhotos.length > 0;
  galleryPhotos.forEach((photo,index)=>{
    const button=document.createElement('button');
    button.type='button';button.className='gallery-tile';
    button.setAttribute('aria-label',`Abrir ${photo.type==='video'?'video':'foto'} ${index+1}: ${photo.alt}`);
    const img=document.createElement(photo.type==='video'&&!photo.poster?'video':'img');
    if(photo.type==='video'){
      if(photo.poster){img.alt=photo.alt;img.loading='lazy';img.decoding='async';}
      else{img.preload='metadata';img.muted=true;img.playsInline=true;}
      const badge=document.createElement('span');badge.className='gallery-video-badge';badge.textContent='▶ Video';button.append(badge);
    }else{img.alt=photo.alt;img.loading='lazy';img.decoding='async';}
    img.src=photo.poster||photo.thumbnail||photo.src;
    img.addEventListener('error',()=>{
      button.hidden=true;
      if(!$('#galleryGrid').querySelector('.gallery-tile:not([hidden])')) $('#galleryEmpty').hidden=false;
    });
    button.append(img);
    button.addEventListener('click',()=>{startGalleryCarousel(index);});
    $('#galleryGrid').append(button);
  });
}
function showGalleryPhoto(){
  clearTimeout(carouselTimer);
  const photo=galleryPhotos[photoIndex];if(!photo)return;
  const video=$('#galleryVideo'), image=$('#galleryFull'), isVideo=photo.type==='video';
  video.pause();video.removeAttribute('src');video.load();
  video.hidden=!isVideo;image.hidden=isVideo;
  if(isVideo){
    if(photo.poster)video.poster=photo.poster;else video.removeAttribute('poster');
    image.removeAttribute('src');video.src=photo.src;video.muted=false;
    video.setAttribute('aria-label',photo.alt);
    playGalleryVideo();
  }else{image.src=photo.src;image.alt=photo.alt;if(image.complete)scheduleCarousel();}
  $('#photoCount').textContent=`${photoIndex+1} / ${galleryPhotos.length}`;
  $('#photoPrev').disabled=$('#photoNext').disabled=galleryPhotos.length<2;
}
function movePhoto(step){
  if(!galleryPhotos.length)return;
  photoIndex=(photoIndex+step+galleryPhotos.length)%galleryPhotos.length;
  showGalleryPhoto();
}
function openGallery(){
  galleryScroll=window.scrollY;
  invitation.hidden=true;invitation.inert=true;
  galleryPage.hidden=false;galleryPage.inert=false;
  renderGallery();window.scrollTo(0,0);galleryPage.focus({preventScroll:true});
  // Al servir con --serve el catálogo se vuelve a generar al entrar.
  const script=document.createElement('script');
  script.src='assets/galeria.js?t='+Date.now();
  script.onload=()=>{if(!galleryPage.hidden){renderGallery();startGalleryCarousel();}script.remove();};
  script.onerror=()=>{if(!galleryPage.hidden)startGalleryCarousel();script.remove();};document.body.append(script);
}
function backToInvitation(){
  closeModals();galleryPage.hidden=true;galleryPage.inert=true;
  invitation.hidden=false;invitation.inert=false;
  window.scrollTo(0,galleryScroll);
  $('[data-gallery-open]').focus({preventScroll:true});
}
$$('[data-gallery-open]').forEach(button=>button.addEventListener('click',openGallery));
$('#galleryBack').addEventListener('click',backToInvitation);
$('#photoPrev').addEventListener('click',()=>movePhoto(-1));
$('#photoNext').addEventListener('click',()=>movePhoto(1));
addEventListener('keydown',event=>{
  if(!$('#photoModal').classList.contains('open'))return;
  if(event.key==='ArrowLeft'){event.preventDefault();movePhoto(-1);}
  if(event.key==='ArrowRight'){event.preventDefault();movePhoto(1);}
});
let touchStart=null;
$('#galleryFull').addEventListener('touchstart',e=>{if(e.touches.length===1)touchStart={x:e.touches[0].clientX,y:e.touches[0].clientY};},{passive:true});
$('#galleryFull').addEventListener('touchend',e=>{
  if(!touchStart)return;
  const dx=e.changedTouches[0].clientX-touchStart.x,dy=e.changedTouches[0].clientY-touchStart.y;
  if(Math.abs(dx)>60 && Math.abs(dx)>Math.abs(dy))movePhoto(dx<0?1:-1);
  touchStart=null;
},{passive:true});

$('#galleryVideo').addEventListener('play',()=>P.pause());
$('#galleryVideo').addEventListener('timeupdate',watchGalleryVideo);
$('#galleryVideo').addEventListener('waiting',watchGalleryVideo);
$('#galleryVideo').addEventListener('error',watchGalleryVideo);

$('#galleryFull').addEventListener('load',scheduleCarousel);
$('#galleryFull').addEventListener('error',scheduleCarousel);
$('#galleryVideo').addEventListener('ended',()=>{if(carouselPlaying)movePhoto(1);});
$('#carouselToggle').addEventListener('click',()=>{
  if(carouselPlaying){stopCarousel();$('#galleryVideo').pause();}
  else{carouselPlaying=true;updateCarouselButton();if(!$('#galleryVideo').hidden)playGalleryVideo();else scheduleCarousel();}
});
document.addEventListener('visibilitychange',()=>{
  if(document.hidden){clearTimeout(carouselTimer);$('#galleryVideo').pause();}
  else if(!$('#galleryVideo').hidden)playGalleryVideo();else scheduleCarousel();
});
