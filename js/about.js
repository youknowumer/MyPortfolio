/* About — copy-to-clipboard for contact chips */
(function(){
  'use strict';
  function fallbackCopy(text){
    var t = document.createElement('textarea');
    t.value = text; t.setAttribute('readonly',''); t.style.cssText = 'position:fixed;opacity:0';
    document.body.appendChild(t); t.select();
    try { document.execCommand('copy'); } catch(e){}
    document.body.removeChild(t);
  }
  document.addEventListener('click', function(e){
    var b = e.target.closest && e.target.closest('#about [data-copy]');
    if(!b) return;
    var text = b.getAttribute('data-copy');
    var done = function(){
      b.classList.add('done'); b.setAttribute('aria-label','Copied');
      if(window.App && App.toast) App.toast('Email copied to clipboard','success');
      setTimeout(function(){ b.classList.remove('done'); b.setAttribute('aria-label', b.dataset.label || 'Copy'); }, 1800);
    };
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(text).then(done, function(){ fallbackCopy(text); done(); });
    } else { fallbackCopy(text); done(); }
  });
})();
