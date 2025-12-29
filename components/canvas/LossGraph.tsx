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
    
    // Configuration
    const gridSpacing = 40;
    const speed = 2; // Speed of the scrolling
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener("resize", resize);
    resize();

    // Noise function for jaggedness (simple pseudo-random)
    const noise = (t: number) => {
      return Math.sin(t) * Math.sin(t * 2.5) * Math.sin(t * 0.5);
    };

    const draw = () => {
      if (!canvas || !ctx) return;
      
      const width = canvas.width;
      const height = canvas.height;
      
      // Clear
      ctx.clearRect(0, 0, width, height);
      
      // Draw Loss Curve
      ctx.beginPath();
      ctx.strokeStyle = "rgba(24, 24, 27, 0.6)"; // Zinc-900 with subtle opacity
      ctx.lineWidth = 1.5;

      const baseline = height * 0.7; 
      
      for (let x = 0; x < width; x+=5) {
        const t = (x + time) * 0.01;
        const progress = x / width; 
        const decay = Math.exp(-4 * progress); 
        const currentNoise = noise(t * 10) * (decay * 100); 
        const y = baseline - (height * 0.4 * decay) - currentNoise;
        
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      
      ctx.stroke();

      time += speed;
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="w-full py-12">
        <div className="relative w-full h-48 overflow-hidden">
            <canvas 
            ref={canvasRef} 
            className="w-full h-full opacity-60"
            />
        </div>
    </div>
  );
}
