'use client';

import { useEffect, useRef } from 'react';

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Particles (matrix-like falling code)
    const COLS = Math.floor(width / 20);
    const drops: number[] = Array(COLS).fill(1);
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>{}[]()/*-+=#@!$%^&'.split('');

    function draw() {
      ctx!.fillStyle = 'rgba(5,5,8,0.05)';
      ctx!.fillRect(0, 0, width, height);

      ctx!.fillStyle = '#00f5ff';
      ctx!.font = '14px JetBrains Mono, monospace';

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * 20;
        const y = drops[i] * 20;

        // Gradient opacity based on position
        const alpha = Math.random() > 0.9 ? 1 : 0.15;
        ctx!.fillStyle = `rgba(0,245,255,${alpha})`;
        ctx!.fillText(char, x, y);

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    // Floating nodes (circuit-like)
    const nodes: Array<{ x: number; y: number; vx: number; vy: number; r: number }> = [];
    for (let i = 0; i < 40; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 2 + 1,
      });
    }

    function drawNodes() {
      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx!.beginPath();
            ctx!.strokeStyle = `rgba(0,245,255,${0.1 * (1 - dist / 150)})`;
            ctx!.lineWidth = 0.5;
            ctx!.moveTo(nodes[i].x, nodes[i].y);
            ctx!.lineTo(nodes[j].x, nodes[j].y);
            ctx!.stroke();
          }
        }
        // Draw node
        ctx!.beginPath();
        ctx!.arc(nodes[i].x, nodes[i].y, nodes[i].r, 0, Math.PI * 2);
        ctx!.fillStyle = 'rgba(0,245,255,0.4)';
        ctx!.fill();

        // Move
        nodes[i].x += nodes[i].vx;
        nodes[i].y += nodes[i].vy;
        if (nodes[i].x < 0 || nodes[i].x > width) nodes[i].vx *= -1;
        if (nodes[i].y < 0 || nodes[i].y > height) nodes[i].vy *= -1;
      }
    }

    let frame = 0;
    function animate() {
      animId = requestAnimationFrame(animate);
      frame++;

      if (frame % 3 === 0) draw(); // matrix rain at slower rate
      drawNodes();
    }

    animate();

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 opacity-30 pointer-events-none"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
