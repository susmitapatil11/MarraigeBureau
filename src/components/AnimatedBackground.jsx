import { useEffect, useRef } from 'react';

export default function AnimatedBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Read CSS variables for theme-aware colors
    const getCSSVar = (name) => 
      getComputedStyle(document.documentElement).getPropertyValue(name).trim();

    // Particles
    const particles = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -(Math.random() * 0.3 + 0.1),
      radius: Math.random() * 2 + 0.5,
      baseOpacity: Math.random() * 0.7 + 0.2,
      phase: Math.random() * Math.PI * 2,
      colorIndex: Math.floor(Math.random() * 4),
    }));

    // Constellation nodes
    const nodes = Array.from({ length: 10 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 2,
      colorIndex: Math.floor(Math.random() * 2),
    }));

    let time = 0;
    let animId;

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;

      // Get current theme colors each frame (reacts to theme switch)
      const particleColors = [
        getCSSVar('--particle-color-1'),
        getCSSVar('--particle-color-2'),
        getCSSVar('--particle-color-3'),
        getCSSVar('--particle-color-4'),
      ];
      const bgColor = '#FFFAF0';
      const nebulaColor1 = 'rgba(255, 182, 193, 0.15)';
      const nebulaColor2 = 'rgba(231, 76, 91, 0.1)';
      const nebulaColor3 = 'rgba(255, 105, 180, 0.08)';
      const constellationColor = 'rgba(231, 76, 91, 0.15)';
      const mandalaStroke = 'rgba(231, 76, 91, 0.08)';
      const mandalaCircle = 'rgba(231, 76, 91, 0.05)';
      const accentRose = '#FFB6C1';
      const accentHot = '#FF69B4';

      // Clear
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, W, H);

      // LAYER 1: Nebula blobs
      ctx.save();
      ctx.globalCompositeOperation = 'multiply';

      const blobs = [
        { bx: W * 0.15, by: H * 0.2, r: 280, color: nebulaColor1, phase: 0, speed: 0.0008 },
        { bx: W * 0.85, by: H * 0.7, r: 320, color: nebulaColor2, phase: 2, speed: 0.0006 },
        { bx: W * 0.5,  by: H * 0.5, r: 240, color: nebulaColor3, phase: 4, speed: 0.001  },
      ];

      blobs.forEach(b => {
        const cx = b.bx + Math.sin(time * b.speed * 1000 + b.phase) * 40;
        const cy = b.by + Math.cos(time * b.speed * 1000 + b.phase) * 30;
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, b.r);
        grad.addColorStop(0, b.color);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, b.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalCompositeOperation = 'source-over';
      ctx.restore();

      // LAYER 2: Constellation lines
      ctx.save();
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            const alpha = (1 - dist / 180) * 0.15;
            ctx.strokeStyle = constellationColor;
            ctx.globalAlpha = alpha;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
      nodes.forEach((n, i) => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
        ctx.globalAlpha = 0.7;
        ctx.fillStyle = i % 2 === 0 ? '#E74C5B' : '#FF69B4'; // Romantic Pinks/Reds
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      ctx.restore();

      const drawHeart = (x, y, size, alpha, color) => {
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(x, y + size / 4);
        ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + size / 4);
        ctx.bezierCurveTo(x - size / 2, y + size / 2, x, y + size * 0.75, x, y + size);
        ctx.bezierCurveTo(x, y + size * 0.75, x + size / 2, y + size / 2, x + size / 2, y + size / 4);
        ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + size / 4);
        ctx.fill();
        ctx.restore();
      };

      // LAYER 3: Floating heart particles
      ctx.save();
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
        const opacity = p.baseOpacity * (0.5 + 0.5 * Math.sin(time * 1.5 + p.phase));
        drawHeart(p.x, p.y, p.radius * 4, opacity * 0.4, particleColors[p.colorIndex]);
      });
      ctx.globalAlpha = 1;
      ctx.restore();

      // LAYER 4: Rotating mandala ring
      ctx.save();
      ctx.translate(W / 2, H / 2);
      ctx.rotate(time * 0.025);
      for (let i = 0; i < 12; i++) {
        ctx.save();
        ctx.rotate((i / 12) * Math.PI * 2);
        ctx.strokeStyle = mandalaStroke;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(60, -80, -60, -80, 0, -180);
        ctx.stroke();
        ctx.restore();
      }
      ctx.strokeStyle = mandalaCircle;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 0, 195, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      time += 0.016;
      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
        display: 'block',
      }}
    />
  );
}
