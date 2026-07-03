/**
 * Animations — Suraj Digital HQ
 * Handles: scroll-triggered reveals, counter animation, progress bars
 */

(function () {
  'use strict';

  // ── Reduce motion check ───────────────────────────────────────────
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Intersection Observer for .reveal elements ────────────────────
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -60px 0px', threshold: 0.05 }
  );

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // ── Lab progress bar observer ─────────────────────────────────────
  const labObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          labObserver.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px', threshold: 0.3 }
  );

  document.querySelectorAll('.lab-card').forEach(el => labObserver.observe(el));

  // ── Process step observer ─────────────────────────────────────────
  const processObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    },
    { rootMargin: '0px 0px -80px 0px', threshold: 0.2 }
  );

  document.querySelectorAll('.process-step').forEach(el => processObserver.observe(el));

  // ── Cursor glow (desktop only, subtle) ────────────────────────────
  if (!prefersReduced && window.matchMedia('(pointer: fine)').matches) {
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    glow.setAttribute('aria-hidden', 'true');
    document.body.appendChild(glow);

    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;
    let raf;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateCursor() {
      const dx = mouseX - glowX;
      const dy = mouseY - glowY;
      glowX += dx * 0.08;
      glowY += dy * 0.08;
      glow.style.transform = `translate(${glowX}px, ${glowY}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(animateCursor);
    }

    animateCursor();

    // Pause when not hovering
    document.addEventListener('mouseleave', () => glow.style.opacity = '0');
    document.addEventListener('mouseenter', () => glow.style.opacity = '');
  }

  // ── Stack pipeline stagger ────────────────────────────────────────
  const stackObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const cards = entry.target.querySelectorAll('.stack-node__card');
          cards.forEach((card, i) => {
            setTimeout(() => {
              card.classList.add('is-visible');
            }, i * 100);
          });
          stackObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  const pipeline = document.querySelector('.stack__pipeline');
  if (pipeline) stackObserver.observe(pipeline);

  // ── Add style for cursor glow ─────────────────────────────────────
  if (!prefersReduced) {
    const style = document.createElement('style');
    style.textContent = `
      .cursor-glow {
        position: fixed;
        top: 0;
        left: 0;
        width: 400px;
        height: 400px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(124,110,247,0.06) 0%, transparent 60%);
        pointer-events: none;
        z-index: 0;
        transition: opacity 0.3s ease;
        will-change: transform;
      }
    `;
    document.head.appendChild(style);
  }

  // ── Hero parallax (subtle) ────────────────────────────────────────
  if (!prefersReduced) {
    const orbs = document.querySelectorAll('.hero__orb');

    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      orbs.forEach((orb, i) => {
        const speed = (i + 1) * 0.15;
        orb.style.transform = `translateY(${y * speed}px)`;
      });
    }, { passive: true });
  }

})();
