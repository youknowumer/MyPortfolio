/* Experience — role rail + detail panels.
   The markup is static (so it works without JS and stays indexable); this file turns it into tabs and keeps the
   numbers honest: time in role, share bars and the "Present" role are recomputed from window.PORTFOLIO every visit. */
App.register('experience-v2', () => {
  const root = document.querySelector('#experience [data-career]');
  if (!root) return;
  const $$ = (s, r = root) => [...r.querySelectorAll(s)];
  const tabs = $$('[role="tab"]'), panels = $$('[role="tabpanel"]'), list = root.querySelector('[role="tablist"]');
  if (!tabs.length || tabs.length !== panels.length) return;

  /* 1 · keep durations, share bars and the summary in step with the data */
  const E = App.data().experience || [];
  const total = E.reduce((a, e) => a + App.months(e.start, e.end), 0);
  const skills = Object.values(App.data().skills || {}).flat();
  const score = t => {
    const k = t.toLowerCase(), m = skills.find(s => s.name.toLowerCase().includes(k) || k.includes(s.name.toLowerCase()));
    return m ? Math.round(m.score) : null;
  };
  panels.forEach((panel, i) => {
    const name = (panel.querySelector('.xp-company') || {}).textContent;
    const e = E.find(x => x.company === (name || '').trim());
    if (!e) return;
    const dur = panel.querySelector('.xp-dur'); if (dur) dur.textContent = App.duration(e.start, e.end);
    tabs[i].style.setProperty('--w', Math.round(App.months(e.start, e.end) / total * 100) + '%');
    let shown = 0;
    $$('.xp-tool', panel).forEach(li => {
      const s = score(li.textContent.trim());
      if (s != null) { li.insertAdjacentHTML('beforeend', `<b>${s}%</b>`); shown++; }
    });
    if (shown) panel.querySelector('.xp-tools').insertAdjacentHTML('afterend', '<p class="xp-note">Percentages are my current skill scores.</p>');
  });
  const t = root.querySelector('[data-xp-total]'), r = root.querySelector('[data-xp-roles]');
  if (t) t.textContent = total; if (r) r.textContent = E.length;

  /* 2 · tabs */
  /* the stage is as tall as the active panel, so a short role never leaves a hole and switching glides instead of jumping */
  const stage = root.querySelector('.career-stage');
  const fit = () => { stage.style.height = panels.find(p => p.classList.contains('is-active')).offsetHeight + 'px'; };
  if ('ResizeObserver' in window) { const ro = new ResizeObserver(fit); panels.forEach(p => ro.observe(p)); }
  addEventListener('resize', fit);

  const mq = matchMedia('(max-width:960px)');
  const orient = () => list.setAttribute('aria-orientation', mq.matches ? 'horizontal' : 'vertical');
  orient(); (mq.addEventListener ? mq.addEventListener('change', orient) : mq.addListener(orient));

  const select = (i, focus) => {
    tabs.forEach((tab, n) => {
      const on = n === i;
      tab.setAttribute('aria-selected', on); tab.tabIndex = on ? 0 : -1;
      panels[n].classList.toggle('is-active', on);
    });
    if (list.scrollWidth > list.clientWidth) {          /* horizontal strip on small screens */
      const tab = tabs[i];
      list.scrollTo({ left: tab.offsetLeft - (list.clientWidth - tab.offsetWidth) / 2, behavior: matchMedia('(prefers-reduced-motion:reduce)').matches ? 'auto' : 'smooth' });
    }
    fit();
    if (focus) tabs[i].focus({ preventScroll: true });
  };
  tabs.forEach((tab, i) => tab.addEventListener('click', () => select(i)));
  list.addEventListener('keydown', ev => {
    const cur = tabs.indexOf(document.activeElement); if (cur < 0) return;
    const k = ev.key, n = tabs.length;
    const next = k === 'ArrowDown' || k === 'ArrowRight' ? (cur + 1) % n
               : k === 'ArrowUp' || k === 'ArrowLeft' ? (cur - 1 + n) % n
               : k === 'Home' ? 0 : k === 'End' ? n - 1 : -1;
    if (next < 0) return;
    ev.preventDefault(); select(next, true);
  });
  root.classList.add('is-on'); fit();
});
