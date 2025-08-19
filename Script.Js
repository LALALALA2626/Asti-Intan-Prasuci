// Cross-browser behavior for home page: countdown, overlay letter, music control, floating photos, love-fade
document.addEventListener('DOMContentLoaded', function () {
  // ===== Config (biarkan sesuai kebutuhanmu) =====
  var anniversaryDate = new Date('Aug 16, 2025 00:00:00').getTime();

  // Foto melayang saat overlay surat dibuka
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

  var prefersReduced = false;
  try {
    prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (_) {}

  // ===== Element refs =====
  var letterOverlay = document.getElementById('letter-overlay');
  var letterContent = letterOverlay ? letterOverlay.querySelector('.letter-content') : null;
  var birthdaySurprise = document.getElementById('birthday-surprise');
  var music = document.getElementById('background-music');
  var musicControl = document.getElementById('music-control');
  var playIcon = document.getElementById('play-icon');
  var pauseIcon = document.getElementById('pause-icon');
  var sunflowerContainer = document.getElementById('sunflower-container');
  var loveFade = document.getElementById('love-fade');

  // ===== Countdown (aman untuk semua timezone; jika lewat, tampilkan pesan) =====
  function updateCountdown() {
    var now = Date.now();
    var distance = anniversaryDate - now;

    var dEl = document.getElementById('days');
    var hEl = document.getElementById('hours');
    var mEl = document.getElementById('minutes');
    var sEl = document.getElementById('seconds');

    if (distance > 0) {
      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (dEl) dEl.textContent = String(days);
      if (hEl) hEl.textContent = String(hours);
      if (mEl) mEl.textContent = String(minutes);
      if (sEl) sEl.textContent = String(seconds);
    } else {
      var ctn = document.getElementById('countdown');
      if (ctn) ctn.innerHTML = '<p>Waktu telah tiba! Selamat merayakan!</p>';
      clearInterval(countdownInterval);
    }
  }
  var countdownInterval = setInterval(updateCountdown, 1000);
  updateCountdown();

  // ===== Floating photos & overlay logic =====
  var movers = [];
  var driftId = null;
  var isOverlayOpening = false;

  function addDrag(el, state) {
    function startDrag(e) {
      var p = e.touches && e.touches.length ? e.touches[0] : e;
      state.dragging = true;
      state.lastMouse = { x: p.clientX, y: p.clientY };
      try { el.style.transition = 'none'; } catch (_) {}
      e.preventDefault();
    }
    function duringDrag(e) {
      if (!state.dragging) return;
      var p = e.touches && e.touches.length ? e.touches[0] : e;
      var dx = p.clientX - state.lastMouse.x;
      var dy = p.clientY - state.lastMouse.y;
      state.x += dx; state.y += dy;
      state.lastMouse = { x: p.clientX, y: p.clientY };
      el.style.left = state.x + 'px';
      el.style.top = state.y + 'px';
      e.preventDefault();
    }
    function endDrag() {
      if (state.dragging) {
        state.vx = (Math.random() * 0.4 - 0.2) + (Math.random() * 0.3);
        state.vy = (Math.random() * 0.4 - 0.2) + (Math.random() * 0.3);
      }
      state.dragging = false;
      state.lastMouse = null;
      try { el.style.transition = ''; } catch (_) {}
    }

    el.addEventListener('mousedown', startDrag);
    window.addEventListener('mousemove', duringDrag, { passive: false });
    window.addEventListener('mouseup', endDrag);

    el.addEventListener('touchstart', startDrag, { passive: false });
    window.addEventListener('touchmove', duringDrag, { passive: false });
    window.addEventListener('touchend', endDrag);

    state.cleanup = function () {
      el.removeEventListener('mousedown', startDrag);
      window.removeEventListener('mousemove', duringDrag);
      window.removeEventListener('mouseup', endDrag);
      el.removeEventListener('touchstart', startDrag);
      window.removeEventListener('touchmove', duringDrag);
      window.removeEventListener('touchend', endDrag);
    };
  }

  function avoidLetterArea(x, y, size) {
    if (!letterContent) return false;
    var rect = letterContent.getBoundingClientRect();
    var pad = 12;
    var overlaps = !(x + size / 2 < rect.left - pad ||
                     x - size / 2 > rect.right + pad ||
                     y + size / 2 < rect.top - pad ||
                     y - size / 2 > rect.bottom + pad);
    return overlaps;
  }

  function randomStart(size) {
    var x, y, t = 0;
    var MAX_TRY = 120;
    do {
      x = Math.random() * window.innerWidth;
      y = Math.random() * window.innerHeight;
      t++;
      if (t > MAX_TRY) break; // fail-safe
    } while (avoidLetterArea(x, y, size));
    return { x: x, y: y };
  }

  function startDrift() {
    if (prefersReduced) return; // hormati preferensi user
    function raf() {
      driftId = window.requestAnimationFrame(raf);
      var W = window.innerWidth, H = window.innerHeight;
      var letterRect = letterContent ? letterContent.getBoundingClientRect() : null;

      for (var i = 0; i < movers.length; i++) {
        var m = movers[i];
        if (m.dragging) continue;

        var jit = 0.02;
        m.vx += (Math.random() - 0.5) * jit;
        m.vy += (Math.random() - 0.5) * jit;

        var max = 0.9;
        m.vx = Math.max(Math.min(m.vx, max), -max);
        m.vy = Math.max(Math.min(m.vy, max), -max);

        m.x += m.vx; m.y += m.vy;

        if (m.x - m.size / 2 < 0) { m.x = m.size / 2; m.vx *= -1; }
        if (m.x + m.size / 2 > W) { m.x = W - m.size / 2; m.vx *= -1; }
        if (m.y - m.size / 2 < 0) { m.y = m.size / 2; m.vy *= -1; }
        if (m.y + m.size / 2 > H) { m.y = H - m.size / 2; m.vy *= -1; }

        if (letterRect) {
          var overlaps = !(m.x + m.size / 2 < letterRect.left ||
                           m.x - m.size / 2 > letterRect.right ||
                           m.y + m.size / 2 < letterRect.top ||
                           m.y - m.size / 2 > letterRect.bottom);
          if (overlaps) {
            var cx = (letterRect.left + letterRect.right) / 2;
            var cy = (letterRect.top + letterRect.bottom) / 2;
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

  // ===== Public APIs (dipakai di HTML) =====
  window.openLetter = function () {
    if (isOverlayOpening || !letterOverlay) return;
    isOverlayOpening = true;

    if (sunflowerContainer) sunflowerContainer.classList.add('blooming');

    setTimeout(function () {
      document.body.classList.add('no-scroll');

      // coba play musik (akan berhasil hanya setelah gesture sebelumnya)
      if (music && !isMusicPlaying) {
        var p = music.play();
        if (p && typeof p.then === 'function') {
          p.then(function () {
            isMusicPlaying = true;
            if (playIcon) playIcon.style.display = 'none';
            if (pauseIcon) pauseIcon.style.display = 'block';
          }).catch(function () {});
        }
      }

      if (letterContent) letterContent.classList.remove('hidden');
      if (birthdaySurprise) birthdaySurprise.classList.remove('visible');

      // bersihkan elemen lama (jika ada)
      var old = letterOverlay.querySelectorAll('.floating-photo, .sakura-petal');
      for (var i = 0; i < old.length; i++) old[i].remove();

      letterOverlay.classList.add('visible');
      movers = [];

      // create floating photos
      for (var j = 0; j < floatingPhotoUrls.length; j++) {
        var url = floatingPhotoUrls[j];
        var img = document.createElement('img');
        img.src = url;
        img.alt = 'Moment photo';
        img.className = 'floating-photo';
        // sisipkan di paling belakang supaya caption overlay tetap di atas
        letterOverlay.insertBefore(img, letterOverlay.firstChild);

        var size = Math.floor(180 + Math.random() * 100);
        var rot = Math.random() * 40 - 20;
        img.style.setProperty('--size', size + 'px');
        img.style.setProperty('--base-rot', rot + 'deg');
        img.style.animationDelay = (Math.random() * 1.2) + 's';

        (function (imgRef, sizeRef, rotRef, idx) {
          var start = randomStart(sizeRef);
          setTimeout(function () {
            imgRef.style.top = start.y + 'px';
            imgRef.style.left = start.x + 'px';
            imgRef.style.transform = 'translate(-50%,-50%) scale(1) rotate(' + rotRef + 'deg)';
            imgRef.style.opacity = '1';
          }, 60 * idx);

          var speed = 0.25 + Math.random() * 0.5;
          var ang = Math.random() * Math.PI * 2;
          var vx = Math.cos(ang) * speed;
          var vy = Math.sin(ang) * speed;
          var state = { el: imgRef, x: start.x, y: start.y, vx: vx, vy: vy, size: sizeRef, dragging: false, lastMouse: null, cleanup: null };
          movers.push(state);
          addDrag(imgRef, state);
        })(img, size, rot, j);
      }

      // Sakura petals
      for (var k = 0; k < 50; k++) {
        var petal = document.createElement('div');
        petal.className = 'sakura-petal';
        petal.textContent = '🌸';
        petal.style.left = (Math.random() * 100) + 'vw';
        petal.style.animationDuration = (Math.random() * 3 + 5) + 's';
        petal.style.animationDelay = (Math.random() * 5) + 's';
        petal.style.fontSize = (Math.random() * 10 + 10) + 'px';
        letterOverlay.insertBefore(petal, letterOverlay.firstChild);
      }

      startDrift();

      // keep photos within viewport on resize
      function onResize() {
        var W = window.innerWidth, H = window.innerHeight;
        for (var i2 = 0; i2 < movers.length; i2++) {
          var m = movers[i2];
          m.x = Math.min(Math.max(m.x, m.size / 2), W - m.size / 2);
          m.y = Math.min(Math.max(m.y, m.size / 2), H - m.size / 2);
        }
      }
      window.addEventListener('resize', onResize, { passive: true });

      // store cleanup
      window._overlayCleanup = function () {
        window.removeEventListener('resize', onResize);
        if (driftId) cancelAnimationFrame(driftId);
        driftId = null;
        for (var z = 0; z < movers.length; z++) {
          if (movers[z].cleanup) movers[z].cleanup();
        }
        movers = [];
      };

      isOverlayOpening = false;
    }, 300);
  };

  window.triggerBirthdaySurprise = function () {
    if (letterContent) letterContent.classList.add('hidden');
    if (birthdaySurprise) birthdaySurprise.classList.add('visible');

    // Confetti sederhana (performant & auto-clean)
    if (!birthdaySurprise) return;
    var colors = ['#800000', '#ffb3b3', '#ffffff', '#ffdada', '#E8D5C4'];
    var existing = birthdaySurprise.querySelectorAll('.confetti');
    for (var x = 0; x < existing.length; x++) existing[x].remove();

    for (var i = 0; i < 200; i++) {
      var confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = (Math.random() * 100) + 'vw';
      confetti.style.top = (-20 + Math.random() * 20) + 'px';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.transform = 'scale(' + (Math.random() + 0.5) + ') rotate(' + (Math.random() * 360) + 'deg)';
      confetti.style.animationDelay = (Math.random() * 0.2) + 's';
      birthdaySurprise.appendChild(confetti);
      (function (node) { setTimeout(function () { node.remove(); }, 4000); })(confetti);
    }
  };

  window.closeLetterOverlay = function () {
    document.body.classList.remove('no-scroll');
    if (letterOverlay) letterOverlay.classList.remove('visible');
    if (sunflowerContainer) sunflowerContainer.classList.remove('blooming');
    if (window._overlayCleanup) { window._overlayCleanup(); window._overlayCleanup = null; }
  };

  // Transition overlay (opsional, dipanggil via JS jika dipakai)
  window.fadeToLove = function (opts) {
    opts = opts || {};
    var image = opts.image || './Assets/gallery/fade-love.jpg';
    var duration = typeof opts.duration === 'number' ? opts.duration : 1200;
    var hold = typeof opts.hold === 'number' ? opts.hold : 1600;
    var next = opts.next || 'letter'; // 'letter' | 'gallery'

    if (!loveFade) { if (next === 'letter') window.openLetter(); else if (next === 'gallery') window.location.href = 'gallery.html'; return; }

    // pasang background via CSS var
    try { loveFade.style.setProperty('--love-bg', "url('" + image + "')"); } catch (_) {}

    // Reduced motion: skip animasi panjang
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

  // Hemat baterai/perf: pause animasi saat tab tak aktif
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      if (driftId) cancelAnimationFrame(driftId);
      driftId = null;
    } else {
      if (!prefersReduced && movers.length && !driftId) startDrift();
    }
  });
});
// === Lock hero below navbar (dynamic nav height) ===
(function ensureHeroBelowNav(){
  var header = document.querySelector('header[role="banner"]');
  if (!header) return;

  function applyNavHeight(){
    // pakai getBoundingClientRect untuk akurasi termasuk border
    var h = Math.ceil(header.getBoundingClientRect().height);
    // fail-safe untuk kasus extreme
    if (!h || h < 48) h = 56;
    document.documentElement.style.setProperty('--nav-h', h + 'px');
  }

  // initial
  applyNavHeight();

  // update saat resize / orientation berubah
  var rafId = null;
  function schedule(){
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(function(){ rafId = null; applyNavHeight(); });
  }
  window.addEventListener('resize', schedule, { passive: true });
  window.addEventListener('orientationchange', schedule);
  // jika font web selesai load dan mempengaruhi tinggi nav
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(applyNavHeight).catch(function(){});
  }
})();

/* ==========================================================
   RomanceFX v1 — Background interaktif:
   - Bokeh Hearts Parallax (always-on)
   - Twinkle Sky + Shooting Hearts (landing accent)
   - Sakura Rain (on-demand): window.RomanceFX.triggerSakura(ms)
   Tanpa dependensi, tanpa edit HTML.
   ========================================================== */
(function(){
  // Hindari double-init jika file dimuat dua kali
  if (window.RomanceFX) return;

  // Utilitas kecil
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const rand = (a=0, b=1) => a + Math.random()*(b-a);
  const TAU = Math.PI*2;

  // Deteksi preferensi
  const reducedMotion = matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Ambil palet dari CSS variables bila ada
  function readPalette(){
    const css = getComputedStyle(document.documentElement);
    const a = (css.getPropertyValue('--brand')||'').trim() || '#FF6AA7';   // rose
    const b = (css.getPropertyValue('--brand-2')||'').trim() || '#8B5CF6'; // lavender
    return { a, b };
  }
  let PALETTE = readPalette();

  // Buat layer canvas jika belum ada (tanpa edit HTML)
  function ensureCanvas(id){
    let c = document.getElementById(id);
    if (!c){
      c = document.createElement('canvas');
      c.id = id;
      document.body.prepend(c);
    }
    return c;
  }

  // Setup semua canvas
  const cRom = ensureCanvas('fx-romance');
  const cTwi = ensureCanvas('fx-twinkle');
  const cSak = ensureCanvas('fx-sakura');

  const ctxR = cRom.getContext('2d', { alpha:true });
  const ctxT = cTwi.getContext('2d', { alpha:true });
  const ctxS = cSak.getContext('2d', { alpha:true });

  // DPR-aware sizing
  let DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  function resize(){
    const W = innerWidth, H = innerHeight;
    [cRom, cTwi, cSak].forEach(c=>{
      c.width  = Math.floor(W * DPR);
      c.height = Math.floor(H * DPR);
      c.style.width = W + 'px';
      c.style.height = H + 'px';
      const ctx = c.getContext('2d');
      ctx.setTransform(DPR,0,0,DPR,0,0);
    });
  }
  resize();
  addEventListener('resize', resize, { passive:true });

  // ====== Hearts + Bokeh engine ======
  const hearts = [];
  const bokehs = [];
  const pointer = { x: innerWidth/2, y: innerHeight/2, active:false };

  // jumlah partikel adaptif luas layar (ringan di mobile)
  function targetCounts(){
    const area = innerWidth * innerHeight;
    const base = area / 28000; // tweak density
    const heartsCount = Math.max(12, Math.min(36, Math.round(base * 0.7)));
    const bokehCount  = Math.max(18, Math.min(48, Math.round(base * 0.9)));
    return { heartsCount, bokehCount };
  }

  function addHeart(x = rand(0, innerWidth), y = rand(0, innerHeight), burst=false){
    const s = rand(10, 22) * (burst ? 1.1 : 1);
    hearts.push({
      x, y,
      vx: rand(-0.15, 0.15) + (burst ? rand(-0.6,0.6) : 0),
      vy: rand(0.08, 0.22) - (burst ? rand(0.2,0.6) : 0), // naik pelan
      r: rand(-Math.PI, Math.PI),
      vr: rand(-0.01, 0.01),
      s,
      a: rand(0.55, 0.85),
      life: rand(6, 12), // seconds
    });
  }

  function addBokeh(){
    bokehs.push({
      x: rand(0, innerWidth),
      y: rand(0, innerHeight),
      r: rand(20, 60),
      s: rand(0.25, 0.7),
      a: rand(0.05, 0.18),
      hue: rand(0, 360),
      drift: rand(-0.25, 0.25)
    });
  }

  // gambar heart dengan path (bezier)
  function drawHeartPath(ctx, size){
    const s = size/2;
    ctx.beginPath();
    ctx.moveTo(0, -s*0.35);
    ctx.bezierCurveTo(s*0.5, -s*1.2,  s*1.6, -s*0.1,  0,  s*0.8);
    ctx.bezierCurveTo(-s*1.6, -s*0.1, -s*0.5, -s*1.2,  0, -s*0.35);
    ctx.closePath();
  }

  // pointer interaksi (parallax & burst)
  addEventListener('pointermove', (e)=>{
    pointer.x = e.clientX; pointer.y = e.clientY; pointer.active = true;
  }, { passive:true });

  addEventListener('pointerleave', ()=> { pointer.active = false; }, { passive:true });

  addEventListener('click', (e)=>{
    // burst kecil di posisi klik
    for (let i=0;i<8;i++) addHeart(e.clientX, e.clientY, true);
  }, { passive:true });

  // inisialisasi jumlah target
  (function seed(){
    const { heartsCount, bokehCount } = targetCounts();
    for (let i=0;i<heartsCount;i++) addHeart();
    for (let i=0;i<bokehCount;i++) addBokeh();
  })();

  // ====== Twinkle Sky (+ shooting hearts) ======
  const twinkles = [];
  const twinkleCount = Math.max(18, Math.min(42, Math.round((innerWidth*innerHeight) / 90000)));
  for (let i=0;i<twinkleCount;i++){
    twinkles.push({
      x: rand(0, innerWidth),
      y: rand(0, innerHeight),
      a: rand(0.05, 0.25),
      s: rand(0.6, 1.6),
      t: rand(0, TAU)
    });
  }

  let shooting = null;
  function maybeShoot(){
    if (shooting || reducedMotion) return;
    if (Math.random() < 0.012){ // kira2 tiap ~6-8 detik
      const y = rand(innerHeight*0.1, innerHeight*0.7);
      shooting = {
        x: -40, y, vx: rand(3.2, 4.4), vy: rand(-0.6, -0.2),
        life: 2.2, rot: rand(-0.2,0.2), size: rand(16,22)
      };
    }
  }

  // ====== Sakura Rain (on-demand) ======
  const petals = [];
  let sakuraUntil = 0; // timestamp aktif

  function spawnPetal(n=24){
    for (let i=0;i<n;i++){
      petals.push({
        x: rand(-40, innerWidth+40),
        y: rand(-80, -20),
        vx: rand(-0.6, 0.2),
        vy: rand(0.8, 1.6),
        r: rand(0, TAU),
        vr: rand(-0.02, 0.02),
        s: rand(8, 18),
        a: rand(0.35, 0.75)
      });
    }
  }

  // ====== Render Loop ======
  let last = performance.now();
  function loop(now){
    const dt = Math.min(0.05, (now - last)/1000); // detik, clamp
    last = now;

    // clear
    ctxR.clearRect(0,0,cRom.width/DPR,cRom.height/DPR);
    ctxT.clearRect(0,0,cTwi.width/DPR,cTwi.height/DPR);
    ctxS.clearRect(0,0,cSak.width/DPR,cSak.height/DPR);

    // === Romance (hearts + bokeh) ===
    // Bokeh
    for (let i=0;i<bokehs.length;i++){
      const b = bokehs[i];
      b.x += b.drift * dt * 20;
      b.y += Math.sin((i+b.drift)*0.3 + now*0.0006) * 0.15;
      // wrap
      if (b.x < -b.r) b.x = innerWidth + b.r;
      if (b.x > innerWidth + b.r) b.x = -b.r;
      if (b.y < -b.r) b.y = innerHeight + b.r;
      if (b.y > innerHeight + b.r) b.y = -b.r;

      const grd = ctxR.createRadialGradient(b.x, b.y, b.r*0.1, b.x, b.y, b.r);
      grd.addColorStop(0, `hsla(${b.hue}, 90%, 70%, ${b.a})`);
      grd.addColorStop(1, "hsla(0, 0%, 100%, 0)");
      ctxR.fillStyle = grd;
      ctxR.beginPath();
      ctxR.arc(b.x, b.y, b.r, 0, TAU);
      ctxR.fill();
    }

    // Hearts
    for (let i=hearts.length-1; i>=0; i--){
      const h = hearts[i];
      // parallax ringan menjauh dari pointer
      if (pointer.active){
        const dx = h.x - pointer.x, dy = h.y - pointer.y;
        const d2 = Math.max(24, dx*dx + dy*dy);
        const f = 60 / d2;
        h.vx += Math.max(-0.02, Math.min(0.02, dx * f));
        h.vy += Math.max(-0.02, Math.min(0.02, dy * f));
      }
      h.x += h.vx * 60 * dt;
      h.y += h.vy * 60 * dt;
      h.r += h.vr;
      h.life -= dt;

      // respawn jika lewat bawah/atas/tepi atau life habis
      if (h.y < -40 || h.y > innerHeight + 40 || h.x < -40 || h.x > innerWidth + 40 || h.life <= 0){
        hearts.splice(i,1);
        addHeart();
        continue;
      }

      // draw
      ctxR.save();
      ctxR.translate(h.x, h.y);
      ctxR.rotate(h.r);
      drawHeartPath(ctxR, h.s);
      const grd = ctxR.createLinearGradient(-h.s, -h.s, h.s, h.s);
      grd.addColorStop(0, PALETTE.a + "CC");
      grd.addColorStop(1, PALETTE.b + "CC");
      ctxR.fillStyle = grd;
      ctxR.globalAlpha = h.a;
      ctxR.fill();
      ctxR.restore();
    }

    // === Twinkle sky ===
    for (let i=0;i<twinkles.length;i++){
      const t = twinkles[i];
      t.t += dt * rand(1.2,2.0);
      const blink = (Math.sin(t.t) + 1)/2; // 0..1
      const a = t.a * (0.3 + 0.7*blink);

      ctxT.save();
      ctxT.globalAlpha = a;
      ctxT.beginPath();
      ctxT.arc(t.x, t.y, t.s, 0, TAU);
      ctxT.fillStyle = '#ffffff';
      ctxT.shadowColor = '#ffffff';
      ctxT.shadowBlur = 8;
      ctxT.fill();
      ctxT.restore();
    }

    // Shooting heart sesekali (hanya jika bukan reduced motion)
    maybeShoot();
    if (shooting){
      shooting.x += shooting.vx;
      shooting.y += shooting.vy;
      shooting.life -= dt;

      ctxT.save();
      ctxT.translate(shooting.x, shooting.y);
      ctxT.rotate(shooting.rot);
      drawHeartPath(ctxT, shooting.size);
      const grd = ctxT.createLinearGradient(-shooting.size, -shooting.size, shooting.size, shooting.size);
      grd.addColorStop(0, PALETTE.a + "AA");
      grd.addColorStop(1, PALETTE.b + "AA");
      ctxT.fillStyle = grd;
      ctxT.shadowColor = PALETTE.a;
      ctxT.shadowBlur = 12;
      ctxT.globalAlpha = 0.85;
      ctxT.fill();
      ctxT.restore();

      if (shooting.x > innerWidth + 60 || shooting.y < -60 || shooting.life <= 0){
        shooting = null;
      }
    }

    // === Sakura (aktif saat dipicu) ===
    if (performance.now() < sakuraUntil){
      if (petals.length < 120) spawnPetal(12);
    }
    for (let i=petals.length-1; i>=0; i--){
      const p = petals[i];
      p.x += p.vx; p.y += p.vy; p.r += p.vr;
      // angin ringan
      p.vx += Math.sin((now*0.001)+i)*0.0006;

      // recycle kalau keluar layar
      if (p.x < -60 || p.x > innerWidth + 60 || p.y > innerHeight + 60){
        petals.splice(i,1);
        continue;
      }

      // petal path sederhana (oval miring)
      ctxS.save();
      ctxS.translate(p.x, p.y);
      ctxS.rotate(p.r);
      ctxS.globalAlpha = p.a;
      ctxS.fillStyle = '#ffd5e1';
      ctxS.beginPath();
      ctxS.ellipse(0, 0, p.s*0.6, p.s*0.35, 0, 0, TAU);
      ctxS.fill();
      ctxS.restore();
    }

    raf = requestAnimationFrame(loop);
  }

  let raf = requestAnimationFrame(loop);

  // Pause saat tab tak aktif
  document.addEventListener('visibilitychange', ()=>{
    if (document.hidden){ cancelAnimationFrame(raf); }
    else { last = performance.now(); raf = requestAnimationFrame(loop); }
  });

  // Refresh palet saat theme var berubah
  const mo = new MutationObserver(()=>{ PALETTE = readPalette(); });
  mo.observe(document.documentElement, { attributes:true, attributeFilter:['style','class','data-theme'] });

  // API publik
  window.RomanceFX = {
    /** Panggil untuk memicu hujan sakura selama `ms` milidetik (default 10000) */
    triggerSakura: function(ms=10000){
      if (reducedMotion) return;
      sakuraUntil = performance.now() + ms;
      spawnPetal(36);
    }
  };

  // Opsional: otomatis trigger sakura ketika elemen tertentu diklik (jika ada)
  // Tanpa mengubah HTML: deteksi tombol yang "mirip" open letter
  addEventListener('click', (e)=>{
    const t = e.target.closest('[data-sakura-trigger], .open-letter, #open-letter');
    if (t) window.RomanceFX.triggerSakura(8000);
  }, { passive:true });

})();
