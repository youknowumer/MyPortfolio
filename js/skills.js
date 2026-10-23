/* Skills & Expertise v2 — rebuilds the skill boxes from window.PORTFOLIO: level badge, ranked order,
   and "used in" evidence computed from real roles, projects and certifications. */
App.register('skills-v2', () => {
  const D = App.data(), host = document.getElementById('skills');
  if (!host || !D.skills) return;
  const $ = (s, r = host) => r.querySelector(s), $$ = (s, r = host) => [...r.querySelectorAll(s)];
  const lvl = v => v >= 85 ? ['Expert', 'x'] : v >= 75 ? ['Advanced', 'a'] : v >= 60 ? ['Proficient', 'p'] : ['Foundational', 'f'];

  /* keep the icons already designed in the markup */
  const icons = {};
  $$('.skill-pill').forEach(p => { const i = $('.skill-pill-icon', p); icons[$('.skill-pill-name', p).textContent.trim()] = {h: i.innerHTML, s: i.getAttribute('style') || ''}; });

  /* evidence sources */
  const src = [], pr = D.projects || {};
  (D.experience || []).forEach(e => src.push({l: e.company.replace(/\s*Pvt\.?\s*Ltd\.?/i, ''), t: [e.role, ...e.stack, ...e.highlights].join(' ').toLowerCase()}));
  [pr.featured, ...(pr.others || [])].filter(Boolean).forEach(p => src.push({l: p.title, t: [p.title, p.subtitle, p.summary].join(' ').toLowerCase()}));
  (D.certifications || []).forEach(c => src.push({l: c.name, t: (c.name + ' ' + c.provider).toLowerCase()}));
  const STOP = new Set(['erp', 'mgmt', 'management', 'platforms', 'platform', 'design', 'data', 'ms', 'adobe', 'basic', 'and']);
  const used = name => {
    const tk = name.toLowerCase().replace(/\(.*?\)/g, '').split(/[\s\/]+/).filter(t => t.length > 1 && !STOP.has(t));
    if (!tk.length) return [];
    const rx = t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const res = tk.map(t => new RegExp(t.length > 3 ? '\\b' + rx(t.replace(/\d+$/, '')) : '(^|[^a-z0-9])' + rx(t) + '($|[^a-z0-9])'));
    return src.filter(s => res.every(r => r.test(s.t))).map(s => s.l);
  };

  /* boxes */
  Object.entries(D.skills).forEach(([dom, list]) => {
    const grid = $('#tab-' + dom + ' .skills-grid'); if (!grid) return;
    grid.innerHTML = list.slice().sort((a, b) => b.score - a.score).map((s, i) => {
      const [L, k] = lvl(s.score), ic = icons[s.name] || {h: '<i class="fas fa-star"></i>', s: ''}, ev = [...new Set(used(s.name))];
      return `<article class="skill-pill sk-card" data-lv="${k}" style="--i:${i}">
        <div class="sk-top"><div class="skill-pill-icon" style="${App.esc(ic.s)}">${ic.h}</div><span class="sk-lvl">${L}</span></div>
        <div class="skill-pill-info"><span class="skill-pill-name">${App.esc(s.name)}</span>
          <span class="skill-pct"><b>${s.score}</b>%</span>
          <div class="skill-bar"><div class="skill-bar-fill" data-w="${s.score}"></div></div></div>
        <div class="sk-ev">${ev.length ? '<small>Used in</small>' + ev.slice(0, 2).map(e => '<span>' + App.esc(e) + '</span>').join('') + (ev.length > 2 ? '<span class="more">+' + (ev.length - 2) + '</span>' : '') : ''}</div>
      </article>`;
    }).join('');
  });

  /* tabs: current-role domain first, with live counts */
  const bar = $('.skills-tabs'), tabs = $$('.skills-tab');
  ['office', 'design', 'frontend', 'data', 'enterprise'].forEach(id => {
    const t = tabs.find(b => (b.getAttribute('onclick') || '').includes("'" + id + "'")); if (t) bar.prepend(t);
    if (t && D.skills[id] && !$('em', t)) t.insertAdjacentHTML('beforeend', '<em class="sk-n">' + D.skills[id].length + '</em>');
  });
  $$('.skills-panel').forEach(p => p.classList.toggle('active', p.id === 'tab-enterprise'));
  $$('.skills-tab').forEach(t => t.classList.toggle('active', (t.getAttribute('onclick') || '').includes("'enterprise'")));
  $$('#tab-enterprise .skill-bar-fill').forEach((b, i) => setTimeout(() => b.style.width = b.dataset.w + '%', 300 + i * 55));

  /* core stack strip — taken from the current role's stack */
  const cur = (D.experience || []).find(e => e.current), all = Object.values(D.skills).flat();
  if (cur && cur.stack.length && !$('.sk-core')) {
    const chips = cur.stack.map(t => {
      const tl = t.toLowerCase(), m = all.find(s => s.name.toLowerCase().includes(tl) || tl.includes(s.name.toLowerCase()));
      return `<span class="sk-chip"><b>${App.esc(t)}</b>${m ? '<i>' + m.score + '%</i>' : ''}</span>`;
    }).join('');
    bar.insertAdjacentHTML('beforebegin', `<div class="sk-core reveal"><div class="sk-core-l"><small>Current core stack</small><strong>${App.esc(cur.company)} · ${App.esc(cur.role)}</strong></div><div class="sk-core-c">${chips}</div></div>`);
    requestAnimationFrame(() => $('.sk-core').classList.add('visible', 'in'));
  }
});
