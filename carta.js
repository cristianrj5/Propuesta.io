
// --- 1. FONDO DE CORAZONES EN CANVAS ---
const canvas = document.getElementById('heartsCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Heart {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 20;
        this.size = Math.random() * 15 + 8;
        this.speedY = Math.random() * 1.5 + 0.8;
        this.speedX = Math.sin(Math.random() * Math.PI) * 0.8;
        this.opacity = Math.random() * 0.6 + 0.3;
        this.color = `hsl(${Math.random() * 30 + 330}, 100%, 65%)`;
    }

    update() {
        this.y -= this.speedY;
        this.x += Math.sin(this.y * 0.02) * 0.5;
        if (this.y < -20) {
            this.reset();
        }
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        const topCurveHeight = this.size * 0.3;
        ctx.moveTo(this.x, this.y + topCurveHeight);
        // Dibujar forma de corazón
        ctx.bezierCurveTo(
            this.x, this.y,
            this.x - this.size / 2, this.y,
            this.x - this.size / 2, this.y + topCurveHeight
        );
        ctx.bezierCurveTo(
            this.x - this.size / 2, this.y + (this.size + topCurveHeight) / 2,
            this.x, this.y + this.size,
            this.x, this.y + this.size
        );
        ctx.bezierCurveTo(
            this.x, this.y + this.size,
            this.x + this.size / 2, this.y + (this.size + topCurveHeight) / 2,
            this.x + this.size / 2, this.y + topCurveHeight
        );
        ctx.bezierCurveTo(
            this.x + this.size / 2, this.y,
            this.x, this.y,
            this.x, this.y + topCurveHeight
        );
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
}

const hearts = Array.from({ length: 25 }, () => new Heart());

function animateHearts() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hearts.forEach(heart => {
        heart.update();
        heart.draw();
    });
    requestAnimationFrame(animateHearts);
}
animateHearts();

// --- 2. APERTURA DEL SOBRE ---
const envelopeBtn = document.getElementById('envelopeBtn');
const envelope = document.getElementById('envelope');
const envelopeScreen = document.getElementById('envelopeScreen');
const letterCard = document.getElementById('letterCard');

envelopeBtn.addEventListener('click', () => {
    envelope.classList.add('open');
    setTimeout(() => {
        envelopeScreen.style.display = 'none';
        letterCard.style.display = 'block';
        // Scroll suave arriba por si acaso
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 700);
});

// --- 3. BOTÓN ESCURRIDIZO "NO" ---
const noBtn = document.getElementById('noBtn');
const btnContainer = document.getElementById('btnContainer');

// Posicionar inicialmente el botón No
function initNoBtnPosition() {
    noBtn.style.position = 'relative';
    noBtn.style.left = '0px';
    noBtn.style.top = '0px';
}
initNoBtnPosition();

function moveNoButton(e) {
    if (e) e.preventDefault(); // Prevenir toque accidental en móvil

    const padding = 20;
    // Definir límites dentro de la pantalla visible
    const maxX = window.innerWidth - noBtn.offsetWidth - padding;
    const maxY = window.innerHeight - noBtn.offsetHeight - padding;

    // Coordenadas aleatorias absolutas en la pantalla
    const randomX = Math.max(padding, Math.floor(Math.random() * maxX));
    const randomY = Math.max(padding, Math.floor(Math.random() * maxY));

    noBtn.style.position = 'fixed';
    noBtn.style.left = `${randomX}px`;
    noBtn.style.top = `${randomY}px`;
    noBtn.style.zIndex = '999';
}

// Eventos tanto para mouse como para touch screens de móviles
noBtn.addEventListener('touchstart', moveNoButton, { passive: false });
noBtn.addEventListener('mouseover', moveNoButton);
noBtn.addEventListener('click', moveNoButton);

// --- 4. ACCIÓN DEL BOTÓN "¡SÍ!" ---
const yesBtn = document.getElementById('yesBtn');
const celebrationCard = document.getElementById('celebrationCard');

yesBtn.addEventListener('click', () => {
    letterCard.style.display = 'none';
    celebrationCard.style.display = 'block';

    // Efecto de Confeti Masivo con Corazones
    triggerConfetti();
});

function triggerConfetti() {
    const duration = 4 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        // Disparos desde lados opuestos
        confetti(Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
            colors: ['#ff0055', '#ff6b9d', '#ffd700', '#ffffff']
        }));
        confetti(Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
            colors: ['#ff0055', '#ff6b9d', '#ffd700', '#ffffff']
        }));
    }, 250);
}