/**
 * Interactions — Suraj Digital HQ
 * All premium micro-interactions:
 * scroll progress, hero text prep, card tilt, magnetic buttons,
 * button ripple, reveal variants, casestudy metrics, section observers
 */

(function () {
  'use strict';

  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Scroll progress bar ────────────────────────────────────
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  progressBar.setAttribute('aria-hidden', 'true');
  progressBar.setAttribute('role', 'progressbar');
  progressBar.setAttribute('aria-label', 'Reading progress');
  document.body.appendChild(progressBar);

  let scrollTick = false;
  function updateProgress() {
    if (!scrollTick) {
      requestAnimationFrame(() => {
        const scrollTop  = window.scrollY;
        const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
        const pct        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = pct + '%';
        scrollTick = false;
      });
      scrollTick = true;
    }
  }
  window.addEventListener('scroll', updateProgress, { passive: true });

  // ── Hero headline: wrap lines in .line-inner spans ─────────
  // (must run BEFORE loader triggers reveal)
  function prepHeroHeadline() {
    const lines = document.querySelectorAll('.hero__headline-line');
    lines.forEach(line => {
      // Preserve existing classes/content
      const content = line.innerHTML;
      const inner   = document.createElement('span');
      inner.className = 'line-inner';
      inner.innerHTML = content;
      line.innerHTML  = '';
      line.appendChild(inner);
    });
  }
  prepHeroHeadline();

  // ── Card tilt effect ────────────────────────────────────────
  if (!REDUCED) {
    const TILT_MAX    = 4;   // degrees
    const TILT_LIFT   = 8;   // px translateZ
    const SHINE_ON    = true;

    function initTilt(selector) {
      document.querySelectorAll(selector).forEach(card => {
        card.classList.add('tilt-card');

        // Inject shine element
        if (SHINE_ON && !card.querySelector('.card-shine')) {
          const shine = document.createElement('div');
          shine.className = 'card-shine';
          shine.setAttribute('aria-hidden', 'true');
          card.style.position = 'relative';
          card.appendChild(shine);
        }

        const shine = card.querySelector('.card-shine');
        let raf;

        function handleMove(e) {
          if (raf) cancelAnimationFrame(raf);
          raf = requestAnimationFrame(() => {
            const rect    = card.getBoundingClientRect();
            const cx      = rect.left + rect.width  / 2;
            const cy      = rect.top  + rect.height / 2;
            const px      = e.clientX || (e.touches && e.touches[0]?.clientX);
            const py      = e.clientY || (e.touches && e.touches[0]?.clientY);
            if (!px) return;

            const rotX = ((py - cy) / (rect.height / 2)) * -TILT_MAX;
            const rotY = ((px - cx) / (rect.width  / 2)) *  TILT_MAX;

            card.style.setProperty('--tilt-x', rotX.toFixed(2) + 'deg');
            card.style.setProperty('--tilt-y', rotY.toFixed(2) + 'deg');
            card.style.setProperty('--tilt-z', TILT_LIFT + 'px');
            card.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateZ(${TILT_LIFT}px)`;
            card.style.transition = 'transform 0.1s ease-out, box-shadow 0.3s ease-out';

            if (shine) {
              const shineX = ((px - rect.left) / rect.width  * 100).toFixed(1);
              const shineY = ((py - rect.top)  / rect.height * 100).toFixed(1);
              shine.style.setProperty('--shine-x', shineX + '%');
              shine.style.setProperty('--shine-y', shineY + '%');
            }
          });
        }

        function handleLeave() {
          if (raf) cancelAnimationFrame(raf);
          card.style.transform  = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)';
          card.style.transition = 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
          if (shine) shine.style.setProperty('--shine-x', '50%');
        }

        card.addEventListener('mousemove',  handleMove,  { passive: true });
        card.addEventListener('mouseleave', handleLeave);
        card.addEventListener('touchmove',  handleMove,  { passive: true });
        card.addEventListener('touchend',   handleLeave);
      });
    }

    // Apply tilt to specific card types
    initTilt('.project-card');
    initTilt('.why-card');
    initTilt('.service-card');
    initTilt('.lab-card');
    initTilt('.stack-node__card');
    initTilt('.casestudy__card');
  }

  // ── Magnetic button effect ──────────────────────────────────
  if (!REDUCED && window.matchMedia('(pointer: fine)').matches) {
    const MAGNETIC_STRENGTH = 0.28;
    const MAGNETIC_RADIUS   = 80; // px from edge

    document.querySelectorAll('.btn--primary.btn--lg, .btn--primary.nav__cta').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const cx   = rect.left + rect.width  / 2;
        const cy   = rect.top  + rect.height / 2;
        const dx   = (e.clientX - cx) * MAGNETIC_STRENGTH;
        const dy   = (e.clientY - cy) * MAGNETIC_STRENGTH;
        btn.style.transform = `translate(${dx}px, ${dy}px) translateY(-2px) scale(1.02)`;
        btn.style.transition = 'transform 0.2s cubic-bezier(0.23, 1, 0.32, 1)';
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform  = '';
        btn.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
      });
    });
  }

  // ── Button ripple on click ──────────────────────────────────
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Don't add ripple if it's a link navigating to anchor
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      const size = Math.max(btn.offsetWidth, btn.offsetHeight) * 2;
      const rect = btn.getBoundingClientRect();
      ripple.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${e.clientX - rect.left - size / 2}px;
        top: ${e.clientY - rect.top - size / 2}px;
      `;
      btn.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });

  // ── Section reveal variants (directional) ──────────────────
  // Override certain sections with directional reveals
  function applyDirectionalReveals() {
    const map = [
      { selector: '.why__header',     cls: 'reveal-left'  },
      { selector: '.why__grid',       cls: 'reveal-right' },
      { selector: '.casestudy__phases', cls: 'reveal-left'  },
      { selector: '.casestudy__metrics', cls: 'reveal-right' },
    ];

    map.forEach(({ selector, cls }) => {
      const el = document.querySelector(selector);
      if (el) {
        // Only add if it doesn't already have reveal classes
        if (!el.classList.contains('reveal')) {
          el.classList.add(cls);
        }
      }
    });
  }
  applyDirectionalReveals();

  // ── Observe directional reveals ─────────────────────────────
  const dirObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          dirObserver.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -60px 0px', threshold: 0.1 }
  );

  document.querySelectorAll('.reveal-left, .reveal-right').forEach(el =>
    dirObserver.observe(el)
  );

  // ── Casestudy metrics observer ──────────────────────────────
  const metricsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.casestudy-metric').forEach(m =>
            m.classList.add('is-visible')
          );
          metricsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );
  const metricsContainer = document.querySelector('.casestudy__metrics');
  if (metricsContainer) metricsObserver.observe(metricsContainer);

  // ── Hero available badge entrance fix ──────────────────────
  // The badge uses CSS animation that starts immediately.
  // The loader covers it, so this is fine — no change needed.

  // ── Nav link active state on scroll ─────────────────────────
  // Enhanced version of what's in nav.js
  const navLinks = document.querySelectorAll('.nav__link');
  const sections = document.querySelectorAll('section[id]');

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            const active = link.getAttribute('href') === '#' + id;
            link.classList.toggle('is-active', active);
          });
        }
      });
    },
    { rootMargin: '-30% 0px -50% 0px', threshold: 0 }
  );

  sections.forEach(s => navObserver.observe(s));

  // ── Enhanced FAQ: smooth height transition ──────────────────
  // The existing faq.js handles open/close; we just ensure the
  // transitions defined in interactions.css are applied by
  // keeping max-height in sync with actual content height.
  document.querySelectorAll('.faq-item__button').forEach(btn => {
    btn.addEventListener('click', () => {
      const item   = btn.closest('.faq-item');
      const answer = item.querySelector('.faq-item__answer');
      const inner  = item.querySelector('.faq-item__answer-inner');

      // After FAQ JS toggles the class, set explicit max-height
      requestAnimationFrame(() => {
        if (item.classList.contains('is-open')) {
          answer.style.maxHeight = inner.scrollHeight + 32 + 'px';
        } else {
          answer.style.maxHeight = '0px';
        }
      });
    });
  });

  // ── Booking time slot aria-pressed state ────────────────────
  document.querySelectorAll('.booking__time-slot').forEach(slot => {
    slot.addEventListener('click', () => {
      document.querySelectorAll('.booking__time-slot').forEach(s =>
        s.setAttribute('aria-pressed', 'false')
      );
      slot.setAttribute('aria-pressed', 'true');
    });
  });

  // ── Project card overlay link pointer events ─────────────────
  // Overlay links should not block card hover detection
  document.querySelectorAll('.project-card__overlay-link').forEach(link => {
    link.addEventListener('mouseenter', (e) => e.stopPropagation());
  });

  // ── Footer nav link hover: instant arrow icon ───────────────
  // Handled via CSS — no JS needed.

  // ── Service card value items: stagger on hover ───────────────
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      const items = card.querySelectorAll('.service-card__value-item');
      items.forEach((item, i) => {
        item.style.transitionDelay = `${i * 40}ms`;
        item.style.opacity = '1';
        item.style.transform = 'translateX(0)';
      });
    });
  });

  // ── Section eyebrow animate in ──────────────────────────────
  const eyebrowObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          eyebrowObserver.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -40px 0px', threshold: 0.5 }
  );

  document.querySelectorAll('.section-eyebrow').forEach(el =>
    eyebrowObserver.observe(el)
  );

  // Stack pipeline reveal handled by animations.js (no duplicate needed)

  // ── Process Timeline Progress ───────────────────────────────
  const timelineProgress = document.getElementById('timeline-progress');
  const timelineItems = document.querySelectorAll('.timeline-item');
  if (timelineProgress && timelineItems.length > 0) {
    const timelineContainer = document.querySelector('.timeline');
    let timelineTick = false;
    
    window.addEventListener('scroll', () => {
      if (!timelineTick) {
        requestAnimationFrame(() => {
          const rect = timelineContainer.getBoundingClientRect();
          const winHeight = window.innerHeight;
          // Start filling when top is in middle of viewport
          const triggerPoint = winHeight / 2;
          
          if (rect.top < triggerPoint && rect.bottom > 0) {
            const totalDistance = rect.height;
            const scrolledDistance = triggerPoint - rect.top;
            let percentage = (scrolledDistance / totalDistance) * 100;
            percentage = Math.max(0, Math.min(100, percentage));
            timelineProgress.style.height = percentage + '%';
          }
          
          timelineTick = false;
        });
        timelineTick = true;
      }
    }, { passive: true });

    const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-active');
        } else if (entry.boundingClientRect.top > window.innerHeight / 2) {
          entry.target.classList.remove('is-active');
        }
      });
    }, { rootMargin: '-50% 0px -40% 0px', threshold: 0 });

    timelineItems.forEach(item => timelineObserver.observe(item));
  }

  // ── Smooth scroll for all anchor links ─────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();

      const navHeight = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--nav-height') || '72',
        10
      );
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;

      window.scrollTo({
        top,
        behavior: REDUCED ? 'auto' : 'smooth',
      });
    });
  });

  // ── Why-card icon hover accent ──────────────────────────────
  document.querySelectorAll('.why-card').forEach(card => {
    const icon = card.querySelector('.why-card__icon');
    card.addEventListener('mouseenter', () => {
      if (icon) {
        icon.style.background    = 'rgba(124, 110, 247, 0.25)';
        icon.style.borderColor   = 'rgba(124, 110, 247, 0.4)';
        icon.style.transform     = 'scale(1.1) rotate(-4deg)';
        icon.style.transition    = 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)';
      }
    });
    card.addEventListener('mouseleave', () => {
      if (icon) {
        icon.style.background  = '';
        icon.style.borderColor = '';
        icon.style.transform   = '';
      }
    });
  });

  // ── Lab card icon hover ─────────────────────────────────────
  document.querySelectorAll('.lab-card').forEach(card => {
    const icon = card.querySelector('.lab-card__icon');
    card.addEventListener('mouseenter', () => {
      if (icon) {
        icon.style.background  = 'rgba(232, 213, 163, 0.18)';
        icon.style.transform   = 'scale(1.12) rotate(6deg)';
        icon.style.transition  = 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)';
      }
    });
    card.addEventListener('mouseleave', () => {
      if (icon) {
        icon.style.background = '';
        icon.style.transform  = '';
      }
    });
  });

})();
