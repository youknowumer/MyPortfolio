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
  const LV = {f: 'Foundational', p: 'Proficient', a: 'Advanced', x: 'Expert'};

  /* proficiency scale legend */
  if (!$('.sk-legend')) {
    $('.skills-tabs').insertAdjacentHTML('afterend', '<div class="sk-legend" aria-label="Proficiency scale"><span class="sk-legend-t">Proficiency scale</span>' +
      [['f', 'Foundational', 'under 60'], ['p', 'Proficient', '60–74'], ['a', 'Advanced', '75–84'], ['x', 'Expert', '85+']]
        .map(([k, n, r]) => `<span class="sk-legend-i" data-lv="${k}"><i></i><b>${n}</b><em>${r}</em></span>`).join('') + '</div>');
  }

  /* boxes */
  Object.entries(D.skills).forEach(([dom, list]) => {
    const grid = $('#tab-' + dom + ' .skills-grid'); if (!grid) return;
    const sorted = list.slice().sort((a, b) => b.score - a.score);
    grid.innerHTML = sorted.map((s, i) => {
      const [L, k] = lvl(s.score), ic = icons[s.name] || {h: '<i class="fas fa-star"></i>', s: ''}, ev = [...new Set(used(s.name))];
      const chips = ev.length
        ? '<small>Applied in</small>' + '<span title="' + App.esc(ev.join(' · ')) + '">' + App.esc(ev[0]) + '</span>' + (ev.length > 1 ? '<span class="more" title="' + App.esc(ev.slice(1).join(' · ')) + '">+' + (ev.length - 1) + '</span>' : '')
        : '<small>Applied in</small><span class="none">Core toolkit skill</span>';
      return `<article class="skill-pill sk-card" data-lv="${k}" style="--i:${i}">
        <div class="sk-head">
          <div class="skill-pill-icon" style="${App.esc(ic.s)}">${ic.h}</div>
          <div class="sk-id"><span class="skill-pill-name" title="${App.esc(s.name)}">${App.esc(s.name)}</span><span class="sk-sub">${App.esc(SUB[s.name] || '')}</span></div>
        </div>
        <div class="sk-score"><span class="sk-lvl">${L}</span><span class="skill-pct"><b>${s.score}</b><small>%</small></span></div>
        <div class="sk-meter" role="img" aria-label="${App.esc(s.name)}: ${s.score} percent, ${L}">
          <div class="skill-bar"><div class="skill-bar-fill" data-w="${s.score}"></div></div>
          <i style="left:60%"></i><i style="left:75%"></i><i style="left:85%"></i>
        </div>
        <div class="sk-ev">${chips}</div>
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
