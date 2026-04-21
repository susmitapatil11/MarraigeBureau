import { useEffect, useRef } from 'react';

export default function ClickEffect() {
  const canvasRef = useRef(null);
  const ripplesRef = useRef([]);

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

    const getCSSVar = (name) =>
      getComputedStyle(document.documentElement).getPropertyValue(name).trim();

    const handleClick = (e) => {
      const rippleColor = getCSSVar('--click-ripple') || 'rgba(231, 76, 91, 0.4)';
      ripplesRef.current.push({
        x: e.clientX,
        y: e.clientY,
        radius: 0,
        alpha: 1,
        rippleColor,
      });
    };

    window.addEventListener('click', handleClick);

    let animId;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ripplesRef.current = ripplesRef.current.filter(r => r.alpha > 0.01);

      ripplesRef.current.forEach(r => {
        // Main filled ripple
        ctx.save();
        ctx.globalAlpha = r.alpha * 0.35;
        ctx.fillStyle = r.rippleColor;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Outer expanding ring
        ctx.save();
        ctx.globalAlpha = r.alpha * 0.6;
        ctx.strokeStyle = r.rippleColor;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        r.radius += 4.5;
        r.alpha -= 0.028;
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('click', handleClick);
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
        zIndex: 9999,
        pointerEvents: 'none',
        display: 'block',
      }}
    />
  );
}
