/**
 * Navigation — Suraj Digital HQ
 * Handles: scroll detection, mobile drawer, active link
 */

(function () {
  'use strict';

  const nav     = document.getElementById('nav');
  const toggle  = document.getElementById('nav-toggle');
  const drawer  = document.getElementById('nav-drawer');
  const drawerLinks = document.querySelectorAll('.nav__drawer-link');

  if (!nav) return;

  // ── Scroll detection ──────────────────────────────────────────────
  let scrollTicking = false;

  function onScroll() {
    if (!scrollTicking) {
      window.requestAnimationFrame(() => {
        const scrolled = window.scrollY > 20;
        nav.classList.toggle('is-scrolled', scrolled);
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Run once on load

  // ── Mobile drawer ─────────────────────────────────────────────────
  function toggleDrawer(open) {
    const isOpen = open !== undefined ? open : !nav.classList.contains('is-open');
    nav.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  if (toggle) {
    toggle.addEventListener('click', () => toggleDrawer());
  }

  // Close on drawer link click
  drawerLinks.forEach(link => {
    link.addEventListener('click', () => toggleDrawer(false));
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (nav.classList.contains('is-open') &&
        !nav.contains(e.target)) {
      toggleDrawer(false);
    }
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      toggleDrawer(false);
      toggle.focus();
    }
  });

  // ── Active link on scroll ─────────────────────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav__link');

  const observerOptions = {
    rootMargin: '-40% 0px -40% 0px',
    threshold: 0,
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          link.classList.toggle('is-active', href === `#${id}`);
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => sectionObserver.observe(section));

})();
