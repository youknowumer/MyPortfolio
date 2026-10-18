/* Smoothness helpers: scroll-state flag, pause offscreen animations, pause when tab hidden */
(function(){
  var b=document.body,t;
  addEventListener('scroll',function(){b.classList.add('is-scrolling');clearTimeout(t);t=setTimeout(function(){b.classList.remove('is-scrolling')},110)},{passive:true});
  document.addEventListener('visibilitychange',function(){b.classList.toggle('tab-hidden',document.hidden)});
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){e.target.classList.toggle('is-off',!e.isIntersecting)})},{rootMargin:'200px 0px'});
    document.querySelectorAll('section').forEach(function(s){io.observe(s)});
  }
})();
