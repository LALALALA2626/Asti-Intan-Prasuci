document.addEventListener('DOMContentLoaded', () => {
    // ===== Fade-to-Love controller =====
    window.fadeToLove = function(opts = {}) {
        const {
            image = './Assets/gallery/fade-love.jpg',
            duration = 1200,
            hold = 1600,
            next = 'letter'
        } = opts;

        const node = document.getElementById('love-fade');
        if (!node) {
            console.warn('#love-fade not found');
            return;
        };

        // fade-in
        node.style.setProperty('--love-bg', `url('${image}')`);
        node.classList.add('show');
        setTimeout(() => {
            node.classList.add('hold');
        }, duration);

        // fade-out
        setTimeout(() => {
            node.classList.remove('hold');
            node.classList.add('hide');
            setTimeout(() => {
                node.classList.remove('show', 'hide');
                node.style.removeProperty('--love-bg');
                if (next === 'letter') openLetter();
                else if (next === 'gallery') window.location.href = 'gallery.html';
            }, 700);
        }, duration + hold);
    }

    // --- PENTING: Kustomisasi di sini ---
    const anniversaryDate = new Date("Aug 16, 2025 00:00:00").getTime();

    // ✅ DISINKRONKAN dengan semua nama file gambar kamu
    const floatingPhotoUrls = [
        "./Assets/gallery/IMG-20250707-WA0022.jpg",
        "./Assets/gallery/IMG-20250707-WA0023.jpg",
        "./Assets/gallery/IMG-20250707-WA0025.jpg",
        "./Assets/gallery/IMG-20250707-WA0026.jpg",
        "./Assets/gallery/IMG-20250707-WA0027.jpg",
        "./Assets/gallery/IMG-20250707-WA0028.jpg",
        "./Assets/gallery/IMG-20250707-WA0029.jpg",
        "./Assets/gallery/IMG-20250707-WA0030.jpg",
        "./Assets/gallery/IMG-20250707-WA0031.jpg",
        "./Assets/gallery/IMG-20250707-WA0038.jpg",
        "./Assets/gallery/IMG-20250707-WA0041.jpg",
        "./Assets/gallery/CANTIK.jpg",
        "./Assets/gallery/1.jpg",
        "./Assets/gallery/12.jpg",
        "./Assets/gallery/IMG-20250707-WA0061.jpg"
    ];

    const letterOverlay = document.getElementById('letter-overlay');
    const letterContent = document.querySelector('.letter-content');
    const birthdaySurprise = document.getElementById('birthday-surprise');
    const music = document.getElementById('background-music');
    const musicControl = document.getElementById('music-control');
    const playIcon = document.getElementById('play-icon');
    const pauseIcon = document.getElementById('pause-icon');
    const sunflowerContainer = document.getElementById('sunflower-container');
    let isMusicPlaying = false;
    let isOverlayOpening = false;

    // Musik toggle
    musicControl.addEventListener('click', () => {
        if (!isMusicPlaying) {
            music.play().then(() => {
                isMusicPlaying = true;
                playIcon.style.display = 'none';
                pauseIcon.style.display = 'block';
            }).catch((e)=>console.warn('Autoplay diblokir, perlu interaksi.', e));
        } else {
            music.pause();
            isMusicPlaying = false;
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
        }
    });

    // Countdown
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = anniversaryDate - now;
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("days").textContent = Math.max(0, days);
        document.getElementById("hours").textContent = Math.max(0, hours);
        document.getElementById("minutes").textContent = Math.max(0, minutes);
        document.getElementById("seconds").textContent = Math.max(0, seconds);

        if (distance < 0) {
            document.getElementById("countdown").innerHTML = "<p>Waktu telah tiba! Selamat merayakan!</p>";
            clearInterval(countdownInterval);
        }
    }
    const countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown();

    // Open letter overlay dengan anim + foto mengambang
    window.openLetter = function () {
        if (isOverlayOpening) return;
        isOverlayOpening = true;

        sunflowerContainer.classList.add('blooming');

        setTimeout(() => {
            document.body.classList.add('no-scroll');
            if (!isMusicPlaying) {
                music.play().then(() => {
                    isMusicPlaying = true;
                    playIcon.style.display = 'none';
                    pauseIcon.style.display = 'block';
                }).catch(e => console.error("Autoplay musik gagal, interaksi pengguna diperlukan.", e));
            }
            letterContent.classList.remove('hidden');
            birthdaySurprise.classList.remove('visible');

            const oldElements = letterOverlay.querySelectorAll('.floating-photo, .sakura-petal');
            oldElements.forEach(el => el.remove());

            letterOverlay.classList.add('visible');

            const movers = [];
            const MAX_TRY = 100;
            letterOverlay.style.setProperty('--photo-count', floatingPhotoUrls.length);

            function avoidLetterArea(x, y, size) {
                const rect = document.querySelector('.letter-content').getBoundingClientRect();
                const pad = 12;
                const overlaps = !(x + size / 2 < rect.left - pad ||
                                   x - size / 2 > rect.right + pad ||
                                   y + size / 2 < rect.top - pad ||
                                   y - size / 2 > rect.bottom + pad);
                return overlaps;
            }

            function randomStart(size) {
                let x, y, t = 0;
                do {
                    x = Math.random() * window.innerWidth;
                    y = Math.random() * window.innerHeight;
                    t++;
                } while (avoidLetterArea(x, y, size) && t < MAX_TRY);
                return { x, y };
            }

            floatingPhotoUrls.forEach((url, i) => {
                const img = document.createElement('img');
                img.src = url;
                img.className = 'floating-photo';
                letterOverlay.insertBefore(img, letterOverlay.firstChild);

                const size = Math.floor(180 + Math.random() * 100);
                const rot = Math.random() * 40 - 20;
                img.style.setProperty('--size', size + 'px');
                img.style.setProperty('--base-rot', rot + 'deg');
                img.style.animationDelay = (Math.random() * 1.2) + 's';

                const start = randomStart(size);
                setTimeout(() => {
                    img.style.top = `${start.y}px`;
                    img.style.left = `${start.x}px`;
                    img.style.transform = `translate(-50%,-50%) scale(1) rotate(${rot}deg)`;
                    img.style.opacity = '1';
                }, 60 * i);

                const speed = 0.25 + Math.random() * 0.5;
                const ang = Math.random() * Math.PI * 2;
                const vx = Math.cos(ang) * speed;
                const vy = Math.sin(ang) * speed;
                const state = { el: img, x: start.x, y: start.y, vx, vy, size, dragging: false, lastMouse: null };
                movers.push(state);

                const startDrag = (e) => {
                    e.preventDefault();
                    const p = ('touches' in e) ? e.touches[0] : e;
                    state.dragging = true;
                    state.lastMouse = { x: p.clientX, y: p.clientY };
                    img.style.transition = 'none';
                };
                const duringDrag = (e) => {
                    if (!state.dragging) return;
                    const p = ('touches' in e) ? e.touches[0] : e;
                    const dx = p.clientX - state.lastMouse.x;
                    const dy = p.clientY - state.lastMouse.y;
                    state.x += dx; state.y += dy;
                    state.lastMouse = { x: p.clientX, y: p.clientY };
                    state.el.style.left = state.x + 'px';
                    state.el.style.top = state.y + 'px';
                };
                const endDrag = () => {
                    if (state.dragging && state.lastMouse) {
                        state.vx = (Math.random() * 0.4 - 0.2) + (Math.random() * 0.3);
                        state.vy = (Math.random() * 0.4 - 0.2) + (Math.random() * 0.3);
                    }
                    state.dragging = false;
                    state.lastMouse = null;
                    img.style.transition = '';
                };

                img.addEventListener('mousedown', startDrag);
                window.addEventListener('mousemove', duringDrag);
                window.addEventListener('mouseup', endDrag);
                img.addEventListener('touchstart', startDrag, { passive: false });
                window.addEventListener('touchmove', duringDrag, { passive: false });
                window.addEventListener('touchend', endDrag);
            });

            function drift() {
                const raf = () => {
                    const id = requestAnimationFrame(raf);
                    drift._id = id;
                    const W = window.innerWidth, H = window.innerHeight;
                    const letterRect = document.querySelector('.letter-content').getBoundingClientRect();

                    movers.forEach(m => {
                        if (m.dragging) return;
                        const jit = 0.02;
                        m.vx += (Math.random() - 0.5) * jit;
                        m.vy += (Math.random() - 0.5) * jit;
                        const max = 0.9;
                        m.vx = Math.max(Math.min(m.vx, max), -max);
                        m.vy = Math.max(Math.min(m.vy, max), -max);
                        m.x += m.vx; m.y += m.vy;

                        if (m.x - m.size / 2 < 0) { m.x = m.size / 2; m.vx *= -1; }
                        if (m.x + m.size / 2 > W) { m.x = W - m.size / 2; m.vx *= -1; }
                        if (m.y - m.size / 2 < 0) { m.y = m.size / 2; m.vy *= -1; }
                        if (m.y + m.size / 2 > H) { m.y = H - m.size / 2; m.vy *= -1; }

                        const overlaps = !(m.x + m.size / 2 < letterRect.left ||
                                           m.x - m.size / 2 > letterRect.right ||
                                           m.y + m.size / 2 < letterRect.top ||
                                           m.y - m.size / 2 > letterRect.bottom);
                        if (overlaps) {
                            const cx = (letterRect.left + letterRect.right) / 2;
                            const cy = (letterRect.top + letterRect.bottom) / 2;
                            const dx = m.x - cx, dy = m.y - cy;
                            const len = Math.max(1, Math.hypot(dx, dy));
                            m.vx = (dx / len) * 0.8;
                            m.vy = (dy / len) * 0.8;
                            m.x += m.vx * 4;
                            m.y += m.vy * 4;
                        }

                        m.el.style.left = m.x + 'px';
                        m.el.style.top = m.y + 'px';
                    });
                };
                raf();
                drift.stop = () => cancelAnimationFrame(drift._id);
            }
            drift();

            window.addEventListener('resize', () => {
                const W = window.innerWidth, H = window.innerHeight;
                movers.forEach(m => {
                    m.x = Math.min(Math.max(m.x, m.size / 2), W - m.size / 2);
                    m.y = Math.min(Math.max(m.y, m.size / 2), H - m.size / 2);
                });
            });

            // Sakura
            for (let i = 0; i < 50; i++) {
                const petal = document.createElement('div');
                petal.className = 'sakura-petal';
                petal.innerHTML = '🌸';
                petal.style.left = `${Math.random() * 100}vw`;
                petal.style.animationDuration = `${Math.random() * 3 + 5}s`;
                petal.style.animationDelay = `${Math.random() * 5}s`;
                petal.style.fontSize = `${Math.random() * 10 + 10}px`;
                letterOverlay.insertBefore(petal, letterOverlay.firstChild);
            }
        }, 600);
    };

    window.triggerBirthdaySurprise = function () {
        letterContent.classList.add('hidden');
        birthdaySurprise.classList.add('visible');

        const colors = ['#800000', '#ffb3b3', '#ffffff', '#ffdada', '#E8D5C4'];
        birthdaySurprise.querySelectorAll('.confetti').forEach(c => c.remove());

        for (let i = 0; i < 200; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = `${Math.random() * 100}vw`;
            confetti.style.top = `${-20 + Math.random() * 20}px`;
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.transform = `scale(${Math.random() + 0.5}) rotate(${Math.random() * 360}deg)`;
            confetti.style.animationDelay = `${Math.random() * 0.2}s`;
            birthdaySurprise.appendChild(confetti);
            setTimeout(() => { confetti.remove(); }, 4000);
        }
    }

    window.closeLetterOverlay = function () {
        document.body.classList.remove('no-scroll');
        letterOverlay.classList.remove('visible');
        sunflowerContainer.classList.remove('blooming');
        isOverlayOpening = false;
    }
});
