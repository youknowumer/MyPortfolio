/* Core interactions — cursor, scroll, menu, skills tabs, reveal, contact form, hero effects */

/* ══════════ CURSOR — GPU transform, runs only while the pointer is actually moving ══════════ */
(function(){
  const cur = document.getElementById('cur');
  const curR = document.getElementById('cur-r');
  if(!cur || !curR) return;
  /* Touch / coarse pointers: no custom cursor, no per-frame loop at all */
  if(!window.matchMedia('(hover:hover) and (pointer:fine)').matches){
    cur.style.display = 'none'; curR.style.display = 'none';
    document.body.style.cursor = 'auto';
    return;
  }
  cur.style.left = '0'; cur.style.top = '0';
  curR.style.left = '0'; curR.style.top = '0';
  cur.style.opacity = curR.style.opacity = '0';
  let mx=0,my=0,rx=0,ry=0,raf=0,shown=false;
  function frame(){
    cur.style.transform = `translate3d(${mx-5}px,${my-5}px,0)`;
    rx += (mx-rx)*0.2; ry += (my-ry)*0.2;
    curR.style.transform = `translate3d(${rx-20}px,${ry-20}px,0)`;
    raf = (Math.abs(mx-rx) > 0.1 || Math.abs(my-ry) > 0.1) ? requestAnimationFrame(frame) : 0;
  }
  document.addEventListener('mousemove',e=>{
    mx = e.clientX; my = e.clientY;
    if(!shown){ shown = true; rx = mx; ry = my; cur.style.opacity = curR.style.opacity = ''; }
    if(!raf) raf = requestAnimationFrame(frame);
  },{passive:true});
})();

