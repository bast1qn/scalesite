
export const triggerConfetti = () => {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '99999';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: any[] = [];
    const colors = ['#E11D48', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'];

    for (let i = 0; i < 150; i++) {
        particles.push({
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            w: Math.random() * 10 + 5,
            h: Math.random() * 10 + 5,
            vx: (Math.random() - 0.5) * 20,
            vy: (Math.random() - 0.5) * 20 - 5,
            color: colors[Math.floor(Math.random() * colors.length)],
            gravity: 0.5,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 10
        });
    }

    let animationId: number;

    const render = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        let activeParticles = 0;

        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity;
            p.rotation += p.rotationSpeed;

            if (p.y < canvas.height) {
                activeParticles++;
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
                ctx.restore();
            }
        });

        if (activeParticles > 0) {
            animationId = requestAnimationFrame(render);
        } else {
            document.body.removeChild(canvas);
            cancelAnimationFrame(animationId);
        }
    };

    render();
};
