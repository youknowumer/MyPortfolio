/* Skills & Expertise v3 — rebuilds the skill boxes from window.PORTFOLIO: level badge, ranked order,
   "applied in" evidence computed from real roles, projects and certifications, plus:
   · drill-in sheet per skill (every role / project / certification where it was used, next-level gap, prev/next, related skills)
   · "All Skills" tab with live search
   · clickable proficiency legend (spotlights a level)
   · summary strip, and skill tags elsewhere on the page that open the same sheet. */
App.register('skills-v3', () => {
  const D = App.data(), host = document.getElementById('skills');
  if (!host || !D.skills) return;
  const $ = (s, r = host) => r.querySelector(s), $$ = (s, r = host) => [...r.querySelectorAll(s)];
  const lvl = v => v >= 85 ? ['Expert', 'x'] : v >= 75 ? ['Advanced', 'a'] : v >= 60 ? ['Proficient', 'p'] : ['Foundational', 'f'];
  const DOM = {frontend: 'Frontend & Web', data: 'Data & BI', enterprise: 'Enterprise Systems', design: 'Design & Creative', office: 'Productivity'};
  const DOMS = {frontend: 'Frontend', data: 'Data & BI', enterprise: 'Enterprise', design: 'Design', office: 'Productivity'};
  const KIND = {role: ['Roles', 'fa-briefcase'], project: ['Projects', 'fa-rocket'], cert: ['Certifications', 'fa-certificate']};

  /* keep the icons already designed in the markup */
  const icons = {};
  $$('.skill-pill').forEach(p => { const i = $('.skill-pill-icon', p); if (i) icons[$('.skill-pill-name', p).textContent.trim()] = {h: i.innerHTML, s: i.getAttribute('style') || ''}; });

  /* evidence sources — typed, so the drill-in can group and explain them */
  const src = [], pr = D.projects || {};
  (D.experience || []).forEach(e => src.push({
    k: 'role', l: e.company.replace(/\s*Pvt\.?\s*Ltd\.?/i, ''), sub: e.role, meta: e.period, hl: e.highlights || [],
    t: [e.role, ...e.stack, ...e.highlights].join(' ').toLowerCase()
  }));
  [pr.featured, ...(pr.others || [])].filter(Boolean).forEach(p => src.push({
    k: 'project', l: p.title, sub: p.subtitle || (p.stack || []).join(' · '), meta: p.award || '', hl: [p.summary],
    t: [p.title, p.subtitle, p.summary].join(' ').toLowerCase()
  }));
  (D.certifications || []).forEach(c => src.push({
    k: 'cert', l: c.name, sub: c.provider, meta: c.issuedLabel, hl: [], t: (c.name + ' ' + c.provider).toLowerCase()
  }));
  const STOP = new Set(['erp', 'mgmt', 'management', 'platforms', 'platform', 'design', 'data', 'ms', 'adobe', 'basic', 'and']);
  const rx = t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const matcher = name => {
    const tk = name.toLowerCase().replace(/\(.*?\)/g, '').split(/[\s\/]+/).filter(t => t.length > 1 && !STOP.has(t));
    if (!tk.length) return null;
    const res = tk.map(t => new RegExp(t.length > 3 ? '\\b' + rx(t.replace(/\d+$/, '')) : '(^|[^a-z0-9])' + rx(t) + '($|[^a-z0-9])'));
    return text => res.every(r => r.test(text));
  };
  const evidence = name => { const m = matcher(name); return m ? src.filter(s => m(s.t)) : []; };

  /* one-line descriptors — what each skill is used for */
  const SUB = {
    'HTML5': 'Semantic markup', 'CSS3': 'Layout & styling', 'JavaScript': 'Interactive interfaces', 'WordPress': 'Website building',
    'GitHub': 'Version control & PRs', 'Python': 'Scripting & automation', 'C++': 'Programming basics', 'Responsive Design': 'Any screen size',
    'SQL': 'Queries & joins', 'Oracle DB': 'Schemas & HR data', 'Power BI': 'DAX & KPI dashboards', 'IBM SPSS': 'Statistical analysis',
    'Data Annotation': 'CVAT · YOLO · COCO', 'ER Diagram Design': 'ER & data modelling',
    'Odoo ERP': 'Implement & customise', 'SAP ERP': 'FI · CO · SCM', 'CRM Platforms': 'Customer pipelines', 'JIRA / Scrum': 'Agile delivery',
    'Inventory Mgmt': 'Stock & supply flow', 'HR Management': 'Talent & payroll data',
    'Adobe Illustrator': 'Vector & brand assets', 'Adobe Photoshop': 'Image & UI graphics', 'Premiere Pro': 'Video editing', 'After Effects': 'Motion graphics',
    'Figma': 'UI design & specs', 'Canva': 'Rapid graphic design', 'Adobe Audition': 'Audio editing', 'Draw.io': 'Process diagrams',
    'MS Excel': 'Analysis & reporting', 'MS Word': 'Documentation', 'PowerPoint': 'Presentations', 'MS Access': 'Desktop databases',
    'MS Project': 'Plans & schedules', 'Social Media Mgmt': 'Content & community', 'Brand Marketing': 'Brand positioning', 'Customer Service': 'Support & empathy'
  };

  /* flat, ranked model */
  const model = {}, order = {};
  Object.entries(D.skills).forEach(([dom, list]) => {
    order[dom] = list.slice().sort((a, b) => b.score - a.score).map(s => s.name);
    list.forEach(s => { model[s.name] = {name: s.name, score: s.score, dom, ev: evidence(s.name)}; });
  });
  const all = Object.values(model).sort((a, b) => b.score - a.score);

  /* ───────────────────────── cards ───────────────────────── */
  const card = (s, i, showDom) => {
    const [L, k] = lvl(s.score), ic = icons[s.name] || {h: '<i class="fas fa-star"></i>', s: ''}, ev = [...new Set(s.ev.map(e => e.l))];
    const chips = ev.length
      ? '<small>Applied in</small><span title="' + App.esc(ev[0]) + '">' + App.esc(ev[0]) + '</span>' +
        (ev.length > 1 ? '<span class="more" title="' + App.esc(ev.slice(1).join(' · ')) + '">+' + (ev.length - 1) + '</span>' : '')
      : '<small>Applied in</small><span class="none">Core toolkit skill</span>';
    return `<article class="skill-pill sk-card" data-lv="${k}" data-name="${App.esc(s.name)}" data-dom="${s.dom}" tabindex="0" role="button"
        aria-label="${App.esc(s.name)}, ${s.score} percent, ${L}. Open details" style="--i:${i}">
      <div class="sk-head">
        <div class="skill-pill-icon" style="${App.esc(ic.s)}">${ic.h}</div>
        <div class="sk-id"><span class="skill-pill-name" title="${App.esc(s.name)}">${App.esc(s.name)}</span><span class="sk-sub">${App.esc(SUB[s.name] || '')}</span></div>
      </div>
      <div class="sk-score"><span class="sk-lvl">${L}</span>${showDom ? '<span class="sk-dom">' + App.esc(DOMS[s.dom]) + '</span>' : ''}<span class="skill-pct"><b>${s.score}</b><small>%</small></span></div>
      <div class="sk-meter" role="img" aria-label="${App.esc(s.name)}: ${s.score} percent, ${L}">
        <div class="skill-bar"><div class="skill-bar-fill" data-w="${s.score}"></div></div>
        <i style="left:60%"></i><i style="left:75%"></i><i style="left:85%"></i>
      </div>
      <div class="sk-ev">${chips}<em class="sk-open">Drill in <i class="fas fa-arrow-right"></i></em></div>
    </article>`;
  };

  /* proficiency scale legend — now doubles as a level spotlight */
  if (!$('.sk-legend')) {
    $('.skills-tabs').insertAdjacentHTML('afterend', '<div class="sk-legend" aria-label="Proficiency scale"><span class="sk-legend-t">Proficiency scale</span>' +
      [['f', 'Foundational', 'under 60'], ['p', 'Proficient', '60–74'], ['a', 'Advanced', '75–84'], ['x', 'Expert', '85+']]
        .map(([k, n, r]) => `<button type="button" class="sk-legend-i" data-lv="${k}" aria-pressed="false" title="Highlight ${n} skills"><i></i><b>${n}</b><em>${r}</em></button>`).join('') + '</div>');
  }
  $('.sk-legend').addEventListener('click', e => {
    const b = e.target.closest('.sk-legend-i'); if (!b) return;
    const on = host.dataset.f !== b.dataset.lv;
    if (on) host.dataset.f = b.dataset.lv; else delete host.dataset.f;
    $$('.sk-legend-i').forEach(x => x.setAttribute('aria-pressed', String(on && x === b)));
  });

  /* domain panels */
  Object.entries(D.skills).forEach(([dom]) => {
    const grid = $('#tab-' + dom + ' .skills-grid'); if (!grid) return;
    grid.innerHTML = order[dom].map((n, i) => card(model[n], i, false)).join('');
  });

  /* "All Skills" tab + search */
  const bar = $('.skills-tabs'), tabs = $$('.skills-tab');
  if (!$('#tab-all')) {
    const last = $$('.skills-panel').pop();
    last.insertAdjacentHTML('afterend', `<div class="skills-panel" id="tab-all">
      <div class="sk-find"><i class="fas fa-magnifying-glass" aria-hidden="true"></i>
        <input type="search" id="skFind" placeholder="Search all ${all.length} skills — name, domain or where it was used" aria-label="Search skills" autocomplete="off">
        <span class="sk-find-n" id="skFindN" aria-live="polite"></span></div>
      <div class="skills-grid">${all.map((s, i) => card(s, i, true)).join('')}</div>
      <p class="sk-empty" hidden>No skill matches that search.</p></div>`);
    bar.insertAdjacentHTML('beforeend', `<button class="skills-tab" onclick="showTab('all')"><i class="fas fa-layer-group" style="margin-right:.4rem"></i>All Skills<em class="sk-n">${all.length}</em></button>`);
    const inp = $('#skFind'), n = $('#skFindN'), empty = $('#tab-all .sk-empty');
    const hay = {}; $$('#tab-all .sk-card').forEach(c => { const s = model[c.dataset.name]; hay[s.name] = [s.name, SUB[s.name] || '', DOM[s.dom], lvl(s.score)[0], ...s.ev.map(e => e.l)].join(' ').toLowerCase(); });
    const run = () => {
      const q = inp.value.trim().toLowerCase(), parts = q.split(/\s+/).filter(Boolean); let c = 0;
      $$('#tab-all .sk-card').forEach(el => { const hit = parts.every(p => hay[el.dataset.name].includes(p)); el.classList.toggle('sk-off', !hit); if (hit) c++; });
      n.textContent = q ? c + ' of ' + all.length : ''; empty.hidden = c > 0;
    };
    inp.addEventListener('input', run);
  }

  /* tabs: current-role domain first, with live counts */
  ['office', 'design', 'frontend', 'data', 'enterprise'].forEach(id => {
    const t = tabs.find(b => (b.getAttribute('onclick') || '').includes("'" + id + "'")); if (t) bar.prepend(t);
    if (t && D.skills[id] && !$('em', t)) t.insertAdjacentHTML('beforeend', '<em class="sk-n">' + D.skills[id].length + '</em>');
  });
  $$('.skills-panel').forEach(p => p.classList.toggle('active', p.id === 'tab-enterprise'));
  $$('.skills-tab').forEach(t => t.classList.toggle('active', (t.getAttribute('onclick') || '').includes("'enterprise'")));
  $$('#tab-enterprise .skill-bar-fill').forEach((b, i) => setTimeout(() => b.style.width = b.dataset.w + '%', 300 + i * 55));

  /* core stack strip — taken from the current role's stack; chips open the drill-in when they map to a skill */
  const cur = (D.experience || []).find(e => e.current);
  const findSkill = t => {
    const tl = t.toLowerCase().replace(/\d+%/g, '').trim(); if (tl.length < 3) return null;
    return all.find(s => s.name.toLowerCase() === tl) || all.find(s => s.name.toLowerCase().includes(tl) || (s.name.length > 3 && tl.includes(s.name.toLowerCase()))) || null;
  };
  if (cur && cur.stack.length && !$('.sk-core')) {
    const chips = cur.stack.map(t => {
      const m = findSkill(t);
      return m ? `<button type="button" class="sk-chip sk-chip-b" data-open="${App.esc(m.name)}" title="Drill into ${App.esc(m.name)}"><b>${App.esc(t)}</b><i>${m.score}%</i></button>`
               : `<span class="sk-chip"><b>${App.esc(t)}</b></span>`;
    }).join('');
    bar.insertAdjacentHTML('beforebegin', `<div class="sk-core reveal"><div class="sk-core-l"><small>Current core stack</small><strong>${App.esc(cur.company)} · ${App.esc(cur.role)}</strong></div><div class="sk-core-c">${chips}</div></div>`);
    requestAnimationFrame(() => $('.sk-core').classList.add('visible', 'in'));
  }

  /* summary strip */
  if (!$('.sk-sum')) {
    const experts = all.filter(s => s.score >= 85).length, avg = Math.round(all.reduce((a, s) => a + s.score, 0) / all.length), top = all[0];
    const proven = all.filter(s => s.ev.length).length;
    bar.insertAdjacentHTML('beforebegin', `<div class="sk-sum reveal" aria-label="Skills at a glance">
      <div><b>${all.length}</b><span>Skills tracked</span></div>
      <div><b>${Object.keys(DOM).length}</b><span>Domains</span></div>
      <div><b>${experts}</b><span>Expert level (85+)</span></div>
      <div><b>${avg}%</b><span>Average score</span></div>
      <div><b>${proven}</b><span>Backed by real work</span></div>
      <button type="button" data-open="${App.esc(top.name)}"><span>Top skill</span><b>${App.esc(top.name)} · ${top.score}%</b></button></div>`);
    requestAnimationFrame(() => $('.sk-sum').classList.add('visible', 'in'));
  }

  /* ───────────────────────── drill-in sheet ───────────────────────── */
  const sheet = document.createElement('div');
  sheet.className = 'sks'; sheet.setAttribute('role', 'dialog'); sheet.setAttribute('aria-modal', 'true'); sheet.setAttribute('aria-labelledby', 'sksT');
  sheet.innerHTML = '<div class="sks-back" data-close></div><div class="sks-panel" tabindex="-1"></div>';
  document.body.appendChild(sheet);
  const panel = $('.sks-panel', sheet);
  let current = null, lastFocus = null;

  const snippet = (s, ev) => {
    const m = matcher(s.name); if (!m || !ev.hl.length) return '';
    return ev.hl.find(h => m(h.toLowerCase())) || '';
  };
  const render = name => {
    const s = model[name]; if (!s) return;
    current = name;
    const [L, k] = lvl(s.score), ic = icons[name] || {h: '<i class="fas fa-star"></i>', s: ''};
    const sib = order[s.dom], idx = sib.indexOf(name);
    const nextT = s.score < 60 ? [60, 'Proficient'] : s.score < 75 ? [75, 'Advanced'] : s.score < 85 ? [85, 'Expert'] : null;
    const gap = nextT ? `<b>${Math.ceil(nextT[0] - s.score)} points</b> to reach ${nextT[1]} (${nextT[0]}%)` : 'Top tier on this scale';
    const groups = ['role', 'project', 'cert'].map(kind => {
      const items = s.ev.filter(e => e.k === kind); if (!items.length) return '';
      return `<div class="sks-g"><h4><i class="fas ${KIND[kind][1]}"></i>${KIND[kind][0]}<em>${items.length}</em></h4>` + items.map(e => {
        const sn = snippet(s, e);
        return `<div class="sks-e"><div class="sks-e-h"><strong>${App.esc(e.l)}</strong>${e.meta ? '<span>' + App.esc(e.meta) + '</span>' : ''}</div>` +
          (e.sub ? `<div class="sks-e-s">${App.esc(e.sub)}</div>` : '') + (sn ? `<p>${App.esc(sn)}</p>` : '') + '</div>';
      }).join('') + '</div>';
    }).join('');
    const rel = sib.filter(n => n !== name).map(n => `<button type="button" class="sks-r" data-open="${App.esc(n)}"><b>${App.esc(n)}</b><i>${model[n].score}%</i></button>`).join('');
    panel.dataset.lv = k;
    panel.innerHTML = `<button type="button" class="sks-x" data-close aria-label="Close details"><i class="fas fa-xmark"></i></button>
      <div class="sks-nav"><button type="button" data-step="-1" aria-label="Previous skill" ${idx === 0 ? 'disabled' : ''}><i class="fas fa-chevron-left"></i></button>
        <span>${App.esc(DOM[s.dom])} · ${idx + 1} of ${sib.length}</span>
        <button type="button" data-step="1" aria-label="Next skill" ${idx === sib.length - 1 ? 'disabled' : ''}><i class="fas fa-chevron-right"></i></button></div>
      <div class="sks-head"><div class="skill-pill-icon sks-ic" style="${App.esc(ic.s)}">${ic.h}</div>
        <div><h3 id="sksT">${App.esc(name)}</h3><p>${App.esc(SUB[name] || '')}</p></div></div>
      <div class="sks-score"><span class="sk-lvl">${L}</span><span class="sks-pct"><b>${s.score}</b>%</span></div>
      <div class="sks-meter"><div class="sks-fill" style="--w:${s.score}%"></div><i style="left:60%"></i><i style="left:75%"></i><i style="left:85%"></i></div>
      <p class="sks-gap">${gap}</p>
      <div class="sks-body"><div class="sks-h"><h4>Where I've applied it</h4><span>${s.ev.length ? s.ev.length + ' place' + (s.ev.length > 1 ? 's' : '') : 'Core toolkit'}</span></div>
        ${groups || '<p class="sks-none">A core toolkit skill — used day to day across my work and studies rather than tied to one named role, project or certificate.</p>'}</div>
      ${rel ? `<div class="sks-rel"><h4>More in ${App.esc(DOM[s.dom])}</h4><div>${rel}</div></div>` : ''}`;
    panel.scrollTop = 0;
  };
  const focusables = () => [...panel.querySelectorAll('button:not([disabled])')];
  const open = (name, trigger) => {
    if (!model[name]) return;
    if (!sheet.classList.contains('open')) { lastFocus = trigger || document.activeElement; document.body.style.overflow = 'hidden'; }
    render(name); sheet.classList.add('open');
    requestAnimationFrame(() => { sheet.classList.add('on'); const x = $('.sks-x', panel); if (x) x.focus({preventScroll: true}); });
  };
  const close = () => {
    if (!sheet.classList.contains('open')) return;
    sheet.classList.remove('on'); document.body.style.overflow = '';
    setTimeout(() => sheet.classList.remove('open'), 240);
    if (lastFocus && lastFocus.focus) lastFocus.focus({preventScroll: true});
  };
  const step = d => { const sib = order[model[current].dom], n = sib[sib.indexOf(current) + d]; if (n) render(n), focusables().find(b => b.dataset.step === String(d)) ?.focus({preventScroll: true}); };

  sheet.addEventListener('click', e => {
    if (e.target.closest('[data-close]')) return close();
    const st = e.target.closest('[data-step]'); if (st) return step(+st.dataset.step);
    const o = e.target.closest('[data-open]'); if (o) open(o.dataset.open);
  });
  document.addEventListener('keydown', e => {
    if (!sheet.classList.contains('open')) return;
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    else if (e.key === 'ArrowLeft') step(-1);
    else if (e.key === 'ArrowRight') step(1);
    else if (e.key === 'Tab') {
      const f = focusables(); if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* triggers: cards, strip chips, summary tile, and skill tags elsewhere on the page */
  host.addEventListener('click', e => {
    const o = e.target.closest('[data-open]'); if (o) return open(o.dataset.open, o);
    const c = e.target.closest('.sk-card'); if (c) open(c.dataset.name, c);
  });
  host.addEventListener('keydown', e => {
    const c = e.target.closest && e.target.closest('.sk-card');
    if (c && c === e.target && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); open(c.dataset.name, c); }
  });

  /* project / experience tags that name a real skill become entry points into it */
  $$('.exp-tag, .proj-tag, .xp-tool', document).forEach(el => {
    const m = findSkill((el.firstChild && el.firstChild.nodeType === 3 ? el.firstChild.textContent : el.textContent));
    if (!m) return;
    el.classList.add('sk-link'); el.setAttribute('tabindex', '0'); el.setAttribute('role', 'button');
    el.setAttribute('title', 'See where ' + m.name + ' is applied'); el.dataset.skill = m.name;
  });
  document.addEventListener('click', e => { const t = e.target.closest && e.target.closest('.sk-link'); if (t) open(t.dataset.skill, t); });
  document.addEventListener('keydown', e => {
    const t = e.target.classList && e.target.classList.contains('sk-link') ? e.target : null;
    if (t && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); open(t.dataset.skill, t); }
  });

  /* domain rows in the analytics block jump to that tab */
  $$('.sd-row', document).forEach(row => {
    const label = ($('.sd-h span', row) || {}).textContent || '', dom = Object.keys(DOM).find(k => DOM[k] === label.trim());
    if (!dom) return;
    row.style.cursor = 'pointer'; row.setAttribute('tabindex', '0'); row.setAttribute('role', 'button'); row.title = 'Open ' + DOM[dom];
    const go = () => { const t = $$('.skills-tab').find(b => (b.getAttribute('onclick') || '').includes("'" + dom + "'")); if (t) { t.click(); const tb = $('.skills-tabs'); tb && tb.scrollIntoView({behavior: 'smooth', block: 'center'}); } };
    row.addEventListener('click', go); row.addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
  });

  /* certification cards list the skills they back — each chip opens that skill */
  $$('.cert-card', document).forEach(c => {
    const nm = ((c.querySelector('.cert-name') || {}).textContent || '').trim(), info = c.querySelector('.cert-info');
    if (!nm || !info || info.querySelector('.cert-skills')) return;
    const list = all.filter(s => s.ev.some(e => e.k === 'cert' && e.l === nm)).slice(0, 4);
    if (!list.length) return;
    info.insertAdjacentHTML('beforeend', '<div class="cert-skills"><small>Builds</small>' +
      list.map(s => `<button type="button" class="cert-sk" data-skill-open="${App.esc(s.name)}" title="See where ${App.esc(s.name)} is applied">${App.esc(s.name)}</button>`).join('') + '</div>');
  });
  document.addEventListener('click', e => { const b = e.target.closest && e.target.closest('[data-skill-open]'); if (b) open(b.dataset.skillOpen, b); });

  App.skillSheet = {open, close};
});
