document.addEventListener('DOMContentLoaded', () => {
    // Efek Card Stacking
    const cards = document.querySelectorAll('.gallery-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const cardIndex = Array.from(cards).indexOf(entry.target);
                // Terapkan scaling pada kartu-kartu di belakangnya
                for (let i = 0; i < cardIndex; i++) {
                    const scaleValue = 1 - (cardIndex - i) * 0.05;
                    const translateValue = (cardIndex - i) * -15;
                    cards[i].style.transform = `scale(${Math.max(0.8, scaleValue)}) translateY(${translateValue}px)`;
                    cards[i].style.opacity = 1 - (cardIndex - i) * 0.1;
                }
            }
        });
    }, { threshold: 0.9 });

    cards.forEach(card => observer.observe(card));

    // Background Particle Effect
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = innerWidth;
    canvas.height = innerHeight;

    let particlesArray = [];
    const colors = ['#ffb3b3', '#E8D5C4', '#ffffff'];

    class Particle {
        constructor(x, y, dx, dy, size, color) {
            this.x = x;
            this.y = y;
            this.dx = dx;
            this.dy = dy;
            this.size = size;
            this.color = color;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
        update() {
            if (this.x > canvas.width || this.x < 0) this.dx *= -1;
            if (this.y > canvas.height || this.y < 0) this.dy *= -1;
            this.x += this.dx;
            this.y += this.dy;
            this.draw();
        }
    }

    function init() {
        particlesArray = [];
        const numberOfParticles = Math.max(30, Math.floor((innerWidth * innerHeight) / 9000));
        for (let i = 0; i < numberOfParticles; i++) {
            const size = (Math.random() * 2) + 1;
            const x = (Math.random() * (innerWidth - size * 4)) + size * 2;
            const y = (Math.random() * (innerHeight - size * 4)) + size * 2;
            const dx = (Math.random() * 0.4) - 0.2;
            const dy = (Math.random() * 0.4) - 0.2;
            const color = colors[Math.floor(Math.random() * colors.length)];
            particlesArray.push(new Particle(x, y, dx, dy, size, color));
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
    }

    init();
    animate();

    window.addEventListener('resize', () => {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        init();
    });
});
