/* Shared Navigation & Confetti Utility */

// Confetti engine
function launchConfetti(durationMs = 3000) {
    let canvas = document.getElementById('confetti-canvas');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'confetti-canvas';
        canvas.className = 'fixed inset-0 pointer-events-none z-[100]';
        document.body.appendChild(canvas);
    }

    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const handleResize = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    };
    window.addEventListener('resize', handleResize);

    const colors = ['#e51836', '#008284', '#ffdad8', '#FADFB7', '#FEEBC8', '#F4273F'];
    const particles = [];
    const particleCount = 160;

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: width / 2,
            y: height / 2 - 50,
            r: Math.random() * 6 + 3,
            dx: (Math.random() - 0.5) * 18,
            dy: Math.random() * -18 - 5,
            color: colors[Math.floor(Math.random() * colors.length)],
            tilt: Math.floor(Math.random() * 10) - 10,
            tiltAngleIncrement: (Math.random() * 0.08) + 0.04,
            tiltAngle: Math.random() * Math.PI,
            opacity: 1
        });
    }

    let startTime = Date.now();
    let animationId;

    function draw() {
        ctx.clearRect(0, 0, width, height);
        let elapsed = Date.now() - startTime;
        let allDead = true;

        particles.forEach((p) => {
            p.tiltAngle += p.tiltAngleIncrement;
            p.y += (Math.cos(p.tiltAngle) + 1.5 + p.r / 2) / 2;
            p.x += Math.sin(p.tiltAngle) * 2;
            p.dy += 0.45; // gravity
            p.x += p.dx;
            p.y += p.dy;

            if (elapsed > durationMs - 800) {
                p.opacity = Math.max(0, p.opacity - 0.02);
            }

            if (p.y < height && p.opacity > 0) {
                allDead = false;
                ctx.beginPath();
                ctx.lineWidth = p.r;
                ctx.strokeStyle = p.color;
                ctx.globalAlpha = p.opacity;
                ctx.moveTo(p.x + p.tilt + p.r, p.y);
                ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r);
                ctx.stroke();
                ctx.globalAlpha = 1.0;
            }
        });

        if (allDead || elapsed > durationMs + 1000) {
            cancelAnimationFrame(animationId);
            ctx.clearRect(0, 0, width, height);
            window.removeEventListener('resize', handleResize);
        } else {
            animationId = requestAnimationFrame(draw);
        }
    }

    animationId = requestAnimationFrame(draw);
}

// Top Tabs Active State Setup
document.addEventListener('DOMContentLoaded', () => {
    // Check reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion && document.body.dataset.triggerConfetti === 'true') {
        launchConfetti(4000);
    }

    // Set active link pill highlight based on pathname
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('header nav a');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === '' && href === 'index.html')) {
            link.className = 'nav-tab px-4 py-2 rounded-full font-label-sm text-xs sm:text-sm font-bold bg-primary-container text-white shadow-md transition-all duration-200 flex items-center gap-1.5';
        } else {
            link.className = 'nav-tab px-3.5 py-2 rounded-full font-label-sm text-xs sm:text-sm font-medium text-on-secondary-container hover:text-primary hover:bg-surface-container-low transition-all duration-200 flex items-center gap-1.5';
        }
    });
});
