// ============================================================
// Main Script — Home page + shared components
// ============================================================

// === Birthday Lock Screen ===
(function birthdayLock() {
  var unlockDate = new Date('2026-08-16T00:00:00+07:00');
  var now = new Date();
  if (now >= unlockDate) return;

  document.documentElement.style.overflow = 'hidden';

  var lock = document.createElement('div');
  lock.id = 'birthday-lock';
  lock.innerHTML =
    '<div class="bl-glow"></div>' +
    '<div class="bl-content">' +
      '<span class="bl-badge">Coming Soon</span>' +
      '<h1 class="bl-title">For My Only One</h1>' +
      '<p class="bl-sub">Sesuatu yang spesial sedang disiapkan untukmu...</p>' +
      '<div class="bl-countdown">' +
        '<div class="bl-unit"><span id="bl-days">0</span><small>Hari</small></div>' +
        '<div class="bl-sep">:</div>' +
        '<div class="bl-unit"><span id="bl-hours">0</span><small>Jam</small></div>' +
        '<div class="bl-sep">:</div>' +
        '<div class="bl-unit"><span id="bl-mins">0</span><small>Menit</small></div>' +
        '<div class="bl-sep">:</div>' +
        '<div class="bl-unit"><span id="bl-secs">0</span><small>Detik</small></div>' +
      '</div>' +
      '<div class="bl-heart"><svg viewBox="0 0 24 24" width="24" height="24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor"/></svg></div>' +
      '<p class="bl-date">16 Agustus 2026</p>' +
    '</div>';
  document.body.appendChild(lock);

  function tick() {
    var diff = unlockDate - Date.now();
    if (diff <= 0) {
      lock.style.opacity = '0';
      setTimeout(function() {
        lock.remove();
        document.documentElement.style.overflow = '';
      }, 800);
      return;
    }
    var d = Math.floor(diff / 86400000);
    var h = Math.floor((diff % 86400000) / 3600000);
    var m = Math.floor((diff % 3600000) / 60000);
    var s = Math.floor((diff % 60000) / 1000);
    document.getElementById('bl-days').textContent = d;
    document.getElementById('bl-hours').textContent = h < 10 ? '0' + h : h;
    document.getElementById('bl-mins').textContent = m < 10 ? '0' + m : m;
    document.getElementById('bl-secs').textContent = s < 10 ? '0' + s : s;
    requestAnimationFrame(function() { setTimeout(tick, 1000); });
  }
  tick();
})();

