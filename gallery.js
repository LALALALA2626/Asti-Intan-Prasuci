// Cross-browser gallery interactions & particles
document.addEventListener('DOMContentLoaded', () => {
  // ===== Card Stacking (with fallback) =====
  const cards = Array.from(document.querySelectorAll('.gallery-card'));
  if (cards.length) {
    function applyStackEffect(activeIdx) {
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
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const cardIndex = cards.indexOf(entry.target);
            applyStackEffect(cardIndex);
          }
        });
      }, { threshold: 0.9 });
      cards.forEach(c => io.observe(c));
    } else {
      // Fallback: compute based on viewport center
      const onScroll = () => {
        const mid = window.scrollY + window.innerHeight * 0.35;
        let active = 0;
        cards.forEach((c, idx) => {
          const rect = c.getBoundingClientRect();
          const top = rect.top + window.scrollY;
          const height = rect.height;
          const isActive = mid >= top && mid <= (top + height);
          if (isActive) active = idx;
        });
        applyStackEffect(active);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }
  }

  // ===== Particle Background (HiDPI aware) =====
  const canvas = document.getElementById('particle-canvas');
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    const colors = ['#ffb3b3', '#E8D5C4', '#ffffff'];
    let rafId = null;

    function resize() {
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
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
      update() {
        if (this.x > innerWidth || this.x < 0) this.dx *= -1;
        if (this.y > innerHeight || this.y < 0) this.dy *= -1;
        this.x += this.dx; this.y += this.dy;
        this.draw();
      }
    }

    function initParticles() {
      particles = [];
      const numberOfParticles = Math.max(30, Math.floor((innerWidth * innerHeight) / 9000));
      for (let i = 0; i < numberOfParticles; i++) {
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

    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    resize();
    if (!prefersReduced) animate();

    window.addEventListener('resize', resize, { passive: true });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) { if (rafId) cancelAnimationFrame(rafId); rafId = null; }
      else if (!prefersReduced && !rafId) animate();
    });
  }
});
