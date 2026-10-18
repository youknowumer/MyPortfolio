/* Sliding liquid-glass lens behind the active tab: springy follow + slight stretch while travelling */
(function(){
  var bar=document.getElementById('navLinks'); if(!bar) return;
  var lens=document.createElement('li'); lens.className='tab-lens'; lens.setAttribute('aria-hidden','true'); lens.setAttribute('role','presentation');
  bar.insertBefore(lens,bar.firstChild);
  var rm=matchMedia('(prefers-reduced-motion:reduce)').matches, k=rm?1:.2;
  var x=0,w=0,first=true,raf=0,idle=0;
  function target(){
    var a=bar.querySelector('.tab.nav-active'); if(!a||!a.offsetParent) return null;
    var b=bar.getBoundingClientRect(),r=a.getBoundingClientRect();
    return {x:r.left-b.left,w:r.width,h:r.height,y:r.top-b.top};
  }
  function step(){
    var t=target(); raf=0; if(!t) return;
    lens.style.height=t.h+'px'; lens.style.top=t.y+'px';
    if(first){x=t.x;w=t.w;first=false;bar.classList.add('has-lens')}
    var vx=(t.x-x)*k, vw=(t.w-w)*k; x+=vx; w+=vw;
    var s=Math.min(Math.abs(vx)/50,.14);
    lens.style.width=(w*(1+s))+'px';
    lens.style.transform='translate3d('+(x-w*s/2)+'px,0,0) scaleY('+(1-s*.6)+')';
    var moving=Math.abs(t.x-x)>.4||Math.abs(t.w-w)>.4;
    lens.classList.toggle('is-moving',moving&&Math.abs(vx)>1);
    if(moving){idle=0;raf=requestAnimationFrame(step)}
    else if(idle++<30){raf=requestAnimationFrame(step)} /* keep tracking ~0.5s for label-width transitions */
    else{x=t.x;w=t.w;lens.style.width=w+'px';lens.style.transform='translate3d('+x+'px,0,0)'}
  }
  function kick(){idle=0;if(!raf)raf=requestAnimationFrame(step)}
  new MutationObserver(kick).observe(bar,{attributes:true,attributeFilter:['class'],subtree:true});
  addEventListener('resize',function(){first=true;kick()},{passive:true});
  addEventListener('load',kick); kick();
})();
