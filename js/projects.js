/* Projects v2 — drill-in sheet per project (overview, skills behind it, certifications that back them, awards,
   modules), prev/next and share link. Also turns hero cards and the tech marquee into entry points. */
App.register('projects-v2', () => {
  const D = App.data(), root = document.getElementById('projects'), pr = D.projects || {};
  if (!root || !pr.featured) return;
  const $ = (s, r = root) => r.querySelector(s), $$ = (s, r = root) => [...r.querySelectorAll(s)];
  const list = [{...pr.featured, featured: true}, ...(pr.others || [])];
  const byTitle = {}; list.forEach(p => byTitle[p.title] = p);

  /* DOM ↔ data */
  const els = {};
  const f = $('.featured-proj'); if (f) els[pr.featured.title] = f;
  $$('.proj-card').forEach(c => { const t = (($('h3', c) || {}).textContent || '').trim(); if (byTitle[t]) els[t] = c; });
  Object.entries(els).forEach(([t, el]) => {
    el.dataset.project = t; el.setAttribute('tabindex', '0'); el.setAttribute('role', 'button'); el.setAttribute('aria-label', t + '. Open project details');
    const host = byTitle[t].featured ? $('.featured-label', el) : $('.proj-card-tags', el);
    if (host && !$('.pj-go', el)) {
      if (byTitle[t].featured) host.insertAdjacentHTML('beforeend', '<em class="pj-go">Full case file <i class="fas fa-arrow-right"></i></em>');
      else host.insertAdjacentHTML('afterend', '<div class="pj-go-row"><em class="pj-go">Drill in <i class="fas fa-arrow-right"></i></em></div>');
    }
  });

  const skillsOf = t => Object.values(App.skillModel || {}).filter(s => s.ev.some(e => e.k === 'project' && e.l === t)).sort((a, b) => b.score - a.score);
  const matchSkill = tag => { const tl = tag.toLowerCase(); return Object.values(App.skillModel || {}).find(s => s.name.toLowerCase() === tl)
    || Object.values(App.skillModel || {}).find(s => tl.length > 2 && (s.name.toLowerCase().includes(tl) || (s.name.length > 3 && tl.includes(s.name.toLowerCase())))); };

  /* sheet */
  const sheet = document.createElement('div');
  sheet.className = 'sks pjs'; sheet.setAttribute('role', 'dialog'); sheet.setAttribute('aria-modal', 'true'); sheet.setAttribute('aria-labelledby', 'pjsT');
  sheet.innerHTML = '<div class="sks-back" data-close></div><div class="sks-panel" tabindex="-1"></div>';
  document.body.appendChild(sheet);
  const panel = $('.sks-panel', sheet);
  let current = null, lastFocus = null;
  const seq = () => list.map(p => p.title).filter(t => els[t]);

  const render = title => {
    const p = byTitle[title], el = els[title]; if (!p || !el) return; current = title;
    const ic = $('.proj-card-icon i, .featured-proj-icon', el), s = skillsOf(title), order = seq(), pos = order.indexOf(title);
    const certs = []; s.forEach(k => k.ev.filter(e => e.k === 'cert').forEach(e => { if (!certs.includes(e.l)) certs.push(e.l); }));
    const awards = (D.awards || []).filter(a => (a.title + ' ' + a.summary + ' ' + a.org).toLowerCase().includes(title.toLowerCase()));
    const mods = p.featured ? $$('.proj-module span', el).map(x => x.textContent.trim()) : [];
    const steps = p.featured ? $$('.case-step', el).map(c => ({h: ($('h5', c) || {}).textContent, t: ($('p', c) || {}).textContent})) : [];
    const role = (($('.proj-card-role', el) || {}).textContent || '').trim();
    const tags = (p.stack || []).map(t => { const m = matchSkill(t); return m ? `<button type="button" class="sks-r" data-skill="${App.esc(m.name)}"><b>${App.esc(t)}</b><i>${m.score}%</i></button>` : `<span class="pjs-t">${App.esc(t)}</span>`; }).join('');
    const icon = ic ? (ic.outerHTML && ic.tagName === 'I' ? ic.outerHTML : ic.innerHTML) : '<i class="fas fa-rocket"></i>';
    panel.dataset.lv = 'x';
    panel.innerHTML = `<button type="button" class="sks-share" data-share aria-label="Copy link to this project" title="Copy link"><i class="fas fa-link"></i></button><button type="button" class="sks-x" data-close aria-label="Close details"><i class="fas fa-xmark"></i></button>
      <div class="sks-nav"><button type="button" data-step="-1" aria-label="Previous project" ${pos <= 0 ? 'disabled' : ''}><i class="fas fa-chevron-left"></i></button><span>Project ${pos + 1} of ${order.length}</span>
        <button type="button" data-step="1" aria-label="Next project" ${pos === order.length - 1 ? 'disabled' : ''}><i class="fas fa-chevron-right"></i></button></div>
      <div class="sks-head"><div class="sks-ic cvs-ic" style="background:linear-gradient(135deg,#D4813A,#A85E22)">${icon}</div><div><h3 id="pjsT">${App.esc(title)}</h3><p>${App.esc(p.subtitle || role || '')}</p></div></div>
      <div class="sks-score"><span class="sk-lvl">${p.featured ? 'Capstone · Exhibition' : 'Completed'}</span>${p.award ? `<span class="pjs-aw"><i class="fas fa-trophy"></i> ${App.esc(p.award)}</span>` : ''}</div>
      <div class="sks-facts"><div><b>${(p.stack || []).length || mods.length}</b><span>${p.featured ? 'Modules' : 'Stack items'}</span></div><div><b>${s.length}</b><span>Skills behind it</span></div><div><b>${certs.length}</b><span>Backing certificates</span></div><div><b>${awards.length}</b><span>Awards</span></div></div>
      <div class="sks-body"><div class="sks-h"><h4>Overview</h4></div><p class="pjs-sum">${App.esc(p.summary)}</p></div>
      ${steps.length ? `<div class="sks-body"><div class="sks-h"><h4>Case study</h4></div>${steps.map((c, i) => `<div class="sks-e"><div class="sks-e-h"><strong>${String(i + 1).padStart(2, '0')} · ${App.esc(c.h)}</strong></div><p>${App.esc(c.t)}</p></div>`).join('')}</div>` : ''}
      ${mods.length ? `<div class="sks-rel"><h4>Integrated modules</h4><div>${mods.map(m => `<span class="pjs-t">${App.esc(m)}</span>`).join('')}</div></div>` : ''}
      ${tags ? `<div class="sks-rel"><h4>Stack · tap a skill to drill in</h4><div>${tags}</div></div>` : ''}
      ${s.length ? `<div class="sks-rel"><h4>Skills behind it</h4><div>${s.map(k => `<button type="button" class="sks-r" data-skill="${App.esc(k.name)}"><b>${App.esc(k.name)}</b><i>${k.score}%</i></button>`).join('')}</div></div>` : ''}
      ${certs.length ? `<div class="sks-rel"><h4>Certificates that back it</h4><div>${certs.map(c => `<button type="button" class="sks-r" data-cert="${App.esc(c)}"><b>${App.esc(c)}</b></button>`).join('')}</div></div>` : ''}
      ${awards.length ? `<div class="sks-body"><div class="sks-h"><h4>Recognition</h4><span>${awards.length}</span></div>${awards.map(a => `<div class="sks-e"><div class="sks-e-h"><strong>${App.esc(a.title)}</strong>${a.date ? `<span>${App.esc(a.date)}</span>` : ''}</div><div class="sks-e-s">${App.esc(a.org)}</div></div>`).join('')}</div>` : ''}`;
    panel.scrollTop = 0;
  };
  const focusables = () => [...panel.querySelectorAll('button:not([disabled])')];
  const open = (t, trigger) => {
    if (!byTitle[t] || !els[t]) return;
    if (!sheet.classList.contains('open')) { lastFocus = trigger || document.activeElement; document.body.style.overflow = 'hidden'; }
    render(t); sheet.classList.add('open');
    try { history.replaceState(null, '', '#project=' + encodeURIComponent(t)); } catch (_) {}
    requestAnimationFrame(() => { sheet.classList.add('on'); const x = $('.sks-x', panel); if (x) x.focus({preventScroll: true}); });
  };
  const close = (restore = true) => {
    if (!sheet.classList.contains('open')) return;
    sheet.classList.remove('on'); document.body.style.overflow = '';
    try { if (/^#project=/.test(location.hash)) history.replaceState(null, '', location.pathname + location.search + '#projects'); } catch (_) {}
    setTimeout(() => sheet.classList.remove('open'), 240);
    if (restore && lastFocus && lastFocus.focus) lastFocus.focus({preventScroll: true});
  };
  const step = d => { const o = seq(), n = o[o.indexOf(current) + d]; if (n) { render(n); const b = focusables().find(x => x.dataset.step === String(d)); if (b) b.focus({preventScroll: true}); } };
  sheet.addEventListener('click', e => {
    if (e.target.closest('[data-close]')) return close();
    if (e.target.closest('[data-share]')) { const u = location.href.split('#')[0] + '#project=' + encodeURIComponent(current);
      (navigator.clipboard ? navigator.clipboard.writeText(u) : Promise.reject()).then(() => App.toast('Link to this project copied'), () => App.toast(u)); return; }
    const st = e.target.closest('[data-step]'); if (st) return step(+st.dataset.step);
    const sk = e.target.closest('[data-skill]'); if (sk && App.skillSheet) { close(false); setTimeout(() => App.skillSheet.open(sk.dataset.skill, lastFocus), 60); return; }
    const ct = e.target.closest('[data-cert]'); if (ct && App.certSheet) { close(false); setTimeout(() => App.certSheet.open(ct.dataset.cert, lastFocus), 60); }
  });
  document.addEventListener('keydown', e => {
    if (sheet.classList.contains('open')) {
      if (e.key === 'Escape') { e.preventDefault(); close(); } else if (e.key === 'ArrowLeft') step(-1); else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'Tab') { const fo = focusables(); if (!fo.length) return; const a = fo[0], z = fo[fo.length - 1];
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); } }
      return;
    }
    const c = e.target.closest && e.target.closest('[data-project]');
    if (c && c === e.target && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); open(c.dataset.project, c); }
  });
  root.addEventListener('click', e => {
    if (e.target.closest('a,.sk-link')) return;
    const c = e.target.closest('[data-project]'); if (c) open(c.dataset.project, c);
  });
  const deep = () => { const m = /^#project=(.+)$/.exec(location.hash); if (!m) return; const t = decodeURIComponent(m[1]); if (els[t]) { root.scrollIntoView(); setTimeout(() => open(t), 400); } };
  deep(); addEventListener('hashchange', deep);
  document.addEventListener('click', e => { const b = e.target.closest && e.target.closest('[data-project-open]'); if (b) open(b.dataset.projectOpen, b); });

  /* hero cards + marquee → skills / project */
  const M = App.skillModel || {};
  const hero = [['.fc1', 'HTML5'], ['.fc3', 'Power BI']];
  hero.forEach(([sel, sk]) => { const c = $(sel, document); if (c && M[sk]) { c.dataset.skillOpen = sk; c.style.cursor = 'pointer'; c.setAttribute('role', 'button'); c.setAttribute('tabindex', '0'); } });
  const fc2 = $('.fc2', document); if (fc2) { fc2.dataset.projectOpen = pr.featured.title; fc2.style.cursor = 'pointer'; fc2.setAttribute('role', 'button'); fc2.setAttribute('tabindex', '0'); }
  $$('.hero-floating-card', document).forEach(c => { if (!c.dataset.skillOpen && !c.dataset.projectOpen && /oracle db/i.test(c.textContent) && M['Oracle DB']) { c.dataset.skillOpen = 'Oracle DB'; c.style.cursor = 'pointer'; c.setAttribute('role', 'button'); c.setAttribute('tabindex', '0'); } });
  const ALIAS = {'Excel': 'MS Excel', 'JIRA · Scrum': 'JIRA / Scrum', 'SAP': 'SAP ERP', 'CVAT': 'Data Annotation', 'Photoshop': 'Adobe Photoshop'};
  $$('.mq-item', document).forEach(m => { const n = m.textContent.trim(), sk = M[n] ? n : ALIAS[n]; if (sk && M[sk]) { m.dataset.skillOpen = sk; m.style.cursor = 'pointer'; m.title = 'See where ' + sk + ' is applied'; } });
  document.addEventListener('keydown', e => { const t = e.target; if (t && t.dataset && (t.dataset.skillOpen || t.dataset.projectOpen) && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); t.click(); } });

  App.projectSheet = {open, close};
});
