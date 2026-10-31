/* Certifications v2 — search, sort, live counts, and a drill-in sheet per certificate:
   learning path, skills it builds (each opens the skill drill-in), where those skills were put to work,
   related certificates, prev/next, share link. Everything is computed from window.PORTFOLIO. */
App.register('certs-v2', () => {
  const D = App.data(), root = document.getElementById('certifications'); if (!root || !(D.certifications || []).length) return;
  const $ = (s, r = root) => r.querySelector(s), $$ = (s, r = root) => [...r.querySelectorAll(s)];
  const CAT = {tech: 'Tech & Data', design: 'Web & Design', erp: 'ERP & Business', mgmt: 'Management & People'};
  const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const byName = {}; D.certifications.forEach(c => byName[c.name] = c);
  const chrono = D.certifications.slice().sort((a, b) => a.issued.localeCompare(b.issued) || a.name.localeCompare(b.name));
  const newest = chrono[chrono.length - 1].issued;
  const grid = $('.cert-grid'); if (!grid) return;

  /* cards ↔ data */
  const cards = $$('.cert-card').map((el, i) => {
    const name = (($('.cert-name', el) || {}).textContent || '').trim(), c = byName[name]; if (!c) return null;
    el.dataset.name = name; el.dataset.orig = i; el.dataset.issued = c.issued; el.dataset.prov = c.provider;
    el.setAttribute('tabindex', '0'); el.setAttribute('role', 'button'); el.setAttribute('aria-label', name + ', ' + c.provider + '. Open details');
    const meta = $('.cert-meta', el);
    if (meta && !$('.ct-go', meta)) meta.insertAdjacentHTML('beforeend', '<em class="ct-go">Drill in <i class="fas fa-arrow-right"></i></em>');
    if (c.issued === newest && !$('.ct-new', el)) el.insertAdjacentHTML('afterbegin', '<span class="ct-new">Latest</span>');
    return {el, c};
  }).filter(Boolean);

  /* stats follow the data */
  const st = App.stats(), nums = $$('.cert-stat-num'), lbls = $$('.cert-stat-lbl');
  lbls.forEach((l, i) => {
    const t = l.textContent, set = v => { nums[i].textContent = v; if (nums[i].dataset.count != null) nums[i].dataset.count = v; };
    if (/earned/i.test(t)) set(st.certs);
    else if (/platforms/i.test(t)) set(st.providers);
    else if (/recent/i.test(t)) set(newest.slice(0, 4));
  });

  /* toolbar: counts, search, sort */
  const tools = $('.cert-tools'), filters = $$('.cf-btn');
  filters.forEach(b => { if (b.dataset.f !== 'all' && !$('em', b)) b.insertAdjacentHTML('beforeend', ' <em>' + cards.filter(x => x.c.category === b.dataset.f).length + '</em>'); });
  const provs = [...new Set(D.certifications.map(c => c.provider))];
  if (tools && !$('.ct-bar', tools)) {
    tools.insertAdjacentHTML('beforeend', `<div class="ct-bar">
      <label class="ct-find"><i class="fas fa-magnifying-glass" aria-hidden="true"></i><input type="search" id="ctFind" placeholder="Search by name, provider or skill" aria-label="Search certifications" autocomplete="off"></label>
      <label class="ct-sort"><span>Sort</span><select id="ctSort" aria-label="Sort certifications"><option value="orig">Featured order</option><option value="new">Newest first</option><option value="old">Oldest first</option><option value="az">A → Z</option><option value="prov">By provider</option></select></label>
      <span class="ct-n" id="ctN" aria-live="polite"></span></div>`);
  }
  const hay = {}; /* searchable text: name, provider, category, and the skills each cert backs */
  const skillsFor = name => Object.values(App.skillModel || {}).filter(s => s.ev.some(e => e.k === 'cert' && e.l === name)).sort((a, b) => b.score - a.score);
  cards.forEach(({el, c}) => hay[c.name] = [c.name, c.provider, CAT[c.category], c.issuedLabel, ...skillsFor(c.name).map(s => s.name)].join(' ').toLowerCase());
  const empty = document.createElement('p'); empty.className = 'ct-empty'; empty.hidden = true; empty.textContent = 'No certification matches that search.';
  grid.insertAdjacentElement('afterend', empty);
  const sorters = {
    orig: (a, b) => a.el.dataset.orig - b.el.dataset.orig, new: (a, b) => b.c.issued.localeCompare(a.c.issued) || a.el.dataset.orig - b.el.dataset.orig,
    old: (a, b) => a.c.issued.localeCompare(b.c.issued) || a.el.dataset.orig - b.el.dataset.orig, az: (a, b) => a.c.name.localeCompare(b.c.name),
    prov: (a, b) => a.c.provider.localeCompare(b.c.provider) || a.c.name.localeCompare(b.c.name)
  };
  const refresh = () => {
    const parts = ($('#ctFind').value || '').trim().toLowerCase().split(/\s+/).filter(Boolean); let n = 0;
    cards.forEach(({el, c}) => { const hit = parts.every(p => hay[c.name].includes(p)); el.classList.toggle('ct-off', !hit); if (hit && !el.classList.contains('is-hidden')) n++; });
    $('#ctN').textContent = (parts.length || filters.some(b => b.classList.contains('on') && b.dataset.f !== 'all')) ? n + ' of ' + cards.length : '';
    empty.hidden = n > 0;
  };
  $('#ctFind').addEventListener('input', refresh);
  $('#ctSort').addEventListener('change', e => { cards.slice().sort(sorters[e.target.value]).forEach(x => grid.appendChild(x.el)); });
  filters.forEach(b => b.addEventListener('click', () => setTimeout(refresh, 0)));

  /* ── drill-in sheet (shares the .sks look) ── */
  const sheet = document.createElement('div');
  sheet.className = 'sks cvs'; sheet.setAttribute('role', 'dialog'); sheet.setAttribute('aria-modal', 'true'); sheet.setAttribute('aria-labelledby', 'cvsT');
  sheet.innerHTML = '<div class="sks-back" data-close></div><div class="sks-panel" tabindex="-1"></div>';
  document.body.appendChild(sheet);
  const panel = $('.sks-panel', sheet);
  let current = null, lastFocus = null;
  const cardOf = name => (cards.find(x => x.c.name === name) || {}).el;
  const visible = () => cards.filter(x => !x.el.classList.contains('is-hidden') && !x.el.classList.contains('ct-off')).sort((a, b) => [...grid.children].indexOf(a.el) - [...grid.children].indexOf(b.el)).map(x => x.c.name);
  const ml = ym => MON[+ym.slice(5) - 1] + ' ' + ym.slice(2, 4);

  const render = name => {
    const c = byName[name], el = cardOf(name); if (!c || !el) return; current = name;
    const ic = $('.cert-icon', el), seq = visible(), pos = seq.indexOf(name), sk = skillsFor(name);
    const work = []; sk.forEach(s => s.ev.filter(e => e.k !== 'cert').forEach(e => { if (!work.some(w => w.l === e.l)) work.push(e); }));
    const mates = chrono.filter(x => x.name !== name && (x.category === c.category || x.provider === c.provider));
    const idx = chrono.findIndex(x => x.name === name);
    const path = chrono.map((x, i) => `<button type="button" class="cvs-n${i === idx ? ' on' : ''}${x.category === c.category ? ' same' : ''}" data-open="${App.esc(x.name)}" title="${App.esc(x.name)} · ${App.esc(x.issuedLabel)}"><span>${i + 1}</span></button>`).join('');
    panel.dataset.lv = 'a';
    panel.innerHTML = `<button type="button" class="sks-share" data-share aria-label="Copy link to this certificate" title="Copy link"><i class="fas fa-link"></i></button><button type="button" class="sks-x" data-close aria-label="Close details"><i class="fas fa-xmark"></i></button>
      <div class="sks-nav"><button type="button" data-step="-1" aria-label="Previous certificate" ${pos <= 0 ? 'disabled' : ''}><i class="fas fa-chevron-left"></i></button>
        <span>${pos >= 0 ? 'Certificate ' + (pos + 1) + ' of ' + seq.length : 'Certificate'}</span>
        <button type="button" data-step="1" aria-label="Next certificate" ${pos < 0 || pos === seq.length - 1 ? 'disabled' : ''}><i class="fas fa-chevron-right"></i></button></div>
      <div class="sks-head"><div class="sks-ic cvs-ic" style="${App.esc(ic ? ic.getAttribute('style') || '' : '')}">${ic ? ic.innerHTML : '<i class="fas fa-certificate"></i>'}</div>
        <div><h3 id="cvsT">${App.esc(c.name)}</h3><p>${App.esc(c.provider)}</p></div></div>
      <div class="sks-score"><span class="sk-lvl">${App.esc(CAT[c.category])}</span><span class="sks-pct cvs-date">${App.esc(c.issuedLabel)}</span></div>
      <div class="sks-facts">
        <div><b>${c.verified ? 'Verified' : 'Self-reported'}</b><span>Status</span></div>
        <div><b>${sk.length}</b><span>Skills it builds</span></div>
        <div><b>${work.length}</b><span>Put to work in</span></div>
        <div><b>#${idx + 1} of ${chrono.length}</b><span>In my learning path</span></div></div>
      <div class="sks-body"><div class="sks-h"><h4>Learning path</h4><span>${App.esc(ml(chrono[0].issued))} → ${App.esc(ml(chrono[chrono.length - 1].issued))}</span></div>
        <div class="cvs-path" role="group" aria-label="All certificates in the order earned">${path}</div>
        <p class="cvs-cap">Dots are in the order earned; highlighted outlines share this certificate’s domain.</p></div>
      ${sk.length ? `<div class="sks-rel"><h4>Skills it builds</h4><div>${sk.map(s => `<button type="button" class="sks-r" data-skill="${App.esc(s.name)}" title="Open ${App.esc(s.name)}"><b>${App.esc(s.name)}</b><i>${s.score}%</i></button>`).join('')}</div></div>` : ''}
      ${work.length ? `<div class="sks-body"><div class="sks-h"><h4>Put to work in</h4><span>${work.length}</span></div>${work.map(e => `<div class="sks-e"><div class="sks-e-h"><strong>${App.esc(e.l)}</strong><span>${e.k === 'role' ? 'Role' : 'Project'}${e.meta && e.k === 'role' ? ' · ' + App.esc(e.meta) : ''}</span></div>${e.sub ? `<div class="sks-e-s">${App.esc(e.sub)}</div>` : ''}</div>`).join('')}</div>` : ''}
      ${mates.length ? `<div class="sks-rel"><h4>Related certificates</h4><div>${mates.map(x => `<button type="button" class="sks-r" data-open="${App.esc(x.name)}"><b>${App.esc(x.name)}</b><i>${App.esc(x.provider)}</i></button>`).join('')}</div></div>` : ''}`;
    panel.scrollTop = 0;
  };
  const focusables = () => [...panel.querySelectorAll('button:not([disabled])')];
  const open = (name, trigger) => {
    if (!byName[name]) return;
    if (!sheet.classList.contains('open')) { lastFocus = trigger || document.activeElement; document.body.style.overflow = 'hidden'; }
    render(name); sheet.classList.add('open');
    try { history.replaceState(null, '', '#cert=' + encodeURIComponent(name)); } catch (_) {}
    requestAnimationFrame(() => { sheet.classList.add('on'); const x = $('.sks-x', panel); if (x) x.focus({preventScroll: true}); });
  };
  const close = (restore = true) => {
    if (!sheet.classList.contains('open')) return;
    sheet.classList.remove('on'); document.body.style.overflow = '';
    try { if (/^#cert=/.test(location.hash)) history.replaceState(null, '', location.pathname + location.search + '#certifications'); } catch (_) {}
    setTimeout(() => sheet.classList.remove('open'), 240);
    if (restore && lastFocus && lastFocus.focus) lastFocus.focus({preventScroll: true});
  };
  const step = d => { const seq = visible(), n = seq[seq.indexOf(current) + d]; if (n) { render(n); const b = focusables().find(x => x.dataset.step === String(d)); if (b) b.focus({preventScroll: true}); } };
  sheet.addEventListener('click', e => {
    if (e.target.closest('[data-close]')) return close();
    if (e.target.closest('[data-share]')) {
      const u = location.href.split('#')[0] + '#cert=' + encodeURIComponent(current);
      (navigator.clipboard ? navigator.clipboard.writeText(u) : Promise.reject()).then(() => App.toast('Link to this certificate copied'), () => App.toast(u)); return;
    }
    const st = e.target.closest('[data-step]'); if (st) return step(+st.dataset.step);
    const sk = e.target.closest('[data-skill]');
    if (sk && App.skillSheet) { close(false); setTimeout(() => App.skillSheet.open(sk.dataset.skill, lastFocus), 60); return; }
    const o = e.target.closest('[data-open]'); if (o) open(o.dataset.open);
  });
  document.addEventListener('keydown', e => {
    if (sheet.classList.contains('open')) {
      if (e.key === 'Escape') { e.preventDefault(); close(); }
      else if (e.key === 'ArrowLeft') step(-1); else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'Tab') { const f = focusables(); if (!f.length) return; const a = f[0], z = f[f.length - 1];
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); } }
      return;
    }
    const c = e.target.closest && e.target.closest('.cert-card');
    if (c && c === e.target && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); open(c.dataset.name, c); }
  });
  grid.addEventListener('click', e => {
    if (e.target.closest('[data-skill-open]')) return;      /* skill chips keep their own behaviour */
    const c = e.target.closest('.cert-card'); if (c && c.dataset.name) open(c.dataset.name, c);
  });
  const deep = () => { const m = /^#cert=(.+)$/.exec(location.hash); if (!m) return; const n = decodeURIComponent(m[1]); if (byName[n]) { root.scrollIntoView(); setTimeout(() => open(n), 400); } };
  deep(); addEventListener('hashchange', deep);

  /* provider bars and domain legend in the insights block open the matching filter / search */
  $$('.cb-row').forEach(r => { const p = (r.querySelector('span') || {}).textContent; if (!p) return;
    r.style.cursor = 'pointer'; r.setAttribute('tabindex', '0'); r.setAttribute('role', 'button'); r.title = 'Show ' + p + ' certificates';
    const go = () => { const f = $('#ctFind'); f.value = p; refresh(); const t = $('.cert-tools'); t && t.scrollIntoView({behavior: 'smooth', block: 'center'}); };
    r.addEventListener('click', go); r.addEventListener('keydown', e => { if (e.key === 'Enter') go(); }); });

  App.certSheet = {open, close};
});