// === Navigation: scroll effect + hamburger ===
(function initNav() {
  var header = document.querySelector('header[role="banner"]');
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');

  if (header) {
    var onScroll = function () {
      header.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.classList.toggle('active', open);
      toggle.setAttribute('aria-expanded', String(open));
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        links.classList.remove('open');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }
})();


// === Home page logic (only runs on index.html) ===
document.addEventListener('DOMContentLoaded', function () {
  // Detect which page
  var isHome = !!document.getElementById('countdown');
  if (!isHome) return;

  // --- Config ---
  var birthdayDate = new Date('Aug 16, 2026 00:00:00').getTime();

  var floatingPhotoUrls = [
    './Assets/gallery/IMG-20250707-WA0022.jpg',
    './Assets/gallery/IMG-20250707-WA0023.jpg',
    './Assets/gallery/IMG-20250707-WA0025.jpg',
    './Assets/gallery/IMG-20250707-WA0026.jpg',
    './Assets/gallery/IMG-20250707-WA0027.jpg',
    './Assets/gallery/IMG-20250707-WA0028.jpg',
    './Assets/gallery/IMG-20250707-WA0029.jpg',
    './Assets/gallery/IMG-20250707-WA0030.jpg',
    './Assets/gallery/IMG-20250707-WA0031.jpg',
    './Assets/gallery/IMG-20250707-WA0038.jpg',
    './Assets/gallery/IMG-20250707-WA0041.jpg',
    './Assets/gallery/CANTIK.jpg',
    './Assets/gallery/1.jpg',
    './Assets/gallery/12.jpg',
    './Assets/gallery/IMG-20250707-WA0061.jpg'
  ];

  var reasons = [
    'Senyummu yang selalu bikin hariku lebih cerah.',
    'Cara kamu tertawa yang bikin aku ikut ketawa.',
    'Kesabaranmu menghadapi sikapku yang kadang menyebalkan.',
    'Matamu yang selalu berbicara lebih dari kata-kata.',
    'Keberanianmu menjalani hidup dengan penuh semangat.',
    'Caramu memeluk yang bikin semua masalah hilang.',
    'Kamu selalu percaya sama aku bahkan saat aku ragu.',
    'Hatimu yang lembut ke semua orang.',
    'Caramu marah yang justru bikin aku makin sayang.',
    'Kamu yang selalu jadi rumah untukku pulang.',
    'Kesetiaanmu yang nggak pernah goyah.',
    'Caramu makan yang lucu banget.',
    'Kamu yang selalu mendukung mimpiku.',
    'Suaramu yang jadi lagu favoritku.',
    'Cara kamu bilang "sayang" yang bikin hati meleleh.',
    'Kamu yang selalu jujur walau kadang pedas.',
    'Tanganmu yang pas banget digenggam.',
    'Caramu tidur yang damai banget dilihat.',
    'Kamu yang bikin aku jadi versi terbaik diriku.',
    'Aroma kamu yang selalu bikin tenang.',
    'Caramu khawatir yang menunjukkan betapa kamu peduli.',
    'Kamu yang mau nerima aku apa adanya.',
    'Kebersamaan kita yang nggak pernah membosankan.',
    'Caramu menatapku yang bikin dunia berhenti.',
    'Kamu yang selalu ada di saat aku butuh.',
    'Karena kamu adalah kamu — dan itu lebih dari cukup.'
  ];

  var prefersReduced = false;
  try { prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (_) {}

  // --- Elements ---
  var letterOverlay = document.getElementById('letter-overlay');
  var letterImmersive = letterOverlay ? letterOverlay.querySelector('.letter-immersive') : null;
  var birthdaySurprise = document.getElementById('birthday-surprise');
  var sunflowerContainer = document.getElementById('sunflower-container');
  var loveFade = document.getElementById('love-fade');

  // --- Countdown ---
  function updateCountdown() {
    var now = Date.now();
    var distance = birthdayDate - now;
    var dEl = document.getElementById('days');
    var hEl = document.getElementById('hours');
    var mEl = document.getElementById('minutes');
    var sEl = document.getElementById('seconds');

    if (distance > 0) {
      if (dEl) dEl.textContent = Math.floor(distance / 86400000);
      if (hEl) hEl.textContent = Math.floor((distance % 86400000) / 3600000);
      if (mEl) mEl.textContent = Math.floor((distance % 3600000) / 60000);
      if (sEl) sEl.textContent = Math.floor((distance % 60000) / 1000);
    } else {
      var ctn = document.getElementById('countdown');
      if (ctn) ctn.innerHTML = '<p class="countdown-done">Waktu telah tiba! Selamat merayakan!</p>';
      clearInterval(countdownInterval);
    }
  }
  var countdownInterval = setInterval(updateCountdown, 1000);
  updateCountdown();

  // --- 26 Reasons ---
  var grid = document.getElementById('reasons-grid');
  if (grid) {
    reasons.forEach(function (text, i) {
      var card = document.createElement('div');
      card.className = 'reason-card';
      card.innerHTML =
        '<div class="reason-number">' + (i + 1) + '</div>' +
        '<p class="reason-text">' + text + '</p>';
      grid.appendChild(card);
    });

    if ('IntersectionObserver' in window && !prefersReduced) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

      var cards = grid.querySelectorAll('.reason-card');
      cards.forEach(function (card, idx) {
        card.style.transitionDelay = (idx % 3) * 0.1 + 's';
        io.observe(card);
      });
    } else {
      grid.querySelectorAll('.reason-card').forEach(function (c) { c.classList.add('visible'); });
    }
  }

  // --- Floating photos & overlay ---
  var movers = [];
  var driftId = null;
  var isOverlayOpening = false;

  function addDrag(el, state) {
    function start(e) {
      var p = e.touches && e.touches.length ? e.touches[0] : e;
      state.dragging = true;
      state.lastMouse = { x: p.clientX, y: p.clientY };
      try { el.style.transition = 'none'; } catch (_) {}
      e.preventDefault();
    }
    function move(e) {
      if (!state.dragging) return;
      var p = e.touches && e.touches.length ? e.touches[0] : e;
      state.x += p.clientX - state.lastMouse.x;
      state.y += p.clientY - state.lastMouse.y;
      state.lastMouse = { x: p.clientX, y: p.clientY };
      el.style.left = state.x + 'px';
      el.style.top = state.y + 'px';
      e.preventDefault();
    }
    function end() {
      if (state.dragging) {
        state.vx = (Math.random() * 0.4 - 0.2) + (Math.random() * 0.3);
        state.vy = (Math.random() * 0.4 - 0.2) + (Math.random() * 0.3);
      }
      state.dragging = false;
      state.lastMouse = null;
      try { el.style.transition = ''; } catch (_) {}
    }
    el.addEventListener('mousedown', start);
    window.addEventListener('mousemove', move, { passive: false });
    window.addEventListener('mouseup', end);
    el.addEventListener('touchstart', start, { passive: false });
    window.addEventListener('touchmove', move, { passive: false });
    window.addEventListener('touchend', end);
    state.cleanup = function () {
      el.removeEventListener('mousedown', start);
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', end);
      el.removeEventListener('touchstart', start);
      window.removeEventListener('touchmove', move);
      window.removeEventListener('touchend', end);
    };
  }

  function randomStart(size) {
    var x, y, t = 0;
    do {
      x = Math.random() * window.innerWidth;
      y = Math.random() * window.innerHeight;
      t++;
    } while (t < 80 && letterContent && avoidLetter(x, y, size));
    return { x: x, y: y };
  }

  function avoidLetter(x, y, size) {
    if (!letterContent) return false;
    var r = letterContent.getBoundingClientRect();
    var pad = 12;
    return !(x + size / 2 < r.left - pad || x - size / 2 > r.right + pad ||
             y + size / 2 < r.top - pad  || y - size / 2 > r.bottom + pad);
  }

  function startDrift() {
    if (prefersReduced) return;
    function raf() {
      driftId = window.requestAnimationFrame(raf);
      var W = window.innerWidth, H = window.innerHeight;
      var lr = letterContent ? letterContent.getBoundingClientRect() : null;
      for (var i = 0; i < movers.length; i++) {
        var m = movers[i];
        if (m.dragging) continue;
        m.vx += (Math.random() - 0.5) * 0.02;
        m.vy += (Math.random() - 0.5) * 0.02;
        m.vx = Math.max(-0.9, Math.min(0.9, m.vx));
        m.vy = Math.max(-0.9, Math.min(0.9, m.vy));
        m.x += m.vx; m.y += m.vy;
        if (m.x - m.size / 2 < 0) { m.x = m.size / 2; m.vx *= -1; }
        if (m.x + m.size / 2 > W) { m.x = W - m.size / 2; m.vx *= -1; }
        if (m.y - m.size / 2 < 0) { m.y = m.size / 2; m.vy *= -1; }
        if (m.y + m.size / 2 > H) { m.y = H - m.size / 2; m.vy *= -1; }
        if (lr) {
          var overlaps = !(m.x + m.size / 2 < lr.left || m.x - m.size / 2 > lr.right ||
                           m.y + m.size / 2 < lr.top  || m.y - m.size / 2 > lr.bottom);
          if (overlaps) {
            var cx = (lr.left + lr.right) / 2, cy = (lr.top + lr.bottom) / 2;
            var dx = m.x - cx, dy = m.y - cy;
            var len = Math.max(1, Math.sqrt(dx * dx + dy * dy));
            m.vx = (dx / len) * 0.8;
            m.vy = (dy / len) * 0.8;
            m.x += m.vx * 4; m.y += m.vy * 4;
          }
        }
        m.el.style.left = m.x + 'px';
        m.el.style.top = m.y + 'px';
      }
    }
    raf();
  }

  // --- Public: Open Letter ---
  window.openLetter = function () {
    if (isOverlayOpening || !letterOverlay) return;
    isOverlayOpening = true;
    if (sunflowerContainer) sunflowerContainer.classList.add('blooming');

    setTimeout(function () {
      document.body.classList.add('no-scroll');
      if (letterImmersive) letterImmersive.style.display = '';
      if (birthdaySurprise) birthdaySurprise.classList.remove('visible');

      letterOverlay.scrollTop = 0;
      letterOverlay.classList.add('visible');

      var lazyImgs = letterOverlay.querySelectorAll('img[loading="lazy"]');
      for (var i = 0; i < lazyImgs.length; i++) {
        lazyImgs[i].loading = 'eager';
        var s = lazyImgs[i].src;
        lazyImgs[i].src = '';
        lazyImgs[i].src = s;
      }

      window._overlayCleanup = function () {};
      isOverlayOpening = false;
    }, 300);
  };

  // --- Public: Birthday Surprise ---
  window.triggerBirthdaySurprise = function () {
    if (letterImmersive) letterImmersive.style.display = 'none';
    if (birthdaySurprise) birthdaySurprise.classList.add('visible');

    if (!birthdaySurprise) return;
    var colors = ['#e8a0bf', '#c9a87c', '#ffffff', '#ffd6e7', '#b8a9d4', '#ff6b95'];
    var existing = birthdaySurprise.querySelectorAll('.confetti');
    for (var x = 0; x < existing.length; x++) existing[x].remove();

    for (var i = 0; i < 200; i++) {
      var confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = (Math.random() * 100) + 'vw';
      confetti.style.top = (-20 + Math.random() * 20) + 'px';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.transform = 'scale(' + (Math.random() + 0.5) + ') rotate(' + (Math.random() * 360) + 'deg)';
      confetti.style.animationDelay = (Math.random() * 0.3) + 's';
      birthdaySurprise.appendChild(confetti);
      (function (node) { setTimeout(function () { node.remove(); }, 4500); })(confetti);
    }
  };

  // --- Public: Close Letter ---
  window.closeLetterOverlay = function () {
    document.body.classList.remove('no-scroll');
    if (letterOverlay) letterOverlay.classList.remove('visible');
    if (sunflowerContainer) sunflowerContainer.classList.remove('blooming');
    if (window._overlayCleanup) { window._overlayCleanup(); window._overlayCleanup = null; }
  };

  // --- Fade to Love ---
  window.fadeToLove = function (opts) {
    opts = opts || {};
    var image = opts.image || './Assets/gallery/fade-love.png';
    var duration = typeof opts.duration === 'number' ? opts.duration : 1200;
    var hold = typeof opts.hold === 'number' ? opts.hold : 1600;
    var next = opts.next || 'letter';

    if (!loveFade) {
      if (next === 'letter') window.openLetter();
      else if (next === 'gallery') window.location.href = 'gallery.html';
      return;
    }
    try { loveFade.style.setProperty('--love-bg', "url('" + image + "')"); } catch (_) {}

    if (prefersReduced) {
      loveFade.classList.remove('show', 'hide', 'hold');
      if (next === 'letter') window.openLetter();
      else if (next === 'gallery') window.location.href = 'gallery.html';
      return;
    }

    loveFade.classList.add('show');
    setTimeout(function () { loveFade.classList.add('hold'); }, duration);
    setTimeout(function () {
      loveFade.classList.remove('hold');
      loveFade.classList.add('hide');
      setTimeout(function () {
        loveFade.classList.remove('show', 'hide');
        try { loveFade.style.removeProperty('--love-bg'); } catch (_) {}
        if (next === 'letter') window.openLetter();
        else if (next === 'gallery') window.location.href = 'gallery.html';
      }, 700);
    }, duration + hold);
  };

  // Pause drift when tab hidden
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      if (driftId) cancelAnimationFrame(driftId);
      driftId = null;
    } else {
      if (!prefersReduced && movers.length && !driftId) startDrift();
    }
  });
});


