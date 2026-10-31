/* Skills radar chart (canvas, no library) */

/* ═══════════════════════════════════════════
   RADAR CHART ENGINE — Pure Canvas, No Library
   Green theme matching portfolio palette
═══════════════════════════════════════════ */
function drawRadar(canvasId, labels, data, color1, color2){
  const canvas = document.getElementById(canvasId);
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const cx = W/2, cy = H/2;
  const R = Math.min(W,H)/2 - 36;
  const N = labels.length;
  const step = (Math.PI*2)/N;
  let animated = false;
  let progress = 0;

  function getPoint(i, val, r){
    const angle = step*i - Math.PI/2;
    return {x: cx + Math.cos(angle)*r*val, y: cy + Math.sin(angle)*r*val};
  }

  function draw(prog){
    ctx.clearRect(0,0,W,H);
    // Grid rings
    for(let ring=1; ring<=5; ring++){
      const rf = ring/5;
      ctx.beginPath();
      for(let i=0;i<N;i++){
        const p = getPoint(i, rf, R);
        i===0 ? ctx.moveTo(p.x,p.y) : ctx.lineTo(p.x,p.y);
      }
      ctx.closePath();
      ctx.strokeStyle = `rgba(212,129,58,${ring===5?0.25:0.1})`;
      ctx.lineWidth = ring===5?1.5:1;
      ctx.stroke();
      if(ring===5){
        ctx.fillStyle='rgba(212,129,58,0.02)';
        ctx.fill();
      }
    }
    // Axis lines
    for(let i=0;i<N;i++){
      const p = getPoint(i,1,R);
      ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(p.x,p.y);
      ctx.strokeStyle='rgba(212,129,58,0.15)';ctx.lineWidth=1;ctx.stroke();
    }
    // Data polygon (animated)
    const grd = ctx.createRadialGradient(cx,cy,0,cx,cy,R);
    grd.addColorStop(0, color1.replace('1)',`0.35)`));
    grd.addColorStop(1, color2.replace('1)',`0.08)`));
    ctx.beginPath();
    for(let i=0;i<N;i++){
      const val = data[i]/100 * prog;
      const p = getPoint(i, val, R);
      i===0 ? ctx.moveTo(p.x,p.y) : ctx.lineTo(p.x,p.y);
    }
    ctx.closePath();
    ctx.fillStyle=grd;ctx.fill();
    ctx.strokeStyle=color1.replace('rgba','rgba').replace(/,[\d.]+\)$/,',0.9)');
    ctx.lineWidth=2;ctx.stroke();
    // Dots on points
    for(let i=0;i<N;i++){
      const val = data[i]/100*prog;
      const p = getPoint(i,val,R);
      ctx.beginPath();ctx.arc(p.x,p.y,4,0,Math.PI*2);
      ctx.fillStyle='white';ctx.fill();
      ctx.strokeStyle=color1.replace(/,[\d.]+\)$/,',1)');ctx.lineWidth=2;ctx.stroke();
    }
    // Labels
    ctx.font='bold 10px Sora,sans-serif';
    ctx.textAlign='center';ctx.textBaseline='middle';
    for(let i=0;i<N;i++){
      const p = getPoint(i,1.22,R);
      const val = Math.round(data[i]*prog);
      // Label background pill
      const tw = ctx.measureText(labels[i]).width;
      ctx.fillStyle='rgba(255,255,255,0.85)';
      ctx.beginPath();
      ctx.roundRect?ctx.roundRect(p.x-tw/2-5,p.y-8,tw+10,16,4):undefined;
      ctx.fill?.();
      ctx.fillStyle='#A85E22';
      ctx.fillText(labels[i],p.x,p.y-1);
      // Value badge
      ctx.font='bold 8px Sora,sans-serif';
      ctx.fillStyle='rgba(212,129,58,0.7)';
      ctx.fillText(val+'%',p.x,p.y+10);
      ctx.font='bold 10px Sora,sans-serif';
    }
  }

  function animate(){
    if(progress<1){
      progress = Math.min(1, progress+0.022);
      draw(progress);
      requestAnimationFrame(animate);
    } else {
      draw(1);
    }
  }

  // Intersection Observer for lazy animation
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting && !animated){
        animated=true;
        progress=0;
        animate();
      }
    });
  },{threshold:0.3});
  obs.observe(canvas);
  draw(0);
}

/* ── CV Radar: 6 skill axes ── */
drawRadar(
  'cvRadarChart',
  ['Frontend','Data/BI','ERP/SAP','Database','UI/UX','Python'],
  [88,85,78,80,82,82],
  'rgba(212,129,58,1)',
  'rgba(232,168,78,1)'
);

/* ── Cover Letter Radar: 6 competency axes ── */
drawRadar(
  'clRadarChart',
  ['Communication','Technical','Adaptability','Leadership','Collaboration','Initiative'],
  [90,85,88,75,92,86],
  'rgba(212,129,58,1)',
  'rgba(168,94,34,1)'
);

/* ── Animate CV skill bars on scroll ── */
(function(){
  const bars = document.querySelectorAll('.cv-sbar-fill');
  if(!bars.length) return;
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        bars.forEach(b=>{ b.style.width = (b.dataset.w||'0')+'%'; });
        obs.disconnect();
      }
    });
  },{threshold:0.3});
  if(bars[0]) obs.observe(bars[0]);
})();
