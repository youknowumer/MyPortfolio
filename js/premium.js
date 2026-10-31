/* Premium interactions v3 — command palette, tilt, magnetic buttons, clock, shortcuts */

/* ══════════════════════════════════════════════════════════════
   PREMIUM INTERACTIVE ENGINE v3.0
══════════════════════════════════════════════════════════════ */

/* ── 1. SCROLL PROGRESS LINE ── */
(function(){
  const readProg = document.getElementById('scrollProgressLine');

  let ticking = false;
  function onScroll(){
    if(ticking) return;
    requestAnimationFrame(()=>{
      const sy = window.scrollY;

      /* Progress line */
      if(readProg){
        const bh = document.body.scrollHeight - window.innerHeight;
        readProg.style.width = (bh>0 ? (sy/bh*100) : 0)+'%';
      }

      /* Header scrolled */
      const hdr = document.getElementById('header');
      if(hdr) hdr.classList.toggle('scrolled', sy>50);

      /* Back to top */
      const btt = document.getElementById('scrollTop');
      if(btt) btt.classList.toggle('active', sy>300);

      ticking = false;
    });
    ticking = true;
  }

  window.addEventListener('scroll', onScroll, {passive:true});
  requestAnimationFrame(onScroll);
})();

/* ── 2. AI CHAT BUTTON — robust fix ── */
(function(){
  const btn = document.getElementById('aiChatBtn');
  if(!btn) return;
  btn.addEventListener('click', function(e){
    e.preventDefault();
    e.stopPropagation();
    if(typeof toggleAIChat==='function') toggleAIChat();
  });

  /* Keyboard: Shift+A to open AI chat */
  document.addEventListener('keydown',function(e){
    if(e.shiftKey && e.key==='A' && !e.ctrlKey && !e.metaKey){
      const tag = document.activeElement.tagName;
      if(tag==='INPUT'||tag==='TEXTAREA') return;
      if(typeof toggleAIChat==='function') toggleAIChat();
    }
  });

  /* Chat input keyboard handler */
  const chatInput = document.getElementById('chatInput');
  if(chatInput){
    chatInput.addEventListener('keydown',function(e){
      if(e.key==='Enter'&&!e.shiftKey){
        e.preventDefault();
        if(typeof sendChatMsg==='function') sendChatMsg();
      }
    });
    chatInput.addEventListener('input',function(){
      this.style.height='auto';
      this.style.height=Math.min(this.scrollHeight,100)+'px';
    });
  }
})();