// ============================================================
// RomanceFX — Background canvas (hearts + bokeh + twinkle)
// ============================================================
(function () {
  if (window.RomanceFX) return;
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var rand = function (a, b) { a = a || 0; b = b || 1; return a + Math.random() * (b - a); };
  var TAU = Math.PI * 2;
  var reducedMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  if (reducedMotion) { window.RomanceFX = { triggerSakura: function () {} }; return; }

  var PALETTE = { a: '#e8a0bf', b: '#b8a9d4' };

  function ensureCanvas(id) {
    var c = document.getElementById(id);
    if (!c) { c = document.createElement('canvas'); c.id = id; document.body.prepend(c); }
    return c;
  }

  var cRom = ensureCanvas('fx-romance');
  var cTwi = ensureCanvas('fx-twinkle');
  var cSak = ensureCanvas('fx-sakura');

  var ctxR = cRom.getContext('2d', { alpha: true });
  var ctxT = cTwi.getContext('2d', { alpha: true });
  var ctxS = cSak.getContext('2d', { alpha: true });

  var DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  function resize() {
    var W = innerWidth, H = innerHeight;
    [cRom, cTwi, cSak].forEach(function (c) {
      c.width = Math.floor(W * DPR);
      c.height = Math.floor(H * DPR);
      c.style.width = W + 'px';
      c.style.height = H + 'px';
      c.getContext('2d').setTransform(DPR, 0, 0, DPR, 0, 0);
    });
  }
  resize();
  addEventListener('resize', resize, { passive: true });

  // Hearts
  var hearts = [];
  var bokehs = [];
  var pointer = { x: innerWidth / 2, y: innerHeight / 2, active: false };

  function addHeart(x, y, burst) {
    x = x !== undefined ? x : rand(0, innerWidth);
    y = y !== undefined ? y : rand(0, innerHeight);
    var s = rand(10, 20) * (burst ? 1.1 : 1);
    hearts.push({
      x: x, y: y,
      vx: rand(-0.12, 0.12) + (burst ? rand(-0.5, 0.5) : 0),
      vy: rand(0.06, 0.18) - (burst ? rand(0.2, 0.5) : 0),
      r: rand(-Math.PI, Math.PI), vr: rand(-0.008, 0.008),
      s: s, a: rand(0.4, 0.7), life: rand(6, 12)
    });
  }

  function addBokeh() {
    bokehs.push({
      x: rand(0, innerWidth), y: rand(0, innerHeight),
      r: rand(20, 50), a: rand(0.04, 0.12),
      hue: rand(0, 360), drift: rand(-0.2, 0.2)
    });
  }

  function drawHeart(ctx, size) {
    var s = size / 2;
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.35);
    ctx.bezierCurveTo(s * 0.5, -s * 1.2, s * 1.6, -s * 0.1, 0, s * 0.8);
    ctx.bezierCurveTo(-s * 1.6, -s * 0.1, -s * 0.5, -s * 1.2, 0, -s * 0.35);
    ctx.closePath();
  }

  addEventListener('pointermove', function (e) { pointer.x = e.clientX; pointer.y = e.clientY; pointer.active = true; }, { passive: true });
  addEventListener('pointerleave', function () { pointer.active = false; }, { passive: true });
  addEventListener('click', function (e) { for (var i = 0; i < 6; i++) addHeart(e.clientX, e.clientY, true); }, { passive: true });

  // Seed
  var area = innerWidth * innerHeight;
  var hc = clamp(Math.round(area / 40000), 10, 28);
  var bc = clamp(Math.round(area / 32000), 14, 36);
  for (var i = 0; i < hc; i++) addHeart();
  for (var j = 0; j < bc; j++) addBokeh();

  // Twinkle
  var twinkles = [];
  var tc = clamp(Math.round(area / 100000), 14, 36);
  for (var t = 0; t < tc; t++) {
    twinkles.push({ x: rand(0, innerWidth), y: rand(0, innerHeight), a: rand(0.05, 0.2), s: rand(0.5, 1.4), t: rand(0, TAU) });
  }

  // Sakura
  var petals = [];
  var sakuraUntil = 0;
  function spawnPetal(n) {
    n = n || 20;
    for (var i = 0; i < n; i++) {
      petals.push({
        x: rand(-40, innerWidth + 40), y: rand(-80, -20),
        vx: rand(-0.5, 0.2), vy: rand(0.7, 1.4),
        r: rand(0, TAU), vr: rand(-0.02, 0.02),
        s: rand(8, 16), a: rand(0.3, 0.65)
      });
    }
  }

  // Render
  var last = performance.now();
  function loop(now) {
    var dt = Math.min(0.05, (now - last) / 1000);
    last = now;

    ctxR.clearRect(0, 0, cRom.width / DPR, cRom.height / DPR);
    ctxT.clearRect(0, 0, cTwi.width / DPR, cTwi.height / DPR);
    ctxS.clearRect(0, 0, cSak.width / DPR, cSak.height / DPR);

    // Bokeh
    for (var bi = 0; bi < bokehs.length; bi++) {
      var b = bokehs[bi];
      b.x += b.drift * dt * 20;
      b.y += Math.sin((bi + b.drift) * 0.3 + now * 0.0006) * 0.12;
      if (b.x < -b.r) b.x = innerWidth + b.r;
      if (b.x > innerWidth + b.r) b.x = -b.r;
      if (b.y < -b.r) b.y = innerHeight + b.r;
      if (b.y > innerHeight + b.r) b.y = -b.r;
      var grd = ctxR.createRadialGradient(b.x, b.y, b.r * 0.1, b.x, b.y, b.r);
      grd.addColorStop(0, 'hsla(' + b.hue + ', 80%, 65%, ' + b.a + ')');
      grd.addColorStop(1, 'hsla(0, 0%, 100%, 0)');
      ctxR.fillStyle = grd;
      ctxR.beginPath();
      ctxR.arc(b.x, b.y, b.r, 0, TAU);
      ctxR.fill();
    }

    // Hearts
    for (var hi = hearts.length - 1; hi >= 0; hi--) {
      var h = hearts[hi];
      if (pointer.active) {
        var dx = h.x - pointer.x, dy = h.y - pointer.y;
        var d2 = Math.max(24, dx * dx + dy * dy);
        var f = 50 / d2;
        h.vx += clamp(dx * f, -0.015, 0.015);
        h.vy += clamp(dy * f, -0.015, 0.015);
      }
      h.x += h.vx * 60 * dt;
      h.y += h.vy * 60 * dt;
      h.r += h.vr;
      h.life -= dt;

      if (h.y < -40 || h.y > innerHeight + 40 || h.x < -40 || h.x > innerWidth + 40 || h.life <= 0) {
        hearts.splice(hi, 1);
        addHeart();
        continue;
      }

      ctxR.save();
      ctxR.translate(h.x, h.y);
      ctxR.rotate(h.r);
      drawHeart(ctxR, h.s);
      var hg = ctxR.createLinearGradient(-h.s, -h.s, h.s, h.s);
      hg.addColorStop(0, PALETTE.a + 'BB');
      hg.addColorStop(1, PALETTE.b + 'BB');
      ctxR.fillStyle = hg;
      ctxR.globalAlpha = h.a;
      ctxR.fill();
      ctxR.restore();
    }

    // Twinkle
    for (var ti = 0; ti < twinkles.length; ti++) {
      var tw = twinkles[ti];
      tw.t += dt * rand(1.1, 1.8);
      var blink = (Math.sin(tw.t) + 1) / 2;
      ctxT.save();
      ctxT.globalAlpha = tw.a * (0.3 + 0.7 * blink);
      ctxT.fillStyle = '#ffffff';
      ctxT.shadowColor = '#ffffff';
      ctxT.shadowBlur = 6;
      ctxT.beginPath();
      ctxT.arc(tw.x, tw.y, tw.s, 0, TAU);
      ctxT.fill();
      ctxT.restore();
    }

    // Sakura
    if (performance.now() < sakuraUntil && petals.length < 100) spawnPetal(10);
    for (var pi = petals.length - 1; pi >= 0; pi--) {
      var p = petals[pi];
      p.x += p.vx; p.y += p.vy; p.r += p.vr;
      p.vx += Math.sin((now * 0.001) + pi) * 0.0005;
      if (p.x < -60 || p.x > innerWidth + 60 || p.y > innerHeight + 60) { petals.splice(pi, 1); continue; }
      ctxS.save();
      ctxS.translate(p.x, p.y);
      ctxS.rotate(p.r);
      ctxS.globalAlpha = p.a;
      ctxS.fillStyle = '#ffd5e1';
      ctxS.beginPath();
      ctxS.ellipse(0, 0, p.s * 0.6, p.s * 0.35, 0, 0, TAU);
      ctxS.fill();
      ctxS.restore();
    }

    raf = requestAnimationFrame(loop);
  }

  var raf = requestAnimationFrame(loop);

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { cancelAnimationFrame(raf); }
    else { last = performance.now(); raf = requestAnimationFrame(loop); }
  });

  window.RomanceFX = {
    triggerSakura: function (ms) {
      ms = ms || 10000;
      sakuraUntil = performance.now() + ms;
      spawnPetal(30);
    }
  };
})();
