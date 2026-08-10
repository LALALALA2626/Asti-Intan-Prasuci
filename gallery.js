// ============================================================
// Gallery page — card stacking, parallax, particles, lightbox
// ============================================================
document.addEventListener('DOMContentLoaded', function () {
  var cards = Array.from(document.querySelectorAll('.gallery-card'));
  var isDesktop = window.matchMedia('(min-width: 900px)');

  // === Card Stacking (desktop only) ===
  function resetTransforms() {
    cards.forEach(function (c) { c.style.transform = ''; c.style.opacity = ''; });
  }

  function applyStack(activeIdx) {
    if (!isDesktop.matches) { resetTransforms(); return; }
    for (var i = 0; i < cards.length; i++) {
      cards[i].style.transform = '';
      cards[i].style.opacity = '';
    }
    for (var j = 0; j < activeIdx; j++) {
      var scale = Math.max(0.8, 1 - (activeIdx - j) * 0.05);
      var ty = (activeIdx - j) * -15;
      cards[j].style.transform = 'scale(' + scale + ') translateY(' + ty + 'px)';
      cards[j].style.opacity = String(1 - (activeIdx - j) * 0.1);
    }
  }

  var ioStack = null, scrollFallback = null;

  function setupStacking() {
    if (ioStack) { ioStack.disconnect(); ioStack = null; }
    if (scrollFallback) { window.removeEventListener('scroll', scrollFallback); scrollFallback = null; }
    resetTransforms();
    if (!cards.length) return;

    if (isDesktop.matches) {
      if ('IntersectionObserver' in window) {
        ioStack = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              applyStack(cards.indexOf(entry.target));
            }
          });
        }, { threshold: 0.9 });
        cards.forEach(function (c) { ioStack.observe(c); });
      } else {
        scrollFallback = function () {
          var mid = window.scrollY + window.innerHeight * 0.35;
          var active = 0;
          cards.forEach(function (c, idx) {
            var rect = c.getBoundingClientRect();
            var top = rect.top + window.scrollY;
            if (mid >= top && mid <= top + rect.height) active = idx;
          });
          applyStack(active);
        };
        window.addEventListener('scroll', scrollFallback, { passive: true });
        scrollFallback();
      }
    }
  }

  setupStacking();
  isDesktop.addEventListener('change', setupStacking);

  // === Image Pan on Scroll ===
  var imgPairs = cards.map(function (card) {
    var container = card.querySelector('.card-image');
    var img = container ? container.querySelector('img') : null;
    return img ? { card: card, container: container, img: img, start: 0, end: 0, maxShift: 0 } : null;
  }).filter(Boolean);

  function clamp01(v) { return v < 0 ? 0 : (v > 1 ? 1 : v); }

  function computeAnchors() {
    var vh = window.innerHeight;
    imgPairs.forEach(function (p) {
      var rect = p.card.getBoundingClientRect();
      var docTop = window.scrollY + rect.top;
      p.start = docTop - vh;
      p.end = docTop + p.card.offsetHeight;
      var containerH = p.container.clientHeight;
      var imgH = p.img.getBoundingClientRect().height || p.img.offsetHeight || containerH;
      p.maxShift = Math.max(0, imgH - containerH);
    });
  }

  var tickingPan = false;
  function updatePan() {
    var y = window.scrollY;
    imgPairs.forEach(function (p) {
      if (p.maxShift <= 0) { p.img.style.setProperty('--imgShift', '0px'); return; }
      var progress = clamp01((y - p.start) / ((p.end - p.start) || 1));
      p.img.style.setProperty('--imgShift', (-p.maxShift * progress) + 'px');
    });
  }

  function schedulePan() {
    if (tickingPan) return;
    tickingPan = true;
    requestAnimationFrame(function () { updatePan(); tickingPan = false; });
  }

  var computeRaf = null;
  function scheduleCompute() {
    if (computeRaf) cancelAnimationFrame(computeRaf);
    computeRaf = requestAnimationFrame(function () {
      computeAnchors(); updatePan(); computeRaf = null;
    });
  }

  if (imgPairs.length) {
    imgPairs.forEach(function (p) {
      if (!p.img.complete) p.img.addEventListener('load', scheduleCompute, { once: true });
    });
    if ('IntersectionObserver' in window) {
      var ioImgs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) scheduleCompute(); });
      }, { rootMargin: '0px 0px 300px 0px' });
      imgPairs.forEach(function (p) { ioImgs.observe(p.img); });
    }
    window.addEventListener('resize', scheduleCompute, { passive: true });
    window.addEventListener('scroll', schedulePan, { passive: true });
    scheduleCompute();
  }

  // === Particle Background ===
  var canvas = document.getElementById('particle-canvas');
  if (canvas && canvas.getContext) {
    var ctx = canvas.getContext('2d');
    var particles = [];
    var colors = ['#e8a0bf', '#c9a87c', '#ffffff', '#b8a9d4'];
    var rafId = null;

    function resizeCanvas() {
      var ratio = Math.max(1, Math.floor(window.devicePixelRatio || 1));
      canvas.width = Math.floor(innerWidth * ratio);
      canvas.height = Math.floor(innerHeight * ratio);
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      initParticles();
    }

    function initParticles() {
      particles = [];
      var n = Math.max(25, Math.floor((innerWidth * innerHeight) / 12000));
      for (var i = 0; i < n; i++) {
        particles.push({
          x: Math.random() * innerWidth,
          y: Math.random() * innerHeight,
          r: Math.random() * 2 + 0.5,
          dx: (Math.random() - 0.5) * 0.3,
          dy: (Math.random() - 0.5) * 0.3,
          c: colors[Math.floor(Math.random() * colors.length)],
          a: Math.random() * 0.3 + 0.1
        });
      }
    }

    function animate() {
      rafId = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.dx; p.y += p.dy;
        if (p.x < -10 || p.x > innerWidth + 10) p.dx *= -1;
        if (p.y < -10 || p.y > innerHeight + 10) p.dy *= -1;
        ctx.globalAlpha = p.a;
        ctx.fillStyle = p.c;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    resizeCanvas();
    if (!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) animate();
    window.addEventListener('resize', resizeCanvas, { passive: true });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { if (rafId) cancelAnimationFrame(rafId); rafId = null; }
      else if (!rafId) animate();
    });
  }

  // === Lightbox ===
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = lightbox ? lightbox.querySelector('img') : null;
  var lightboxClose = lightbox ? lightbox.querySelector('.lightbox-close') : null;
  var thumbs = document.querySelectorAll('.thumb-grid img');

  if (lightbox && lightboxImg) {
    thumbs.forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        lightboxImg.src = thumb.src;
        lightbox.classList.add('active');
        document.body.classList.add('no-scroll');
      });
    });

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.classList.remove('no-scroll');
      setTimeout(function () { lightboxImg.src = ''; }, 400);
    }

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox();
    });
  }

  // === Love Whisper ===
  var whispers = [
    'Aku mencintaimu lebih dari yang bisa kukatakan...',
    'Setiap momen bersamamu adalah hadiah terindah.',
    'Kamu alasanku tersenyum setiap hari.',
    'Terima kasih sudah menjadi kamu.',
    'Aku beruntung memilikimu, sayang.',
    'Happy 26th Birthday, my love.'
  ];
  var whisperEl = document.getElementById('love-whisper');
  if (whisperEl) {
    var wIdx = 0;
    setInterval(function () {
      whisperEl.textContent = whispers[wIdx % whispers.length];
      whisperEl.classList.add('show');
      setTimeout(function () { whisperEl.classList.remove('show'); }, 3500);
      wIdx++;
    }, 8000);
  }
});
