/* Edge blur controller — drives the top/bottom progressive blur from scroll position and velocity.
   Only writes two CSS variables per edge (transform-based → no layout, no repaint of the page). */
App.register('edge-blur', () => {
  if (document.getElementById('edgeTop')) return;
  const mk = (pos, id) => { const d = document.createElement('div'); d.id = id; d.className = 'edge-blur edge-' + pos; d.setAttribute('aria-hidden', 'true'); d.innerHTML = '<i></i><i></i><i></i><i></i><i></i><b></b>'; document.body.appendChild(d); return d; };
  const top = mk('top', 'edgeTop'), bot = mk('bottom', 'edgeBottom');
  const hero = document.querySelector('.hero-left'), still = matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  /* frame-rate independent smoothing: τ = time constant in ms (same feel at 30, 60 or 120 fps) */
  const ease = (c, t, tau, dt) => c + (t - c) * (1 - Math.exp(-dt / tau));
  let lastY = scrollY, lastT = performance.now(), v = 0, dir = 1, kT = 0, kB = 0, raf = 0;

  function frame(now) {
    raf = 0;
    const y = scrollY, max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    const rawDt = Math.max(1, now - lastT), dt = Math.min(rawDt, 120), speed = (y - lastY) / rawDt;  /* px per ms */
    lastY = y; lastT = now;
    if (speed) dir = speed > 0 ? 1 : -1;
    const target = still.matches ? 0 : clamp(Math.abs(speed) / 2.4, 0, 1);  /* ≈2.4 px/ms = fast flick */
    v = ease(v, target, target > v ? 50 : 230, dt);                          /* fast attack, slow release */
    kT = ease(kT, clamp(y / 90, 0, 1), 95, dt);                                 /* hidden at page top */
    kB = ease(kB, clamp((max - y) / 140, 0, 1), 95, dt);                        /* hidden at page end */
    top.style.setProperty('--k', kT.toFixed(3));  top.style.setProperty('--bst', (v * (dir > 0 ? 1 : .7)).toFixed(3));
    bot.style.setProperty('--k', kB.toFixed(3));  bot.style.setProperty('--bst', (v * (dir < 0 ? 1 : .7)).toFixed(3));
    if (hero && !still.matches) {                                           /* hero softens as it scrolls away */
      const px = y > 24 && y < innerHeight ? clamp((y - 24) / innerHeight * 10, 0, 7) : 0;
      hero.style.filter = px > .15 ? 'blur(' + px.toFixed(2) + 'px)' : '';
    }
    const settling = v > .004 || Math.abs(kT - clamp(y / 90, 0, 1)) > .003 || Math.abs(kB - clamp((max - y) / 140, 0, 1)) > .003;
    if (settling && !document.hidden) raf = requestAnimationFrame(frame);
  }
  const kick = () => { if (!raf) { lastT = performance.now(); raf = requestAnimationFrame(frame); } };
  App.onScroll(kick);
  addEventListener('resize', kick, {passive: true});
  document.addEventListener('visibilitychange', () => { if (!document.hidden) { lastY = scrollY; kick(); } });
  still.addEventListener?.('change', kick);
  kick();
});
