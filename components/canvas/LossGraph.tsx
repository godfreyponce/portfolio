"use client";

import { useEffect, useRef } from "react";

export default function LossGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;
    
    // Physics State
    const points: { y: number; vy: number }[] = [];
    const numPoints = 200;
    const springConstant = 0.05;
    const dampening = 0.95;
    const mouseRadius = 20; 
    const mouseStrength = 2; // Reduced from 5

    let prevMouseY = 0;
    const mouse = { x: -1000, y: -1000 };

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || 400;
      
      // Initialize points
      points.length = 0;
      for (let i = 0; i <= numPoints; i++) {
        points.push({ y: 0, vy: 0 });
      }
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const newX = e.clientX - rect.left;
      const newY = e.clientY - rect.top;
      
      // Calculate mouse velocity to "pluck" the string
      const dy = newY - prevMouseY;
      
      // Check collision with points
      for (let i = 0; i <= numPoints; i++) {
        const px = (i / numPoints) * canvas.width;
        const dx = Math.abs(newX - px);
        if (dx < mouseRadius) {
          // Bell curve intensity: 1 at center, 0 at radius edge
          const intensity = Math.pow(1 - (dx / mouseRadius), 2);
          points[i].vy += dy * 0.1 * intensity; // Reduced from 0.3
        }
      }

      mouse.x = newX;
      mouse.y = newY;
      prevMouseY = newY;
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    resize();

    const noise = (t: number) => {
      return Math.sin(t) * Math.sin(t * 2.5) * Math.sin(t * 0.5);
    };

    const draw = () => {
      if (!canvas || !ctx) return;
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);
      
      ctx.beginPath();
      ctx.strokeStyle = "rgba(24, 24, 27, 0.6)"; 
      ctx.lineWidth = 2;

      const baseline = height * 0.7; 

      for (let i = 0; i <= numPoints; i++) {
        const x = (i / numPoints) * width;
        const progress = i / numPoints;
        const t = (x + time) * 0.01;
        const decay = Math.exp(-4 * progress); 
        const currentNoise = noise(t * 10) * (decay * 40); 
        
        const targetY = baseline - (height * 0.4 * decay) - currentNoise;

        // Physics Update
        const p = points[i];
        const acceleration = (0 - p.y) * springConstant; // Pull back to 0
        p.vy += acceleration;
        p.vy *= dampening;
        p.y += p.vy;

        const finalY = targetY + p.y;

        if (i === 0) ctx.moveTo(x, finalY);
        else ctx.lineTo(x, finalY);
      }
      
      ctx.stroke();
      time += 2;
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="w-full py-12">
        <div className="relative w-full h-48 overflow-hidden cursor-crosshair">
            <canvas 
            ref={canvasRef} 
            className="w-full h-full opacity-60"
            />
        </div>
    </div>
  );
}
