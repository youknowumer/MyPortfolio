/* Core runtime — shared utilities, one rAF scroll bus, isolated module boot, safe helpers.
   Loaded first; every other file may rely on window.App. */
(function(){
  'use strict';
  const App = window.App = window.App || {};
  const modules = [], errors = [];

  /* HTML-escape anything user-supplied before it touches innerHTML */
  App.esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  /* Module registry: a failing feature logs and is skipped — the rest of the site keeps working */
  App.register = (name, init) => modules.push({name, init});
  App.boot = () => modules.forEach(m => {
    try { m.init(); } catch (e) { errors.push({module: m.name, message: e.message}); console.error('[App] module "' + m.name + '" failed:', e); }
  });
  App.errors = () => errors.slice();

  /* Single rAF-throttled scroll bus — features subscribe instead of each adding listeners */
  const subs = []; let ticking = false;
  App.onScroll = fn => { subs.push(fn); fn(window.scrollY); };
  addEventListener('scroll', () => {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => { ticking = false; const y = window.scrollY; subs.forEach(f => f(y)); });
  }, {passive: true});

  /* Data helpers over window.PORTFOLIO */
  const D = () => window.PORTFOLIO || {};
  App.data = D;
  App.months = (start, end) => {           /* 'YYYY-MM' → whole months, inclusive */
    if (!start) return 0;
    const [sy, sm] = start.split('-').map(Number), n = new Date();
    const [ey, em] = end ? end.split('-').map(Number) : [n.getFullYear(), n.getMonth() + 1];
    return Math.max(1, (ey - sy) * 12 + (em - sm) + 1);
  };
  App.duration = (start, end) => {
    const m = App.months(start, end), y = Math.floor(m / 12), r = m % 12;
    return [y && y + ' yr', r && r + ' mo'].filter(Boolean).join(' ') || '1 mo';
  };
  App.stats = () => {
    const d = D(), exp = d.experience || [], certs = d.certifications || [];
    const skills = Object.values(d.skills || {}).flat();
    return {
      roles: exp.length,
      totalMonths: exp.reduce((a, e) => a + App.months(e.start, e.end), 0),
      certs: certs.length,
      providers: new Set(certs.map(c => c.provider)).size,
      skills: skills.length,
      avgSkill: skills.length ? Math.round(skills.reduce((a, s) => a + s.score, 0) / skills.length) : 0,
      topSkills: skills.slice().sort((a, b) => b.score - a.score).slice(0, 5).map(s => s.name)
    };
  };

  /* Toast without innerHTML on caller text */
  App.toast = (msg, type) => {
    const wrap = document.getElementById('toastWrap'); if (!wrap) return;
    const t = document.createElement('div');
    t.className = 'toast' + (type === 'err' ? ' toast-err' : '');
    t.setAttribute('role', type === 'err' ? 'alert' : 'status');
    t.innerHTML = '<div class="toast-icon"><i class="fas fa-' + (type === 'err' ? 'exclamation-circle' : 'check-circle') + '"></i></div><span></span>';
    t.lastChild.textContent = msg;
    wrap.appendChild(t);
    setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 320); }, 3800);
  };

  /* Structured data for search engines, built from the same data the page uses */
  App.register('seo-jsonld', () => {
    const p = D().person; if (!p || document.getElementById('ld-person')) return;
    const exp = (D().experience || []).find(e => e.current);
    const ld = {
      '@context': 'https://schema.org', '@type': 'Person', name: p.name, alternateName: p.handle,
      jobTitle: exp ? exp.role : p.headline, email: 'mailto:' + p.email,
      address: {'@type': 'PostalAddress', addressLocality: p.city, addressCountry: p.country},
      sameAs: [p.linkedin, p.github],
      knowsAbout: App.stats().topSkills.concat(Object.values(D().skills || {}).flat().map(s => s.name)).filter((v, i, a) => a.indexOf(v) === i),
      alumniOf: {'@type': 'CollegeOrUniversity', name: 'University of Management and Technology, Lahore'},
      award: (D().awards || []).filter(a => !a.tier || a.tier === 'honour').map(a => a.title).filter(Boolean)
    };
    if (exp) ld.worksFor = {'@type': 'Organization', name: exp.company};
    const s = document.createElement('script'); s.type = 'application/ld+json'; s.id = 'ld-person';
    s.textContent = JSON.stringify(ld); document.head.appendChild(s);
  });

  document.addEventListener('DOMContentLoaded', App.boot);
})();
