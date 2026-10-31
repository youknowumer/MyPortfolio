/* Welcome card — numbers come from window.PORTFOLIO; click, Skip, Enter or Esc dismiss it early. */
App.register('welcome', () => {
  const ov = document.getElementById('welcome'); if (!ov) return;
  const st = App.stats();
  const set = {certs: st.certs, skills: st.skills, roles: st.roles};
  ov.querySelectorAll('[data-w]').forEach(el => { if (set[el.dataset.w] != null) el.textContent = set[el.dataset.w]; });
  const prev = document.body.style.overflow; document.body.style.overflow = 'hidden';
  let gone = false;
  const done = () => { if (gone) return; gone = true; document.body.style.overflow = prev; removeEventListener('keydown', key); };
  const dismiss = () => {
    if (ov.classList.contains('is-out')) return;
    ov.classList.add('is-out'); setTimeout(done, 460);
  };
  const key = e => { if (e.key === 'Escape' || e.key === 'Enter') dismiss(); };
  addEventListener('keydown', key);
  ov.addEventListener('click', dismiss);
  ov.addEventListener('animationend', e => { if (e.animationName === 'wOut') done(); });
  setTimeout(done, 5400);
  const sk = document.getElementById('wSkip'); if (sk) sk.focus({preventScroll: true});
});

/* Hero numbers follow the data instead of going stale */
App.register('live-hero-stats', () => {
  const st = App.stats();
  document.querySelectorAll('.hero-stat').forEach(box => {
    const lbl = (box.querySelector('.hero-stat-lbl') || {}).textContent || '', n = box.querySelector('.hero-stat-num'); if (!n) return;
    let v = null, dec = 0;
    if (/years experience/i.test(lbl)) { v = Math.round(st.totalMonths / 12 * 10) / 10; dec = 1; }
    else if (/certifications/i.test(lbl)) v = st.certs;
    if (v == null) return;
    n.dataset.count = v; n.dataset.dec = dec; n.textContent = v.toFixed(dec);
  });
});