/* ── 3. COMMAND PALETTE ── */
(function(){
  const overlay = document.getElementById('cmdOverlay');
  const palette = document.getElementById('cmdPalette');
  const input   = document.getElementById('cmdInput');
  const results = document.getElementById('cmdResults');
  if(!overlay||!palette||!input||!results) return;

  const COMMANDS = [
    { icon:'fa-house',    title:'Home',            sub:'Jump to the top',                    action:()=>scrollTo({top:0,behavior:'smooth'}), badge:'Section' },
    { icon:'fa-user',     title:'About Me',        sub:'Learn who Umer is',                  action:()=>scrollSection('about'),              badge:'Section' },
    { icon:'fa-code',     title:'Skills',          sub:'Technical arsenal & expertise',       action:()=>scrollSection('skills'),             badge:'Section' },
    { icon:'fa-briefcase',title:'Experience',      sub:(window.App&&App.stats?App.stats().roles:4)+' roles · internships & current ERP position',        action:()=>scrollSection('experience'),         badge:'Section' },
    { icon:'fa-graduation-cap',title:'Education',  sub:'UMT BBIS graduate, 2026',                 action:()=>scrollSection('education'),          badge:'Section' },
    { icon:'fa-rocket',   title:'Projects',        sub:'5 key projects incl. ICAISAI capstone',action:()=>scrollSection('projects'),          badge:'Section' },
    { icon:'fa-certificate',title:'Certifications',sub:(window.App&&App.stats?App.stats().certs+' certificates · '+App.stats().providers+' providers':'Google, IBM, Microsoft…'),    action:()=>scrollSection('certifications'),     badge:'Section' },
    { icon:'fa-trophy',   title:'Awards',          sub:'Recognition & achievements',          action:()=>scrollSection('awards'),             badge:'Section' },
    { icon:'fa-file-alt', title:'Documents',       sub:'Preview & download CV / Cover Letter',action:()=>scrollSection('docs'),              badge:'Section' },
    { icon:'fa-envelope', title:'Contact',         sub:'Get in touch with Umer',              action:()=>scrollSection('contact'),            badge:'Section' },
    { icon:'fa-wand-magic-sparkles',title:'Open AI Chat',sub:'Ask Umer\'s AI assistant anything',action:()=>{ closeCmd(); if(typeof toggleAIChat==='function') toggleAIChat(); }, badge:'Action' },
    { icon:'fa-download', title:'Download CV',     sub:'Get the latest resume PDF',           action:()=>{ closeCmd(); document.querySelector('#cvDownloadLink')&&document.querySelector('#cvDownloadLink').click(); }, badge:'Action' },
    { icon:'fa-linkedin', title:'LinkedIn',        sub:'linkedin.com/in/youknowumer',         action:()=>window.open('https://linkedin.com/in/youknowumer','_blank'), badge:'Link' },
    { icon:'fa-github',   title:'GitHub',          sub:'github.com/youknowumer',              action:()=>window.open('https://github.com/youknowumer','_blank'),    badge:'Link' },
    { icon:'fa-whatsapp', title:'WhatsApp',        sub:'+92 325 8148564',                     action:()=>window.open('https://wa.me/923258148564','_blank'),          badge:'Link' },
    { icon:'fa-envelope', title:'Send Email',      sub:'umerfaheem632@gmail.com',             action:()=>window.open('mailto:umerfaheem632@gmail.com'),              badge:'Action' },
  ];

  function scrollSection(id){ closeCmd(); const el=document.getElementById(id); if(el) el.scrollIntoView({behavior:'smooth',block:'start'}); }

  let sel=0, filtered=COMMANDS;

  function render(list){
    filtered=list;
    sel=0;
    results.innerHTML='';
    if(!list.length){ results.innerHTML='<div style="padding:1.5rem;text-align:center;color:var(--muted);font-size:.85rem;font-family:Sora,sans-serif">No results found</div>'; return; }
    list.forEach((cmd,i)=>{
      const div=document.createElement('div');
      div.className='cmd-result'+(i===0?' sel':'');
      div.innerHTML=`<div class="cmd-result-icon"><i class="fas ${cmd.icon}"></i></div><div style="flex:1;min-width:0"><span class="cmd-result-title">${cmd.title}</span><span class="cmd-result-sub">${cmd.sub}</span></div><span class="cmd-result-badge">${cmd.badge}</span>`;
      div.addEventListener('click',()=>{ cmd.action(); closeCmd(); });
      div.addEventListener('mouseenter',()=>{ sel=i; updateSel(); });
      results.appendChild(div);
    });
  }

  function updateSel(){
    results.querySelectorAll('.cmd-result').forEach((el,i)=>el.classList.toggle('sel',i===sel));
    const selEl=results.querySelector('.cmd-result.sel');
    if(selEl) selEl.scrollIntoView({block:'nearest'});
  }

  function openCmd(){
    overlay.classList.add('vis');
    palette.classList.add('vis');
    input.value='';
    render(COMMANDS);
    setTimeout(()=>input.focus(),80);
    document.body.style.overflow='hidden';
  }

  function closeCmd(){
    overlay.classList.remove('vis');
    palette.classList.remove('vis');
    document.body.style.overflow='';
  }

  window.openCmd = openCmd;
  window.closeCmd = closeCmd;

  input.addEventListener('input',function(){
    const q=this.value.toLowerCase().trim();
    render(q?COMMANDS.filter(c=>c.title.toLowerCase().includes(q)||c.sub.toLowerCase().includes(q)):COMMANDS);
  });

  input.addEventListener('keydown',function(e){
    if(e.key==='ArrowDown'){ e.preventDefault(); sel=Math.min(sel+1,filtered.length-1); updateSel(); }
    if(e.key==='ArrowUp'){   e.preventDefault(); sel=Math.max(sel-1,0); updateSel(); }
    if(e.key==='Enter'&&filtered[sel]){ filtered[sel].action(); closeCmd(); }
    if(e.key==='Escape') closeCmd();
  });

  document.addEventListener('keydown',function(e){
    if((e.ctrlKey||e.metaKey)&&e.key==='k'){ e.preventDefault(); openCmd(); }
    if(e.key==='Escape'&&palette.classList.contains('vis')) closeCmd();
  });
})();

