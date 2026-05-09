"use client";

import { useEffect, useRef } from "react";

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;
    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Generate star positions
    const stars = Array.from({ length: 200 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height * 2,
      size: Math.random() * 1.5 + 0.3,
      speed: Math.random() * 0.15 + 0.02,
      opacity: Math.random() * 0.6 + 0.1,
      pulse: Math.random() * Math.PI * 2,
    }));

    // Data pulse particles
    const pulses = Array.from({ length: 15 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -Math.random() * 0.5 - 0.1,
      life: Math.random(),
      maxLife: Math.random() * 0.5 + 0.5,
    }));

    const animate = () => {
      time += 0.01;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Stars
      stars.forEach((star) => {
        star.y -= star.speed;
        if (star.y < -10) {
          star.y = canvas.height + 10;
          star.x = Math.random() * canvas.width;
        }
        const flicker =
          Math.sin(time * 2 + star.pulse) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 200, 240, ${star.opacity * flicker})`;
        ctx.fill();
      });

      // Data pulses — tiny violet lines
      pulses.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.003;
        if (p.life <= 0) {
          p.x = Math.random() * canvas.width;
          p.y = canvas.height + 20;
          p.life = p.maxLife;
        }
        const alpha = p.life * 0.3;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + p.vx * 12, p.y + p.vy * 12);
        ctx.strokeStyle = `rgba(124, 58, 237, ${alpha})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
