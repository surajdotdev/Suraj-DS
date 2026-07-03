/**
 * Ambient Particle System — Suraj Digital HQ
 * Lightweight canvas-based particles with mouse-aware drift.
 * GPU-friendly: only positions updated, no DOM manipulation.
 */

(function () {
  'use strict';

  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (REDUCED) return;

  // ── Setup canvas ───────────────────────────────────────────
  const canvas = document.createElement('canvas');
  canvas.id = 'bg-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText = `
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
  `;
  document.body.insertBefore(canvas, document.body.children[1]);

  const ctx = canvas.getContext('2d');

  let W = window.innerWidth;
  let H = window.innerHeight;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let mouseX = W / 2;
  let mouseY = H / 2;

  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width  = W + 'px';
    canvas.style.height = H + 'px';
    ctx.scale(dpr, dpr);
  }
  resize();

  window.addEventListener('resize', resize, { passive: true });

  // Track mouse gently
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  // ── Particle configuration ─────────────────────────────────
  const PARTICLE_COUNT = window.innerWidth < 768 ? 40 : 70;

  class Particle {
    constructor() { this.reset(true); }

    reset(initial = false) {
      this.x  = Math.random() * W;
      this.y  = initial ? Math.random() * H : (Math.random() > 0.5 ? -5 : H + 5);
      this.vx = (Math.random() - 0.5) * 0.25;
      this.vy = (Math.random() - 0.5) * 0.2 - 0.05; // slight upward drift
      this.size   = Math.random() * 1.0 + 0.3;
      this.alpha  = Math.random() * 0.04 + 0.015;
      this.life   = 1;
      this.fadeIn = Math.random() * 0.02 + 0.003;
      this.life   = initial ? Math.random() : 0;
    }

    update() {
      // Gentle mouse-aware push (very subtle)
      const dx = this.x - mouseX;
      const dy = this.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 200) {
        const force = (200 - dist) / 200 * 0.0004;
        this.vx += (dx / dist) * force;
        this.vy += (dy / dist) * force;
      }

      // Dampen velocity
      this.vx *= 0.99;
      this.vy *= 0.99;

      this.x += this.vx;
      this.y += this.vy;

      // Fade in
      if (this.life < 1) this.life = Math.min(this.life + this.fadeIn, 1);

      // Wrap / reset
      if (this.x < -10 || this.x > W + 10 || this.y < -10 || this.y > H + 10) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha * this.life})`;
      ctx.fill();
    }
  }

  const particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());

  // ── Ambient glow orbs (slow gradient blobs) ────────────────
  // These are separate from the CSS orbs — pure canvas, behind content
  const glowOrbs = [
    { x: W * 0.15, y: H * 0.3,  r: 350, color: [124, 110, 247], a: 0.055, vx: 0.12, vy: 0.08  },
    { x: W * 0.85, y: H * 0.2,  r: 280, color: [232, 213, 163], a: 0.030, vx: -0.1, vy: 0.10  },
    { x: W * 0.5,  y: H * 0.75, r: 320, color: [124, 110, 247], a: 0.040, vx: 0.07, vy: -0.09 },
  ];

  function updateOrbs() {
    glowOrbs.forEach(o => {
      o.x += o.vx;
      o.y += o.vy;

      // Gentle boundary bounce
      if (o.x < -o.r || o.x > W + o.r) o.vx *= -1;
      if (o.y < -o.r || o.y > H + o.r) o.vy *= -1;
    });
  }

  function drawOrbs() {
    glowOrbs.forEach(o => {
      const grad = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
      grad.addColorStop(0,   `rgba(${o.color[0]}, ${o.color[1]}, ${o.color[2]}, ${o.a})`);
      grad.addColorStop(0.5, `rgba(${o.color[0]}, ${o.color[1]}, ${o.color[2]}, ${o.a * 0.3})`);
      grad.addColorStop(1,   `rgba(${o.color[0]}, ${o.color[1]}, ${o.color[2]}, 0)`);
      ctx.beginPath();
      ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    });
  }

  // ── Animated grid lines ────────────────────────────────────
  let gridOffset = 0;

  function drawGrid() {
    const GRID_SIZE  = 60;
    const GRID_ALPHA = 0.025;

    ctx.strokeStyle = `rgba(255, 255, 255, ${GRID_ALPHA})`;
    ctx.lineWidth   = 0.5;
    ctx.beginPath();

    // Vertical lines (slowly scroll right)
    const startX = (gridOffset % GRID_SIZE) - GRID_SIZE;
    for (let x = startX; x < W + GRID_SIZE; x += GRID_SIZE) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
    }
    // Horizontal lines
    for (let y = 0; y < H; y += GRID_SIZE) {
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
    }
    ctx.stroke();

    gridOffset += 0.08;
  }

  // ── Render loop ─────────────────────────────────────────────
  let raf;
  let lastTime = 0;

  function render(now) {
    raf = requestAnimationFrame(render);

    // Cap to ~60fps
    const delta = now - lastTime;
    if (delta < 14) return;
    lastTime = now;

    ctx.clearRect(0, 0, W, H);

    // 1. Grid (bottom layer)
    drawGrid();

    // 2. Ambient orbs
    updateOrbs();
    drawOrbs();

    // 3. Particles
    particles.forEach(p => {
      p.update();
      p.draw();
    });
  }

  raf = requestAnimationFrame(render);

  // Pause when tab is hidden (perf)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(raf);
    } else {
      lastTime = performance.now();
      raf = requestAnimationFrame(render);
    }
  });

})();
