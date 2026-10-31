/* Upgrade layer — counters, skill analytics, cert filters/charts, spotlight, contact helpers */
(function(){
  'use strict';
  const $  = (s,r=document)=>r.querySelector(s);
  const $$ = (s,r=document)=>Array.from(r.querySelectorAll(s));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Ghost section numbers ───────────────────────────── */
  $$('main > section').forEach((sec,i)=>{
    const head = $('.sec-head',sec);
    if(head) head.setAttribute('data-num', String(i+1).padStart(2,'0'));
  });

  /* ── Count-up numbers ────────────────────────────────── */
  function countUp(el){
    const target = parseFloat(el.dataset.count);
    if(isNaN(target)) return;
    const dec = parseInt(el.dataset.dec||'0',10), suf = el.dataset.suffix||'';
    if(reduce){ el.textContent = target.toFixed(dec)+suf; return; }
    const dur = 1400, t0 = performance.now();
    (function tick(now){
      const p = Math.min(1,(now-t0)/dur), e = 1-Math.pow(1-p,3);
      el.textContent = (target*e).toFixed(dec)+suf;
      if(p<1) requestAnimationFrame(tick);
    })(t0);
  }
  const cio = new IntersectionObserver(es=>es.forEach(e=>{
    if(e.isIntersecting){ countUp(e.target); cio.unobserve(e.target); }
  }),{threshold:.4});
  $$('[data-count]').forEach(el=>cio.observe(el));

  /* ── Card spotlight follows pointer ──────────────────── */
  document.addEventListener('pointermove',e=>{
    const c = e.target.closest && e.target.closest('.u-card');
    if(!c) return;
    const r = c.getBoundingClientRect();
    c.style.setProperty('--mx',(e.clientX-r.left)+'px');
    c.style.setProperty('--my',(e.clientY-r.top)+'px');
  },{passive:true});

  /* ── Skill analytics (computed from the real skill bars) ─ */
  const DOMAINS = [
    {id:'frontend',  label:'Frontend & Web',      icon:'fa-code'},
    {id:'data',      label:'Data & BI',           icon:'fa-chart-bar'},
    {id:'enterprise',label:'Enterprise Systems',  icon:'fa-cubes'},
    {id:'design',    label:'Design & Creative',   icon:'fa-pen-nib'},
    {id:'office',    label:'Productivity',        icon:'fa-briefcase'}
  ];
  const level = v => v>=85?'Expert':v>=75?'Advanced':v>=60?'Proficient':'Foundational';
  const all = [];
  DOMAINS.forEach(d=>{
    const items = $$('#tab-'+d.id+' .skill-pill').map(p=>({
      name: $('.skill-pill-name',p).textContent.trim(),
      v: parseFloat($('.skill-bar-fill',p).dataset.w)
    }));
    d.items = items;
    d.avg = items.length ? Math.round(items.reduce((a,b)=>a+b.v,0)/items.length) : 0;
    items.forEach(i=>all.push(i));
  });

  /* level badge on every pill */
  $$('.skill-pill').forEach(p=>{
    const info = $('.skill-pill-info',p), fill = $('.skill-bar-fill',p);
    if(!info||!fill||$('.skill-pct',info)) return;
    const v = parseFloat(fill.dataset.w), s = document.createElement('span');
    s.className='skill-pct'; s.innerHTML = v+'%<small>'+level(v)+'</small>';
    info.appendChild(s);
  });

  function radar(){
    const host = $('#siRadar'); if(!host) return;
    const W=600,H=480,cx=300,cy=240,R=178,n=DOMAINS.length;
    const pt=(i,r)=>{const a=-Math.PI/2+i*2*Math.PI/n;return [cx+r*Math.cos(a),cy+r*Math.sin(a)];};
    let g='';
    [.25,.5,.75,1].forEach(k=>{
      g+='<polygon points="'+DOMAINS.map((_,i)=>pt(i,R*k).join(',')).join(' ')+'" fill="'+(k===1?'rgba(255,255,255,.55)':'none')+'" stroke="rgba(212,129,58,'+(k===1?.45:.2)+')" stroke-dasharray="'+(k===1?'0':'3 4')+'"/>';
      g+='<text x="'+(cx+4)+'" y="'+(cy-R*k-3)+'" font-size="9" fill="#8A6840" font-weight="700">'+Math.round(k*100)+'</text>';
    });
    DOMAINS.forEach((d,i)=>{const [x,y]=pt(i,R);g+='<line x1="'+cx+'" y1="'+cy+'" x2="'+x+'" y2="'+y+'" stroke="rgba(212,129,58,.25)"/>';});
    const poly = DOMAINS.map((d,i)=>pt(i,R*d.avg/100).join(',')).join(' ');
    g+='<polygon id="siPoly" points="'+DOMAINS.map(()=>cx+','+cy).join(' ')+'" fill="rgba(232,168,78,.38)" stroke="#D4813A" stroke-width="2.5" stroke-linejoin="round" style="transition:all 1.3s cubic-bezier(.34,1.2,.64,1)"/>';
    DOMAINS.forEach((d,i)=>{
      const [x,y]=pt(i,R*d.avg/100), [lx,ly]=pt(i,R+34);
      g+='<circle class="siDot" data-x="'+x+'" data-y="'+y+'" cx="'+cx+'" cy="'+cy+'" r="5.5" fill="#fff" stroke="#D4813A" stroke-width="3" style="transition:all 1.3s cubic-bezier(.34,1.2,.64,1)"/>';
      const anchor = Math.abs(lx-cx)<8?'middle':(lx>cx?'start':'end');
      g+='<text x="'+lx+'" y="'+(ly-2)+'" text-anchor="'+anchor+'" font-size="11.5" font-weight="700" fill="#1A1008" font-family="Sora,sans-serif">'+d.label+'</text>';
      g+='<text x="'+lx+'" y="'+(ly+13)+'" text-anchor="'+anchor+'" font-size="11" font-weight="800" fill="#D4813A" font-family="Sora,sans-serif">'+d.avg+'% avg</text>';
    });
    host.innerHTML='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Average proficiency by skill domain">'+g+'</svg>';
    const animate = ()=>{
      const poly = $('#siPoly',host); if(!poly) return;
      poly.setAttribute('points', DOMAINS.map((d,i)=>pt(i,R*d.avg/100).join(',')).join(' '));
      $$('.siDot',host).forEach(c=>{c.setAttribute('cx',c.dataset.x);c.setAttribute('cy',c.dataset.y);});
    };
    const o = new IntersectionObserver(es=>{ if(es[0].isIntersecting){ setTimeout(animate,200); o.disconnect(); }},{threshold:.35});
    o.observe(host);
  }

  function domainBars(){
    const host = $('#siDomains'); if(!host) return;
    host.innerHTML = DOMAINS.map(d=>{
      const top = d.items.slice().sort((a,b)=>b.v-a.v).slice(0,3).map(i=>i.name).join(' · ');
      return '<div class="sd-row"><div class="sd-h"><span><i class="fas '+d.icon+'"></i>'+d.label+'</span><span>'+d.avg+'%</span></div><div class="sd-track"><div class="sd-fill" data-w="'+d.avg+'"></div></div><small>Strongest: '+top+' · '+d.items.length+' skills</small></div>';
    }).join('');
    const o = new IntersectionObserver(es=>{ if(es[0].isIntersecting){ $$('.sd-fill',host).forEach(f=>f.style.width=f.dataset.w+'%'); o.disconnect(); }},{threshold:.3});
    o.observe(host);
    const ol = $('#siTop');
    if(ol) ol.innerHTML = all.slice().sort((a,b)=>b.v-a.v).slice(0,6).map(i=>'<li>'+i.name+'<b>'+i.v+'%</b></li>').join('');
  }
  radar(); domainBars();

  /* ── Certifications: filter + charts from the real cards ── */
  const cards = $$('.cert-card');
  const providerOf = c => ($('.cert-provider',c).textContent||'').trim();
  const monthOf    = c => ($('.cert-date',c).textContent||'').trim();
  const CAT = {tech:'Tech & Data',design:'Web & Design',erp:'ERP & Business',mgmt:'Management & People'};
  const COL = {tech:'#D4813A',design:'#E8A84E',erp:'#8b5cf6',mgmt:'#3b82f6'};

  const cfAll = $('#cfAll'); if(cfAll) cfAll.textContent = cards.length;
  $$('.cf-btn').forEach(b=>b.addEventListener('click',()=>{
    $$('.cf-btn').forEach(x=>x.classList.toggle('on',x===b));
    const f = b.dataset.f;
    cards.forEach(c=>c.classList.toggle('is-hidden', f!=='all' && c.dataset.cat!==f));
  }));

  function certCharts(){
    const prov = {}; cards.forEach(c=>{const p=providerOf(c); prov[p]=(prov[p]||0)+1;});
    const rows = Object.entries(prov).sort((a,b)=>b[1]-a[1]);
    const max = Math.max.apply(null,rows.map(r=>r[1]));
    const pb = $('#ciProviders');
    if(pb) pb.innerHTML = rows.map(r=>'<div class="cb-row"><span>'+r[0]+'</span><div class="cb-track"><div class="cb-fill" data-w="'+(r[1]/max*100)+'"></div></div><b>'+r[1]+'</b></div>').join('');

    const mon = {}; const order = [];
    cards.forEach(c=>{
      const m = monthOf(c).replace(/\s*\d{4}/,'').replace(/^.*?(\w+)$/,'$1'); /* month name */
      const key = monthOf(c).replace(/^\W+/,'');
      if(!(key in mon)){ mon[key]=0; order.push(key); }
      mon[key]++;
    });
    const mo = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    order.sort((a,b)=>{const pa=a.split(' '),pb2=b.split(' ');return (pa[1]-pb2[1])||(mo.indexOf(pa[0])-mo.indexOf(pb2[0]));});
    const mm = Math.max.apply(null,order.map(k=>mon[k]));
    const cad = $('#ciCadence');
    if(cad) cad.innerHTML = order.map(k=>'<div class="cc-col"><div class="cc-bar" data-h="'+(mon[k]/mm*100)+'">'+mon[k]+'</div><span>'+k.split(' ')[0].slice(0,3)+'</span></div>').join('');

    const cat = {}; cards.forEach(c=>{cat[c.dataset.cat]=(cat[c.dataset.cat]||0)+1;});
    const don = $('#ciDonut');
    if(don){
      const total = cards.length, r=52, C=2*Math.PI*r; let off=0, segs='', leg='';
      Object.keys(CAT).forEach(k=>{
        const n = cat[k]||0; if(!n) return;
        const len = C*n/total;
        segs += '<circle class="seg" cx="70" cy="70" r="'+r+'" fill="none" stroke="'+COL[k]+'" stroke-width="18" stroke-dasharray="0 '+C+'" data-len="'+len+'" data-c="'+C+'" stroke-dashoffset="'+(-off)+'" transform="rotate(-90 70 70)"/>';
        leg += '<span><i style="background:'+COL[k]+'"></i>'+CAT[k]+' · '+n+'</span>';
        off += len;
      });
      don.innerHTML = '<svg viewBox="0 0 140 140" role="img" aria-label="Certification domain mix">'+segs+'<text x="70" y="68" text-anchor="middle" font-family="Playfair Display,serif" font-size="26" font-weight="700" fill="#1A1008">'+total+'</text><text x="70" y="84" text-anchor="middle" font-size="8.5" font-weight="700" letter-spacing="1.5" fill="#8A6840">CERTS</text></svg><div class="cd-leg">'+leg+'</div>';
    }
    const host = $('.cert-insights');
    if(host){
      const o = new IntersectionObserver(es=>{ if(es[0].isIntersecting){
        $$('.cb-fill',host).forEach(f=>f.style.width=f.dataset.w+'%');
        $$('.cc-bar',host).forEach(b=>b.style.height=b.dataset.h+'%');
        $$('circle.seg',host).forEach(s=>s.setAttribute('stroke-dasharray',s.dataset.len+' '+s.dataset.c));
        o.disconnect();
      }},{threshold:.25});
      o.observe(host);
    }
  }
  certCharts();

  /* ── Contact: topic chips fill the subject ───────────── */
  const chips = $('#topicChips'), subj = $('#cf-subject');
  if(chips && subj){
    chips.addEventListener('click',e=>{
      const b = e.target.closest('button'); if(!b) return;
      $$('button',chips).forEach(x=>x.classList.toggle('on',x===b));
      subj.value = b.dataset.s;
      subj.classList.add('is-valid');
    });
  }

  /* ── Only one FAQ open at a time ─────────────────────── */
  $$('.faq details').forEach(d=>d.addEventListener('toggle',()=>{
    if(d.open) $$('.faq details').forEach(o=>{ if(o!==d) o.open=false; });
  }));
})();