/* ── 4. CURSOR SPARKLE TRAIL — removed: js/effects.js already runs a pooled trail + canvas sparkles.
      A third DOM-creating trail on every mousemove only added jank. ── */

/* ── 5. MAGNETIC BUTTONS — rAF-throttled; the spring return lives in CSS (.is-magnet) ── */
(function(){
  if(!window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;
  if(window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  document.querySelectorAll('.btn-pri,.btn-sec,.nav-cta,.nav-ai-btn').forEach(function(btn){
    var raf=0, tx=0, ty=0, r=null;
    function paint(){ raf=0; btn.style.transform='translate3d('+tx+'px,'+ty+'px,0)'; }
    btn.addEventListener('pointerenter',function(){ r=btn.getBoundingClientRect(); btn.classList.add('is-magnet'); });
    btn.addEventListener('pointermove',function(e){
      if(!r) r=btn.getBoundingClientRect();
      tx=(e.clientX-r.left-r.width/2)*0.22;
      ty=(e.clientY-r.top-r.height/2)*0.22;
      if(!raf) raf=requestAnimationFrame(paint);
    },{passive:true});
    btn.addEventListener('pointerleave',function(){
      r=null; btn.classList.remove('is-magnet'); btn.style.transform='';
    });
  });
})();

/* ── 6. LIQUID CARD TILT + MOVING SPECULAR ──
   One rAF-throttled handler per card. It only writes CSS variables (--mx --my --rx --ry);
   all visuals (tilt, light, shadow) live in css/liquid-glass.css. No inline transform/box-shadow
   strings, no duplicate handlers, no extra DOM nodes. ── */
(function(){
  if(!window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;
  var calm = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  var TILT = '.cert-card,.edu-card,.proj-card,.award-card,.extra-card,.tool-card,.glass-card';
  var LIGHT = '.exp-card,.about-highlight,.info-item,.skill-pill,.hero-floating-card,.cert-stat,.trait';
  var epoch = 0;
  window.addEventListener('scroll',function(){ epoch++; },{passive:true});

  function bind(card, tilt){
    var raf=0, px=.5, py=.5, rect=null, rectEpoch=-1;
    if(tilt) card.classList.add('tilt-card');
    function measure(){ rect=card.getBoundingClientRect(); rectEpoch=epoch; }
    function paint(){
      raf=0;
      card.style.setProperty('--mx',(px*100).toFixed(1)+'%');
      card.style.setProperty('--my',(py*100).toFixed(1)+'%');
      if(tilt && !calm){
        card.style.setProperty('--rx',((.5-py)*8).toFixed(2)+'deg');
        card.style.setProperty('--ry',((px-.5)*8).toFixed(2)+'deg');
      }
    }
    card.addEventListener('pointerenter',function(){
      measure(); card.classList.add('is-lit');
      if(tilt && !calm) card.classList.add('is-tilting');
    });
    card.addEventListener('pointermove',function(e){
      if(!rect || rectEpoch!==epoch) measure();
      px=Math.min(1,Math.max(0,(e.clientX-rect.left)/rect.width));
      py=Math.min(1,Math.max(0,(e.clientY-rect.top)/rect.height));
      if(!raf) raf=requestAnimationFrame(paint);
    },{passive:true});
    card.addEventListener('pointerleave',function(){
      rect=null; card.classList.remove('is-lit','is-tilting');
      card.style.removeProperty('--rx'); card.style.removeProperty('--ry');
    });
  }
  document.querySelectorAll(TILT).forEach(function(c){ bind(c,true); });
  document.querySelectorAll(LIGHT).forEach(function(c){ if(!c.matches(TILT)) bind(c,false); });
})();

/* ── 7. REVEAL v3 — smooth scroll entries with stagger ── */
(function(){
  const obs = new IntersectionObserver(entries=>{
    entries.forEach((e,i)=>{
      if(!e.isIntersecting) return;
      const delay = (e.target.dataset.delay||0);
      setTimeout(()=>{ e.target.classList.add('in'); }, parseInt(delay));
      obs.unobserve(e.target);
    });
  },{threshold:0.1,rootMargin:'0px 0px -40px 0px'});

  /* Apply staggered delays to grids */
  document.querySelectorAll('.cert-grid .cert-card,.proj-grid .proj-card,.skills-grid .skill-pill,.awards-grid .award-card,.extra-grid .extra-card,.tool-card').forEach((el,i)=>{
    if(el.classList.contains('reveal')) return;   /* already handled by main.js reveal — avoid double animation */
    el.classList.add('reveal-v3');
    el.dataset.delay = (i%4)*80;
  });

  document.querySelectorAll('.exp-card,.edu-card,.hero-floating-card').forEach((el,i)=>{
    if(el.classList.contains('reveal')) return;
    el.classList.add('reveal-v3');
    el.dataset.delay = i*100;
  });

  document.querySelectorAll('.about-left,.hero-left').forEach(el=>{ if(!el.classList.contains('reveal')) el.classList.add('reveal-v3-left'); });
  document.querySelectorAll('.about-right,.hero-right').forEach(el=>{ if(!el.classList.contains('reveal')) el.classList.add('reveal-v3-right'); });

  document.querySelectorAll('.reveal-v3,.reveal-v3-left,.reveal-v3-right').forEach(el=>obs.observe(el));
})();

/* ── 8. LIVE CLOCK IN NAV ── */
(function(){
  const actions = document.querySelector('.nav-actions');
  if(!actions) return;
  const clock = document.createElement('div');
  clock.id = 'navClock';
  clock.innerHTML = '<i class="fas fa-clock"></i><span id="clockTxt"></span>';
  actions.insertBefore(clock,actions.firstChild);
  function updateClock(){
    const now=new Date();
    const h=now.getHours().toString().padStart(2,'0');
    const m=now.getMinutes().toString().padStart(2,'0');
    const txt=document.getElementById('clockTxt');
    if(txt) txt.textContent=h+':'+m;
  }
  updateClock();
  setInterval(updateClock,1000);
})();

/* ── 9. COPY BUTTONS for contact info ── */
(function(){
  function addCopyBtn(text, label, selector){
    const el = document.querySelector(selector);
    if(!el) return;
    const btn = document.createElement('button');
    btn.className='copy-btn'; btn.type='button';
    btn.innerHTML='<i class="fas fa-copy"></i>'+label;
    btn.addEventListener('click',function(){
      navigator.clipboard&&navigator.clipboard.writeText(text).then(()=>{
        this.innerHTML='<i class="fas fa-check"></i>Copied!';
        this.classList.add('copied');
        setTimeout(()=>{ this.innerHTML='<i class="fas fa-copy"></i>'+label; this.classList.remove('copied'); },1800);
      });
    });
    el.appendChild(btn);
  }
  addCopyBtn('umerfaheem632@gmail.com','Copy','a[href="mailto:umerfaheem632@gmail.com"]');
})();

/* ── 10. READING TIME ESTIMATE — disabled (combined into hero tagline) ── */
(function(){
  // Reading time removed: integrated into hero-pro-tag tagline
})();

/* ── 12. SKILLS PANEL SLIDE ANIMATION ── */
(function(){
  const origShowTab = window.showTab;
  window.showTab = function(id){
    document.querySelectorAll('.skills-panel').forEach(p=>{
      if(p.classList.contains('active')){
        p.style.opacity='0'; p.style.transform='translateY(8px)';
        setTimeout(()=>{ p.classList.remove('active'); p.style.opacity=''; p.style.transform=''; },200);
      }
    });
    document.querySelectorAll('.skills-tab').forEach(t=>t.classList.remove('active'));
    const _e=window.event; if(_e&&_e.target&&_e.target.closest) _e.target.closest('.skills-tab')?.classList.add('active');
    setTimeout(()=>{
      const panel=document.getElementById('tab-'+id);
      if(panel){ panel.classList.add('active'); panel.style.opacity='0'; panel.style.transform='translateY(12px)';
        requestAnimationFrame(()=>{ panel.style.opacity='1'; panel.style.transform='translateY(0)'; });
      }
    },180);
  };
})();

/* ── 13. HERO STAT CLICK — scroll to relevant section ── */
(function(){
  const statMap=[
    {el:document.querySelectorAll('.hero-stat')[1],section:'certifications'},
    {el:document.querySelectorAll('.hero-stat')[2],section:'projects'},
    {el:document.querySelectorAll('.hero-stat')[3],section:'education'},
  ];
  statMap.forEach(({el,section})=>{
    if(!el) return;
    el.style.cursor='pointer';
    el.title='Click to jump to '+(section[0].toUpperCase()+section.slice(1));
    el.addEventListener('click',()=>{
      const s=document.getElementById(section);
      if(s) s.scrollIntoView({behavior:'smooth',block:'start'});
    });
  });
})();

/* ── 14. KEYBOARD SHORTCUTS — Arrow keys + Section shortcuts ── */
(function(){
  const SECTIONS = ['hero','about','skills','experience','education','projects','certifications','awards','docs','contact'];
  document.addEventListener('keydown',function(e){
    const tag=document.activeElement.tagName;
    if(tag==='INPUT'||tag==='TEXTAREA') return;
    if(e.key==='ArrowRight'||e.key==='ArrowDown'){
      if(!e.altKey) return;
      e.preventDefault();
      const sy=window.scrollY;
      for(let i=0;i<SECTIONS.length;i++){
        const s=document.getElementById(SECTIONS[i]);
        if(s&&s.offsetTop>sy+100){ s.scrollIntoView({behavior:'smooth',block:'start'}); break; }
      }
    }
    if(e.key==='ArrowLeft'||e.key==='ArrowUp'){
      if(!e.altKey) return;
      e.preventDefault();
      const sy=window.scrollY;
      for(let i=SECTIONS.length-1;i>=0;i--){
        const s=document.getElementById(SECTIONS[i]);
        if(s&&s.offsetTop<sy-80){ s.scrollIntoView({behavior:'smooth',block:'start'}); break; }
      }
    }
  });
})();

/* ── 15. MOBILE MENU HAMBURGER ANIMATION ── */
(function(){
  const mobBtn=document.getElementById('mobBtn');
  const mobMenu=document.getElementById('mobMenu');
  if(!mobBtn||!mobMenu) return;
  const origClose=window.closeMob;
  mobBtn.addEventListener('click',function(){
    this.classList.toggle('is-open');
  });
  window.closeMob=function(){
    mobBtn.classList.remove('is-open');
    if(origClose) origClose();
  };
})();

/* ── 16. SMOOTH SKILL BARS ON TAB SWITCH ── */
(function(){
  function animateBarsInPanel(panel){
    panel.querySelectorAll('.skill-bar-fill').forEach((b,i)=>{
      b.style.width='0';
      setTimeout(()=>{ b.style.width=(b.dataset.w||0)+'%'; }, i*55);
    });
  }
  const activePanel=document.querySelector('.skills-panel.active');
  if(activePanel) setTimeout(()=>animateBarsInPanel(activePanel),800);

  const origShowTab=window.showTab;
  window._animateBarsInPanel=animateBarsInPanel;
})();

/* ── 17. CMD K HINT in footer ── */
(function(){
  const footer=document.querySelector('.footer-inner');
  if(!footer) return;
  const hint=document.createElement('div');
  hint.className='cmd-hint';
  hint.style.cssText='margin-top:.8rem;opacity:.6;justify-content:center;display:flex';
  hint.innerHTML='Press <kbd>⌘K</kbd> or <kbd>Ctrl+K</kbd> to open command palette &nbsp;·&nbsp; <kbd>Shift+A</kbd> for AI Chat';
  footer.appendChild(hint);
})();

/* ── 19. BACK TO TOP BUTTON — Scroll Top ── */
(function(){
  const btt = document.getElementById('scrollTop');
  if(btt){
    btt.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
  }
})();
