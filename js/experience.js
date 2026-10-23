/* Experience v2 — overview stats, Gantt timeline and per-role detail all computed from window.PORTFOLIO
   (nothing hard-coded: new roles in data.js appear automatically, "Present" roles keep growing). */
App.register('experience-v2', () => {
  const D = App.data(), E = D.experience || [], sec = document.getElementById('experience');
  if (!sec || !E.length) return;
  const $ = (s, r = sec) => r.querySelector(s), $$ = (s, r = sec) => [...r.querySelectorAll(s)], esc = App.esc;
  const n = new Date(), nowM = n.getFullYear() + '-' + String(n.getMonth() + 1).padStart(2, '0');
  const mi = ym => { const [y, m] = ym.split('-').map(Number); return (y - 2022) * 12 + (m - 11); };
  const total = E.reduce((a, e) => a + App.months(e.start, e.end), 0);
  const onsite = E.filter(e => /on.?site/i.test(e.mode)).length;

  /* 1 · overview stats */
  const tiles = [[E.length, 'Roles'], [new Set(E.flatMap(e => e.stack)).size, 'Tools & technologies'], [total, 'Months on the job'], [onsite, 'On-site roles']];
  $$('.eo-stat').forEach((s, i) => { if (!tiles[i]) return; const b = $('b', s); b.dataset.count = tiles[i][0]; b.textContent = tiles[i][0]; $('span', s).textContent = tiles[i][1]; });

  /* 2 · Gantt, including the current role */
  const g = $('.gantt'), base = mi('2022-11'), span = Math.max(mi('2026-08'), mi(nowM)) - base + 1, pct = m => (m - base) / span * 100;
  if (g) {
    const yrs = []; for (let y = 2023; y <= n.getFullYear(); y++) yrs.push(`<span style="left:${pct(mi(y + '-01'))}%">${y}</span>`);
    $('.g-axis', g).innerHTML = yrs.join('');
    const edu = $('.g-edu', g); if (edu) edu.style.width = ((mi('2026-08') - base + 1) / span * 100) + '%';
    $$('.g-row', g).slice(1).forEach(r => r.remove());
    $('.g-rows', g).insertAdjacentHTML('beforeend', E.slice().sort((a, b) => a.start < b.start ? -1 : 1).map((e, i) => {
      const s = mi(e.start), l = pct(s), w = Math.max(2.4, (mi(e.end || nowM) - s + 1) / span * 100), left = l > 55;
      const pos = left ? 'right:' + (100 - l + .5) + '%' : 'left:' + (l + w + 1) + '%';
      return `<div class="g-row"><label>${esc(e.company.replace(/\s*Pvt\.?\s*Ltd\.?/i, ''))}</label><div class="g-track"><i class="g-bar ${['', 'g-b2', 'g-b3', 'g-b4'][i % 4]}${e.current ? ' xp-now' : ''}" style="left:${l}%;width:${w}%"></i><em class="g-lbl ${left ? 'g-left' : ''}" style="${pos}">${esc(e.role)} · ${esc(e.period.replace('Present', 'Now'))}</em></div></div>`;
    }).join(''));
  }

  /* 3 · per-role enhancement */
  const skills = Object.values(D.skills || {}).flat();
  const lvl = t => { const tl = t.toLowerCase(), m = skills.find(s => s.name.toLowerCase().includes(tl) || tl.includes(s.name.toLowerCase())); return m ? m.score : null; };
  $$('.exp-item').forEach(item => {
    const e = E.find(x => x.company === ($('.exp-company', item) || {}).textContent?.trim()); if (!e) return;
    const card = $('.exp-card', item), m = App.months(e.start, e.end), share = Math.round(m / total * 100);
    item.dataset.cur = e.current ? '1' : '0'; item.dataset.mode = /remote/i.test(e.mode) ? 'remote' : 'onsite';
    $('.exp-card-top', card).insertAdjacentHTML('afterend',
      `<div class="xp-ten"><span class="xp-badge${e.current ? ' live' : ''}">${e.current ? '<i></i>Ongoing' : 'Completed'}</span><strong>${App.duration(e.start, e.end)}</strong><div class="xp-share" role="img" aria-label="${share}% of total experience"><u style="width:${share}%"></u></div><small>${share}% of hands-on time</small></div>`);
    const tags = $('.exp-tags', card);
    if (!$('.exp-impact', card) && tags) tags.insertAdjacentHTML('beforebegin',
      `<div class="exp-impact"><div><i class="fas fa-clock"></i><b>${m} month${m > 1 ? 's' : ''}</b><span>${esc(e.period.replace('Present', 'Now'))}</span></div><div><i class="fas fa-building"></i><b>${/remote/i.test(e.mode) ? 'Remote' : 'On-site'}</b><span>${esc(e.mode.split('·').pop().trim())}</span></div><div><i class="fas fa-screwdriver-wrench"></i><b>${e.stack.length} tools</b><span>${esc(e.stack.slice(0, 2).join(' · '))}</span></div></div>`);
    const proof = e.stack.map(t => [t, lvl(t)]).filter(x => x[1] != null);
    if (proof.length === e.stack.length && tags) tags.hidden = true;
    if (proof.length && tags) tags.insertAdjacentHTML('beforebegin', '<div class="xp-proof"><small>Proficiency today</small>' + proof.map(p => `<span><b>${esc(p[0])}</b><i>${p[1]}%</i></span>`).join('') + '</div>');
    const items = $$('.exp-ach-item', card);
    if (items.length > 2) {
      items.slice(2).forEach(x => x.classList.add('xp-more'));
      const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'xp-toggle'; btn.setAttribute('aria-expanded', 'false');
      const label = o => o ? 'Show fewer highlights' : 'Show ' + (items.length - 2) + ' more highlights';
      btn.textContent = label(false);
      btn.onclick = () => { const o = card.classList.toggle('xp-open'); btn.setAttribute('aria-expanded', o); btn.textContent = label(o); };
      items[0].parentElement.after(btn);
    }
  });

  /* 4 · filter */
  const cont = $('.exp-container'), cnt = { all: E.length, cur: E.filter(e => e.current).length, onsite, remote: E.length - onsite };
  if (cont && !$('.xp-filter')) {
    cont.insertAdjacentHTML('beforebegin', '<div class="xp-filter" role="group" aria-label="Filter roles">' + [['all', 'All roles'], ['cur', 'Current'], ['onsite', 'On-site'], ['remote', 'Remote']].filter(f => cnt[f[0]]).map((f, i) => `<button type="button" class="${i ? '' : 'on'}" data-f="${f[0]}">${f[1]}<em>${cnt[f[0]]}</em></button>`).join('') + '</div>');
    $('.xp-filter').addEventListener('click', ev => {
      const b = ev.target.closest('button'); if (!b) return;
      $$('.xp-filter button').forEach(x => x.classList.toggle('on', x === b));
      $$('.exp-item').forEach(it => it.classList.toggle('xp-off', !(b.dataset.f === 'all' || (b.dataset.f === 'cur' ? it.dataset.cur === '1' : it.dataset.mode === b.dataset.f))));
    });
  }
});
