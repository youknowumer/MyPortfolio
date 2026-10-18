/* Visual effects — hero stars and sparkle canvas */

/* Add twinkling stars to hero */
(function(){
  const hero = document.querySelector('.hero');
  if(!hero) return;
  const starsDiv = document.createElement('div');
  starsDiv.className = 'hero-stars';
  const positions = [
    [8,15],[18,45],[28,25],[38,70],[48,10],[58,55],[68,30],[78,80],[88,20],[95,60],
    [12,85],[22,35],[32,65],[42,50],[52,90],[62,15],[72,45],[82,75],[92,35],[5,50]
  ];
  positions.forEach(([x,y],i) => {
    const star = document.createElement('div');
    star.className = 'hero-star';
    star.style.cssText = `left:${x}%;top:${y}%;animation-duration:${2+Math.random()*3}s;animation-delay:${Math.random()*3}s`;
    starsDiv.appendChild(star);
  });
  hero.appendChild(starsDiv);
})();

/* ══════════════ SPARKLE CANVAS — optimised ══════════════ */
(function(){
  const canvas = document.getElementById('sparkleCanvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d', {alpha:true});
  let W, H, sparks = [], paused = false;

  function resize(){ W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize, {passive:true});

  /* Pause when tab is hidden — saves CPU entirely */
  document.addEventListener('visibilitychange',()=>{ paused = document.hidden; if(!paused && !rafId) loop(); });

  const COLORS = ['rgba(212,129,58,','rgba(232,168,78,','rgba(242,204,138,','rgba(245,158,11,'];

  function Spark(){ this.reset(); }
  Spark.prototype.reset = function(){
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.r = Math.random() * 1.6 + 0.4;
    this.vx = (Math.random()-0.5)*0.16;
    this.vy = -Math.random()*0.28 - 0.07;
    this.life = Math.random()*160 + 60;
    this.maxLife = this.life;
    this.color = COLORS[Math.floor(Math.random()*COLORS.length)];
  };
  Spark.prototype.update = function(){
    this.x += this.vx; this.y += this.vy; this.life--;
    if(this.life<=0 || this.y<-10) this.reset();
  };

  /* Reduced from 55 → 32 particles; group by colour to minimise fillStyle changes */
  for(let i=0;i<32;i++) sparks.push(new Spark());

  let rafId = 0;
  function loop(){
    if(paused){ rafId = 0; return; }
    ctx.clearRect(0,0,W,H);
    /* Batch draws by colour */
    const groups = {};
    sparks.forEach(s=>{
      s.update();
      const alpha = (s.life/s.maxLife)*0.42;
      const key = s.color + alpha.toFixed(2) + ')';
      if(!groups[key]) groups[key]=[];
      groups[key].push(s);
    });
    Object.keys(groups).forEach(style=>{
      ctx.beginPath();
      ctx.fillStyle = style;
      groups[style].forEach(s=>{ ctx.moveTo(s.x,s.y); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); });
      ctx.fill();
    });
    rafId = requestAnimationFrame(loop);
  }
  loop();
})();

/* ══════════════ CURSOR SPARKLE TRAILS — pooled DOM nodes ══════════════ */
(function(){
  /* Pre-create a pool of trail dots to avoid continuous DOM thrashing */
  const POOL_SIZE = 12;
  const pool = [];
  for(let i=0;i<POOL_SIZE;i++){
    const d = document.createElement('div');
    d.className = 'sparkle-trail';
    d.style.display = 'none';
    document.body.appendChild(d);
    pool.push({el:d, free:true, timer:null});
  }

  function getFreeDot(){
    for(let i=0;i<pool.length;i++) if(pool[i].free) return pool[i];
    return null; /* skip if all busy */
  }

  let lastX=0, lastY=0;
  document.addEventListener('mousemove',function(e){
    const dx=Math.abs(e.clientX-lastX), dy=Math.abs(e.clientY-lastY);
    if(dx+dy < 14) return;
    lastX=e.clientX; lastY=e.clientY;
    const slot = getFreeDot();
    if(!slot) return;
    const sz = 3 + Math.random()*4;
    slot.el.style.cssText = `display:block;left:${e.clientX}px;top:${e.clientY}px;width:${sz}px;height:${sz}px;`;
    slot.free = false;
    if(slot.timer) clearTimeout(slot.timer);
    slot.timer = setTimeout(()=>{ slot.el.style.display='none'; slot.free=true; }, 600);
  },{passive:true});
})();
