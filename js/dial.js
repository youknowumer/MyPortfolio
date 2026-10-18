/* Rotary dial behaviour for #spWrap: turns with the active section, wheel / keys to rotate, live progress ring */
(function(){
  var wrap=document.getElementById('spWrap'); if(!wrap) return;
  var dots=[].slice.call(wrap.querySelectorAll('.sp-dot')); if(!dots.length) return;
  function el(t,c,h){var e=document.createElement(t);e.className=c;if(h)e.innerHTML=h;return e}
  var list=el('div','dl-list'),lens=el('div','dl-lens'),ticks=el('div','dl-ticks'),
      ring=el('div','dl-ring','<svg viewBox="0 0 36 36"><circle class="tr" cx="18" cy="18" r="15"/><circle class="fg" cx="18" cy="18" r="15"/></svg><b>0</b>');
  var fg=ring.querySelector('.fg'),pct=ring.querySelector('b');
  dots.forEach(function(d,i){
    d.insertBefore(el('i','dl-n',('0'+(i+1)).slice(-2)),d.firstChild);
    d.tabIndex=0; d.setAttribute('role','button');
    d.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();d.click()}});
    list.appendChild(d);
  });
  wrap.appendChild(ticks);wrap.appendChild(lens);wrap.appendChild(list);wrap.appendChild(ring);
  function active(){for(var i=0;i<dots.length;i++)if(dots[i].classList.contains('on'))return i;return 0}
  function render(){var a=active();dots.forEach(function(d,i){var o=i-a;d.style.setProperty('--o',o);d.style.setProperty('--a',Math.abs(o))})}
  new MutationObserver(function(){render();tone()}).observe(wrap,{attributes:true,attributeFilter:['class'],subtree:true});
  /* Adaptive ink: light text over dark sections, dark text over light ones */
  function lumOf(c){var m=c.match(/rgba?\(([^)]+)\)/g);if(!m)return null;var t=0,n=0;
    m.forEach(function(x){var v=x.match(/[\d.]+/g).map(Number);if(v.length>3&&v[3]<.4)return;t+=(.2126*v[0]+.7152*v[1]+.0722*v[2])/255;n++});return n?t/n:null}
  function tone(){
    var r=wrap.getBoundingClientRect(),els=document.elementsFromPoint(r.left+r.width*.4,r.top+r.height/2),L=null;
    for(var i=0;i<els.length&&L===null;i++){var e=els[i];if(wrap.contains(e))continue;var cs=getComputedStyle(e);
      L=lumOf(cs.backgroundColor);if(L===null&&cs.backgroundImage!=='none')L=lumOf(cs.backgroundImage)}
    if(L!==null)wrap.classList.toggle('dl-on-dark',L<.45);
  }
  var tick=0;
  function prog(){tick=0;var h=document.documentElement.scrollHeight-innerHeight,p=h>0?Math.min(1,Math.max(0,scrollY/h)):0;
    fg.style.strokeDashoffset=94.25*(1-p);pct.textContent=Math.round(p*100);wrap.style.setProperty('--prog',p);tone()}
  addEventListener('scroll',function(){if(!tick)tick=requestAnimationFrame(prog)},{passive:true});
  var lock=0;
  wrap.addEventListener('wheel',function(e){
    e.preventDefault();if(lock)return;lock=1;setTimeout(function(){lock=0},520);
    var t=dots[Math.max(0,Math.min(dots.length-1,active()+(e.deltaY>0?1:-1)))],s=document.getElementById(t.dataset.t);
    if(s)s.scrollIntoView({behavior:'smooth',block:'start'});
  },{passive:false});
  render();prog();
})();
