
/**
 * World Class Confetti Effect
 * Enhanced with more particles, physics, and visual polish
 */
export const triggerConfetti = () => {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '99999';
    canvas.style.userSelect = 'none';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Enhanced color palette with gradients
    const colors = [
        '#E11D48', // Rose
        '#3B82F6', // Blue
        '#10B981', // Emerald
        '#F59E0B', // Amber
        '#8B5CF6', // Violet
        '#EC4899', // Pink
        '#06B6D4', // Cyan
        '#F97316', // Orange
    ];

    interface Particle {
        x: number;
        y: number;
        vx: number;
        vy: number;
        size: number;
        color: string;
        rotation: number;
        rotationSpeed: number;
        gravity: number;
        friction: number;
        opacity: number;
        type: 'square' | 'circle' | 'triangle' | 'star';
        wobble: number;
        wobbleSpeed: number;
        scale: number;
    }

    const particles: Particle[] = [];

    // Create more particles with variety
    for (let i = 0; i < 200; i++) {
        const angle = (Math.PI * 2 * i) / 200 + Math.random() * 0.5;
        const velocity = 15 + Math.random() * 20;

        particles.push({
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            vx: Math.cos(angle) * velocity + (Math.random() - 0.5) * 5,
            vy: Math.sin(angle) * velocity - 10 - Math.random() * 15,
            size: 6 + Math.random() * 12,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 15,
            gravity: 0.25 + Math.random() * 0.15,
            friction: 0.98,
            opacity: 1,
            type: ['square', 'circle', 'triangle', 'star'][Math.floor(Math.random() * 4)] as Particle['type'],
            wobble: Math.random() * Math.PI * 2,
            wobbleSpeed: 0.05 + Math.random() * 0.1,
            scale: 1,
        });
    }

    let animationId: number;
    let time = 0;

    const drawStar = (cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) => {
        let rot = Math.PI / 2 * 3;
        let x = cx;
        let y = cy;
        const step = Math.PI / spikes;

        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius);

        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
        }

        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
        ctx.fill();
    };

    const drawTriangle = (x: number, y: number, size: number) => {
        ctx.beginPath();
        ctx.moveTo(x, y - size / 2);
        ctx.lineTo(x - size / 2, y + size / 2);
        ctx.lineTo(x + size / 2, y + size / 2);
        ctx.closePath();
        ctx.fill();
    };

    const render = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        time += 1;

        let activeParticles = 0;

        particles.forEach(p => {
            // Physics update
            p.vx *= p.friction;
            p.vy *= p.friction;
            p.vy += p.gravity;
            p.x += p.vx;
            p.y += p.vy;
            p.rotation += p.rotationSpeed;
            p.wobble += p.wobbleSpeed;

            // Scale animation
            p.scale = 1 + Math.sin(p.wobble) * 0.2;

            // Fade out based on position
            if (p.y > canvas.height * 0.7) {
                p.opacity = Math.max(0, 1 - (p.y - canvas.height * 0.7) / (canvas.height * 0.3));
            }

            if (p.y < canvas.height && p.opacity > 0.01) {
                activeParticles++;
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);
                ctx.scale(p.scale, p.scale);
                ctx.globalAlpha = p.opacity;
                ctx.fillStyle = p.color;

                // Add shadow for depth
                ctx.shadowColor = p.color;
                ctx.shadowBlur = 10;

                const size = p.size;

                switch (p.type) {
                    case 'circle':
                        ctx.beginPath();
                        ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
                        ctx.fill();
                        break;
                    case 'triangle':
                        drawTriangle(0, 0, size);
                        break;
                    case 'star':
                        drawStar(0, 0, 5, size / 2, size / 4);
                        break;
                    default:
                        ctx.fillRect(-size / 2, -size / 2, size, size);
                }

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

/**
 * Subtle celebration burst for smaller successes
 */
export const triggerCelebration = () => {
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

    const colors = ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981'];

    interface BurstParticle {
        x: number;
        y: number;
        vx: number;
        vy: number;
        size: number;
        color: string;
        opacity: number;
        life: number;
        maxLife: number;
    }

    const particles: BurstParticle[] = [];
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    for (let i = 0; i < 50; i++) {
        const angle = (Math.PI * 2 * i) / 50;
        particles.push({
            x: centerX,
            y: centerY,
            vx: Math.cos(angle) * (5 + Math.random() * 5),
            vy: Math.sin(angle) * (5 + Math.random() * 5),
            size: 3 + Math.random() * 5,
            color: colors[Math.floor(Math.random() * colors.length)],
            opacity: 1,
            life: 0,
            maxLife: 60 + Math.random() * 30,
        });
    }

    let animationId: number;

    const render = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let activeParticles = 0;

        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vx *= 0.98;
            p.vy *= 0.98;
            p.life++;
            p.opacity = 1 - p.life / p.maxLife;

            if (p.life < p.maxLife) {
                activeParticles++;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * p.opacity, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.opacity;
                ctx.shadowColor = p.color;
                ctx.shadowBlur = 15;
                ctx.fill();
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
