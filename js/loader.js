/**
 * Page Loader — Suraj Digital HQ
 * Elegant count-up loader with smooth curtain exit.
 * Runs before any content is visible.
 */

(function () {
  'use strict';

  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Create loader DOM ──────────────────────────────────────
  const loader = document.createElement('div');
  loader.id = 'page-loader';
  loader.className = 'loader';
  loader.setAttribute('aria-hidden', 'true');
  loader.innerHTML = `
    <div class="loader__panel"></div>
    <div class="loader__inner">
      <div class="loader__logo" id="loader-logo">S</div>
      <div class="loader__track" id="loader-track">
        <div class="loader__fill" id="loader-fill"></div>
      </div>
      <div class="loader__count" id="loader-count">0%</div>
    </div>
  `;
  document.body.insertBefore(loader, document.body.firstChild);

  if (REDUCED) {
    loader.remove();
    document.body.classList.add('is-loaded');
    triggerHeroReveal();
    return;
  }

  const logo   = document.getElementById('loader-logo');
  const track  = document.getElementById('loader-track');
  const fill   = document.getElementById('loader-fill');
  const count  = document.getElementById('loader-count');

  // ── Entrance ───────────────────────────────────────────────
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      logo.classList.add('is-shown');
      track.classList.add('is-shown');
      count.classList.add('is-shown');
    });
  });

  // ── Count-up animation ─────────────────────────────────────
  let progress  = 0;
  const target  = 100;
  const duration = 1600; // ms
  const startTime = performance.now();

  function easeInOutCubic(t) {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function tick(now) {
    const elapsed = now - startTime;
    const rawProgress = Math.min(elapsed / duration, 1);
    progress = Math.floor(easeInOutCubic(rawProgress) * target);

    fill.style.width  = progress + '%';
    count.textContent = progress + '%';

    if (progress < target) {
      requestAnimationFrame(tick);
    } else {
      fill.style.width  = '100%';
      count.textContent = '100%';
      // Short pause at 100% before exit
      setTimeout(exitLoader, 280);
    }
  }

  requestAnimationFrame(tick);

  // ── Exit: curtain slides up ────────────────────────────────
  function exitLoader() {
    loader.classList.add('is-exiting');
    document.body.classList.add('is-loaded');

    // Remove from DOM after transition completes
    setTimeout(() => {
      loader.style.display = 'none';
      triggerHeroReveal();
    }, 950);
  }

  // ── Trigger hero line reveals ──────────────────────────────
  function triggerHeroReveal() {
    const lines = document.querySelectorAll('.hero__headline-line .line-inner');
    lines.forEach((line, i) => {
      setTimeout(() => {
        line.classList.add('is-revealed');
      }, i * 140 + 200);
    });

    // Float headline after reveal
    setTimeout(() => {
      const headline = document.querySelector('.hero__headline');
      if (headline) headline.classList.add('is-floating');
    }, 2500);

    // Trigger eyebrow animations
    document.querySelectorAll('.section-eyebrow').forEach(el => {
      el.classList.add('is-visible');
    });
  }

})();
