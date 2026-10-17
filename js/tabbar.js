/* ══════════════════════════════════════════════════════════════
   TAB BAR — active tab follows the section currently in view
   ──────────────────────────────────────────────────────────────
   • Only this file touches .nav-active / aria-current.
   • A section without its own tab (e.g. Education) keeps the
     closest previous visible tab highlighted.
   • Tabs hidden by CSS (small-phone dock) are skipped automatically.
   • Clicking a tab highlights it immediately and ignores the
     highlighting while the smooth scroll runs (until scrolling has
     paused for a moment), so the bar does not flicker through
     every tab on the way.
══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const tabs = Array.from(document.querySelectorAll('#navLinks .nav-link'));
  if (!tabs.length) return;

  const SCROLL_OFFSET = 140;                       // px below viewport top that counts as "in view"
  const sectionIds    = Array.from(document.querySelectorAll('section[id]')).map(s => s.id);
  const tabSection    = tabs.map(t => sectionIds.indexOf((t.getAttribute('href') || '').slice(1)));

  let current = null;
  let locked  = false;
  let lockTimer = 0;
  let ticking = false;

  const isVisible = el => el.getClientRects().length > 0;

  /** Index (in document order) of the section currently in view. */
  function currentSectionIndex() {
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    if (atBottom) return sectionIds.length - 1;

    let idx = 0;
    for (let i = 0; i < sectionIds.length; i++) {
      const el = document.getElementById(sectionIds[i]);
      if (el && el.getBoundingClientRect().top <= SCROLL_OFFSET) idx = i;
    }
    return idx;
  }

  /** Last visible tab whose section starts at or before the current one. */
  function tabFor(sectionIdx) {
    let chosen = null;
    tabs.forEach((tab, i) => {
      if (tabSection[i] !== -1 && tabSection[i] <= sectionIdx && isVisible(tab)) chosen = tab;
    });
    return chosen || tabs.find(isVisible) || tabs[0];
  }

  function setActive(tab) {
    if (tab === current) return;
    current = tab;
    tabs.forEach(t => {
      const on = t === tab;
      t.classList.toggle('nav-active', on);
      if (on) t.setAttribute('aria-current', 'true');
      else    t.removeAttribute('aria-current');
    });
  }

  function update() {
    if (!locked) setActive(tabFor(currentSectionIndex()));
  }

  function onScroll() {
    if (locked) { armUnlock(160); return; }        // still travelling to the clicked tab
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { ticking = false; update(); });
  }

  /* Unlock once no scroll event has arrived for `delay` ms. */
  function armUnlock(delay) {
    clearTimeout(lockTimer);
    lockTimer = setTimeout(() => { locked = false; update(); }, delay);
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      setActive(tab);
      locked = true;
      armUnlock(350);                              // covers the case where no scrolling happens
    });
  });

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => { current = null; update(); }, { passive: true });   // dock hides/shows tabs
  window.addEventListener('load', update);

  update();
})();