/* ══════════ UNIFIED RAF-THROTTLED SCROLL HANDLER ══════════ */
(function(){
  const header       = document.getElementById('header');
  const scrollTopBtn = document.getElementById('scrollTop');
  const backToTopBtn = document.getElementById('backToTop');
  const readProg     = document.getElementById('readingProgress');
  const heroLeft     = document.querySelector('.hero-left');
  const bodyH        = ()=> document.body.scrollHeight - window.innerHeight;

  let ticking = false;
  function onScroll(){
    if(ticking) return;
    ticking = true;
    requestAnimationFrame(()=>{
      const sy = window.scrollY;

      /* Header */
      if(header) header.classList.toggle('scrolled', sy>50);

      /* Back to top buttons */
      if(scrollTopBtn) scrollTopBtn.classList.toggle('active', sy>300);
      if(backToTopBtn) backToTopBtn.classList.toggle('visible', sy>400);

      /* Reading progress */
      if(readProg){ const bh=bodyH(); readProg.style.width=(bh>0?sy/bh*100:0)+'%'; }

      /* Parallax hero (only while in view) */
      if(heroLeft && sy < window.innerHeight){
        heroLeft.style.transform = `translateY(${sy*0.15}px)`;
        heroLeft.style.opacity   = Math.max(0, 1-(sy*0.0015));
      }

      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  requestAnimationFrame(onScroll);
  /* Active tab highlighting lives in js/tabbar.js */
})();

/* ══════════ MOBILE MENU ══════════ */
document.getElementById('mobBtn').addEventListener('click',()=>{
  document.getElementById('mobMenu').classList.toggle('open');
});
function closeMob(){document.getElementById('mobMenu').classList.remove('open')}

/* ══════════ SKILLS TABS ══════════ */
function showTab(id){
  document.querySelectorAll('.skills-panel').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.skills-tab').forEach(t=>t.classList.remove('active'));
  document.getElementById('tab-'+id).classList.add('active');
  event.target.classList.add('active');
  animateBars();
}

/* ══════════ SKILL BAR ANIMATION ══════════ */
function animateBars(){
  document.querySelectorAll('.skills-panel.active .skill-bar-fill').forEach(bar=>{
    bar.style.width='0';
    setTimeout(()=>{bar.style.width=bar.dataset.w+'%'},100);
  });
}
setTimeout(animateBars,200);

/* ══════════ SCROLL REVEAL ══════════ */
const revealObserver = new IntersectionObserver((entries)=>{
  entries.forEach((entry,i)=>{
    if(entry.isIntersecting){
      setTimeout(()=>{entry.target.classList.add('visible')},Math.min(i,7)*70);
      revealObserver.unobserve(entry.target);
    }
  });
},{threshold:0.1,rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(el=>revealObserver.observe(el));

/* ══════════ SMOOTH NAV SCROLL — with header offset ══════════ */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const href = a.getAttribute('href');
    const t = document.querySelector(href);
    if(t){
      e.preventDefault();
      const headerH = document.getElementById('header')?.offsetHeight || 80;
      const top = t.getBoundingClientRect().top + window.scrollY - headerH - 12;
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    }
  });
});

/* ══════════ CONTACT FORM ══════════ */
function showToast(msg, type){
  const wrap = document.getElementById('toastWrap');
  if(!wrap) return;
  const t = document.createElement('div');
  t.className = 'toast' + (type==='err'?' toast-err':'');
  t.innerHTML = '<div class="toast-icon"><i class="fas fa-'+(type==='err'?'exclamation-circle':'check-circle')+'"></i></div><span>'+msg+'</span>';
  wrap.appendChild(t);
  setTimeout(()=>{ t.classList.add('out'); setTimeout(()=>t.remove(),320); }, 3800);
}

function handleFormSubmit(btn){
  const nameEl    = document.getElementById('cf-name');
  const emailEl   = document.getElementById('cf-email');
  const subjectEl = document.getElementById('cf-subject');
  const msgEl     = document.getElementById('cf-message');
  const name    = nameEl ? nameEl.value.trim() : '';
  const email   = emailEl ? emailEl.value.trim() : '';
  const subject = subjectEl ? subjectEl.value.trim() : '';
  const message = msgEl ? msgEl.value.trim() : '';
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Validate
  let valid = true;
  [nameEl, msgEl].forEach(el => {
    if(el && !el.value.trim()){ el.classList.add('is-invalid'); el.classList.remove('is-valid'); valid=false; }
    else if(el){ el.classList.remove('is-invalid'); el.classList.add('is-valid'); }
  });
  if(!email || !emailRe.test(email)){
    if(emailEl){ emailEl.classList.add('is-invalid'); emailEl.classList.remove('is-valid'); }
    valid=false;
  } else if(emailEl){ emailEl.classList.remove('is-invalid'); emailEl.classList.add('is-valid'); }

  if(!valid){
    showToast('Please fill in all required fields correctly.','err');
    btn.innerHTML='<i class="fas fa-exclamation-circle"></i> Please fill all fields';
    btn.style.background='linear-gradient(135deg,#ef4444,#dc2626)';
    setTimeout(()=>{ btn.innerHTML='<i class="fas fa-paper-plane"></i> Send Message'; btn.style.background=''; },2800);
    return;
  }

  const body = encodeURIComponent('Name: '+name+'\nEmail: '+email+'\n\n'+message);
  const sub  = encodeURIComponent(subject || 'Portfolio Contact from '+name);
  window.open('mailto:umerfaheem632@gmail.com?subject='+sub+'&body='+body, '_self');

  btn.innerHTML='<i class="fas fa-check"></i> Opening Email Client…';
  btn.style.background='linear-gradient(135deg,#A85E22,#D4813A)';
  btn.disabled = true;

  const successEl = document.getElementById('formSuccessMsg');
  if(successEl) successEl.classList.add('show');
  showToast('Email client opened! Click Send to deliver your message.','ok');

  setTimeout(()=>{
    btn.innerHTML='<i class="fas fa-paper-plane"></i> Send Message';
    btn.style.background=''; btn.disabled=false;
    if(successEl) successEl.classList.remove('show');
    [nameEl,emailEl,subjectEl,msgEl].forEach(el=>{ if(el){ el.value=''; el.classList.remove('is-valid','is-invalid'); }});
  }, 5000);
}

/* ══════════ TYPING EFFECT ══════════ */
const roles=['Frontend Developer','BI Enthusiast','ERP Implementer','UI/UX Designer','Data Annotator'];
let ri=0,ci=0,typing=true;
const tagline=document.querySelector('.hero-tagline');
if(tagline){
  function typeRole(){
    const current=roles[ri];
    if(typing){
      if(ci<=current.length){
        tagline.childNodes[tagline.childNodes.length-1].textContent=current.slice(0,ci)+'|';
        ci++;setTimeout(typeRole,80);
      } else{typing=false;setTimeout(typeRole,2000)}
    } else{
      if(ci>0){tagline.childNodes[tagline.childNodes.length-1].textContent=current.slice(0,ci-1)+'|';ci--;setTimeout(typeRole,45)}
      else{typing=true;ri=(ri+1)%roles.length;setTimeout(typeRole,400)}
    }
  }
  setTimeout(typeRole,4200);
}

/* ══════════ AVATAR TILT — rAF throttled, pointer devices only ══════════ */
(function(){
  const avatar=document.querySelector('.hero-avatar-wrap');
  if(!avatar || !window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;
  const bg=avatar.querySelector('.hero-avatar-bg');
  if(!bg) return;
  let raf=0, rx=0, ry=0, rect=null;
  function paint(){ raf=0; bg.style.transform=`perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.04)`; }
  avatar.addEventListener('pointerenter',()=>{ rect=avatar.getBoundingClientRect(); });
  avatar.addEventListener('pointermove',e=>{
    if(!rect) rect=avatar.getBoundingClientRect();
    rx=-(e.clientY-rect.top-rect.height/2)/18;
    ry=(e.clientX-rect.left-rect.width/2)/18;
    if(!raf) raf=requestAnimationFrame(paint);
  },{passive:true});
  avatar.addEventListener('pointerleave',()=>{
    rect=null; bg.style.transform='perspective(600px) rotateX(0) rotateY(0) scale(1)';
  });
})();


/* ══════════ SECTION PROGRESS DOTS ══════════ */
(function(){
  const wrap = document.getElementById('spWrap');
  if(!wrap) return;
  const dots = wrap.querySelectorAll('.sp-dot');
  const ids  = Array.from(dots).map(d=>d.dataset.t);
  dots.forEach(d=>{
    d.addEventListener('click',()=>{
      const el=document.getElementById(d.dataset.t);
      if(el) el.scrollIntoView({behavior:'smooth',block:'start'});
    });
  });
  /* Piggyback on the unified RAF scroll via passive listener — cheap read-only */
  function update(){
    const sy = window.scrollY;
    let active=ids[0];
    ids.forEach(id=>{ const s=document.getElementById(id); if(s&&sy>=s.offsetTop-180) active=id; });
    dots.forEach(d=>d.classList.toggle('on',d.dataset.t===active));
    wrap.classList.toggle('vis', sy>200);
  }
  let spTick=false;
  window.addEventListener('scroll',()=>{
    if(spTick) return; spTick=true;
    requestAnimationFrame(()=>{ spTick=false; update(); });
  },{passive:true});
  update();
})();

/* ══════════ COUNTER ANIMATION ══════════ */
(function(){
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;
      const el=e.target;
      const raw=el.textContent.replace(/[^0-9.]/g,'');
      const num=parseFloat(raw); if(!num) return;
      const suf=el.textContent.replace(/[0-9.]/g,'').trim();
      let cur=0; const dur=1400, step=16;
      const timer=setInterval(()=>{
        cur+=num/(dur/step);
        if(cur>=num){ el.textContent=num+suf; clearInterval(timer); return; }
        el.textContent=(num<10?cur.toFixed(1):Math.floor(cur))+suf;
      },step);
      obs.unobserve(el);
    });
  },{threshold:0.5});
  document.querySelectorAll('.hero-stat-num,.cert-stat-num,.extra-num,.about-stat-mini .num').forEach(el=>obs.observe(el));
})();

/* ══════════ CARD TILT — moved to js/premium.js (single rAF-driven handler; this one fought it) ══════════ */

/* ══════════ SKILL BARS ON INTERSECT ══════════ */
const bObs = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(!e.isIntersecting) return;
    e.target.querySelectorAll('.skill-bar-fill').forEach((b,i)=>{
      setTimeout(()=>{ b.style.width=b.dataset.w+'%'; },i*55);
    });
    bObs.unobserve(e.target);
  });
},{threshold:0.15});
document.querySelectorAll('.skills-panel').forEach(p=>bObs.observe(p));
