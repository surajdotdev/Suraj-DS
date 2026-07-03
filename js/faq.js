/**
 * FAQ Accordion — Suraj Digital HQ
 */

(function () {
  'use strict';

  const items = document.querySelectorAll('.faq-item');

  items.forEach(item => {
    const button = item.querySelector('.faq-item__button');
    const answer = item.querySelector('.faq-item__answer');

    if (!button || !answer) return;

    // Set initial ARIA
    const id = 'faq-answer-' + Math.random().toString(36).slice(2, 8);
    answer.id = id;
    button.setAttribute('aria-controls', id);
    button.setAttribute('aria-expanded', 'false');

    button.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // Close all others
      items.forEach(other => {
        if (other !== item && other.classList.contains('is-open')) {
          other.classList.remove('is-open');
          other.querySelector('.faq-item__button').setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current
      item.classList.toggle('is-open', !isOpen);
      button.setAttribute('aria-expanded', String(!isOpen));
    });
  });

})();
