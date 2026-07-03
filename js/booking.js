/**
 * Booking + Time Slots — Suraj Digital HQ
 */

(function () {
  'use strict';

  // ── Time slot selection ───────────────────────────────────────────
  const slots = document.querySelectorAll('.booking__time-slot');

  slots.forEach(slot => {
    slot.addEventListener('click', () => {
      slots.forEach(s => s.classList.remove('is-selected'));
      slot.classList.add('is-selected');
    });
  });

  // ── Form submission (placeholder) ─────────────────────────────────
  const form = document.getElementById('booking-form');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const btn = form.querySelector('.booking__submit');
      const original = btn.textContent;

      btn.textContent = 'Sending request…';
      btn.disabled = true;

      // Simulate async
      setTimeout(() => {
        btn.textContent = '✓ Request received — I\'ll be in touch shortly.';
        btn.style.background = 'var(--success)';

        setTimeout(() => {
          btn.textContent = original;
          btn.disabled = false;
          btn.style.background = '';
          form.reset();
          slots.forEach(s => s.classList.remove('is-selected'));
        }, 4000);
      }, 1500);
    });
  }

})();
