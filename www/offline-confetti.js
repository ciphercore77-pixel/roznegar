/* Offline Confetti Canvas Engine for Rooznegar (Zero CDN) */
(function () {
  let canvas = null;
  let ctx = null;
  let particles = [];
  let rafId = null;

  function ensureCanvas() {
    if (canvas) return;
    canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:9999;';
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);
  }

  function tick() {
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles = particles.filter((p) => p.life > 0);
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.22;
      p.vx *= 0.985;
      p.rot += p.vrot;
      p.life -= 1;
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, p.life / 35));
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }
    if (particles.length > 0) {
      rafId = requestAnimationFrame(tick);
    } else {
      rafId = null;
    }
  }

  window.confetti = function (opts = {}) {
    ensureCanvas();
    const count = opts.particleCount || 45;
    const spread = (opts.spread || 65) * (Math.PI / 180);
    const ox = ((opts.origin && opts.origin.x !== undefined) ? opts.origin.x : 0.5) * canvas.width;
    const oy = ((opts.origin && opts.origin.y !== undefined) ? opts.origin.y : 0.7) * canvas.height;
    const colors = opts.colors || ['#46B984', '#F09D51', '#E86A58', '#38BDF8', '#FFFDF8'];
    for (let i = 0; i < count; i++) {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * spread * 1.4;
      const speed = 5 + Math.random() * 8;
      particles.push({
        x: ox,
        y: oy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        w: 6 + Math.random() * 5,
        h: 4 + Math.random() * 4,
        rot: Math.random() * Math.PI * 2,
        vrot: (Math.random() - 0.5) * 0.25,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 55 + Math.floor(Math.random() * 35)
      });
    }
    if (!rafId) rafId = requestAnimationFrame(tick);
  };
})();
