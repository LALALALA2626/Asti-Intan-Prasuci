// Gallery interactions: card stacking (desktop only) + particle bg + image pan + lazy IO recompute
document.addEventListener('DOMContentLoaded', () => {
  const cards = Array.from(document.querySelectorAll('.gallery-card'));
  const isDesktopMQL = window.matchMedia('(min-width: 900px)'); // hanya desktop pakai stacking

  // ===== Card Stacking (desktop only; mobile di-reset) =====
  function resetTransforms() {
    cards.forEach(c => { c.style.transform = ''; c.style.opacity = ''; });
  }

  function applyStackEffect(activeIdx) {
    if (!isDesktopMQL.matches) { resetTransforms(); return; }
    for (let i = 0; i < cards.length; i++) {
      cards[i].style.transform = '';
      cards[i].style.opacity = '';
    }
    for (let i = 0; i < activeIdx; i++) {
      const scaleValue = 1 - (activeIdx - i) * 0.05;
      const translateValue = (activeIdx - i) * -15;
      cards[i].style.transform = `scale(${Math.max(0.8, scaleValue)}) translateY(${translateValue}px)`;
      cards[i].style.opacity = String(1 - (activeIdx - i) * 0.1);
    }
  }

  let ioStack = null, onScrollFallback = null;
  function setupStacking() {
    // cleanup dulu
    if (ioStack) { ioStack.disconnect(); ioStack = null; }
    if (onScrollFallback) { window.removeEventListener('scroll', onScrollFallback); onScrollFallback = null; }
    resetTransforms();

    if (!cards.length) return;
    if (isDesktopMQL.matches) {
      if ('IntersectionObserver' in window) {
        ioStack = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const idx = cards.indexOf(entry.target);
              applyStackEffect(idx);
            }
          });
        }, { threshold: 0.9 });
        cards.forEach(c => ioStack.observe(c));
      } else {
        onScrollFallback = () => {
          const mid = window.scrollY + window.innerHeight * 0.35;
          let active = 0;
          cards.forEach((c, idx) => {
            const rect = c.getBoundingClientRect();
            const top = rect.top + window.scrollY;
            const height = rect.height;
            if (mid >= top && mid <= (top + height)) active = idx;
          });
          applyStackEffect(active);
        };
        window.addEventListener('scroll', onScrollFallback, { passive: true });
        onScrollFallback();
      }
    }
  }

  setupStacking();
  isDesktopMQL.addEventListener('change', setupStacking);

  // ===== Image Pan on Page Scroll (parallax within image container) =====
  const imgPairs = cards.map(card => {
    const container = card.querySelector('.card-image');
    const img = container ? container.querySelector('img') : null;
    return img ? { card, container, img, start: 0, end: 0, maxShift: 0 } : null;
  }).filter(Boolean);

  function clamp01(v) { return v < 0 ? 0 : (v > 1 ? 1 : v); }

  function computeAnchors() {
    const vh = window.innerHeight;
    imgPairs.forEach(p => {
      const rect = p.card.getBoundingClientRect();
      const docTop = window.scrollY + rect.top;
      p.start = docTop - vh;                    // mulai sebelum card masuk viewport
      p.end = docTop + p.card.offsetHeight;     // selesai setelah card keluar
      const containerH = p.container.clientHeight;
      const imgH = p.img.getBoundingClientRect().height || p.img.offsetHeight || containerH;
      p.maxShift = Math.max(0, imgH - containerH);
    });
  }

  let tickingPan = false;
  function updateImagePan() {
    const y = window.scrollY;
    imgPairs.forEach(p => {
      if (p.maxShift <= 0) { p.img.style.setProperty('--imgShift', '0px'); return; }
      const total = (p.end - p.start) || 1;
      const progress = clamp01((y - p.start) / total);
      p.img.style.setProperty('--imgShift', `${-p.maxShift * progress}px`); // atas -> bawah
    });
  }

  function schedulePanFrame() {
    if (tickingPan) return;
    tickingPan = true;
    requestAnimationFrame(() => { updateImagePan(); tickingPan = false; });
  }

  // Recompute anchors saat:
  // - resize/orientation
  // - image lazy-load selesai
  // - image/card mulai masuk viewport (untuk Chrome yang nunda load events)
  let recomputeRaf = null;
  function scheduleCompute() {
    if (recomputeRaf) cancelAnimationFrame(recomputeRaf);
    recomputeRaf = requestAnimationFrame(() => {
      computeAnchors();
      updateImagePan();
      recomputeRaf = null;
    });
  }

  if (imgPairs.length) {
    imgPairs.forEach(p => {
      if (!p.img.complete) p.img.addEventListener('load', scheduleCompute, { once: true });
    });

    if ('IntersectionObserver' in window) {
      const ioImgs = new IntersectionObserver((entries) => {
        for (const e of entries) if (e.isIntersecting) scheduleCompute();
      }, { rootMargin: '0px 0px 300px 0px' }); // compute sedikit sebelum masuk
      imgPairs.forEach(p => ioImgs.observe(p.img));
    }

    window.addEventListener('resize', scheduleCompute, { passive: true });
    window.addEventListener('scroll', schedulePanFrame, { passive: true });
    scheduleCompute();
  }

  // ===== Particle Background (HiDPI aware) =====
  const canvas = document.getElementById('particle-canvas');
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    const colors = ['#ffb3b3', '#E8D5C4', '#ffffff'];
    let rafId = null;

    function resizeCanvas() {
      const ratio = Math.max(1, Math.floor(window.devicePixelRatio || 1));
      canvas.width = Math.floor(innerWidth * ratio);
      canvas.height = Math.floor(innerHeight * ratio);
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      initParticles();
    }

    class Particle {
      constructor(x, y, dx, dy, size, color) {
        this.x = x; this.y = y; this.dx = dx; this.dy = dy; this.size = size; this.color = color;
      }
      draw() { ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fillStyle = this.color; ctx.fill(); }
      update() {
        if (this.x > innerWidth || this.x < 0) this.dx *= -1;
        if (this.y > innerHeight || this.y < 0) this.dy *= -1;
        this.x += this.dx; this.y += this.dy;
        this.draw();
      }
    }

    function initParticles() {
      particles = [];
      const n = Math.max(30, Math.floor((innerWidth * innerHeight) / 9000));
      for (let i = 0; i < n; i++) {
        const size = (Math.random() * 2) + 1;
        const x = (Math.random() * (innerWidth - size * 4)) + size * 2;
        const y = (Math.random() * (innerHeight - size * 4)) + size * 2;
        const dx = (Math.random() * 0.4) - 0.2;
        const dy = (Math.random() * 0.4) - 0.2;
        const color = colors[Math.floor(Math.random() * colors.length)];
        particles.push(new Particle(x, y, dx, dy, size, color));
      }
    }

    function animate() {
      rafId = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      for (let i = 0; i < particles.length; i++) particles[i].update();
    }

    resizeCanvas();
    if (!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) animate();

    window.addEventListener('resize', resizeCanvas, { passive: true });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) { if (rafId) cancelAnimationFrame(rafId); rafId = null; }
      else if (!rafId) animate();
    });
  }
});
