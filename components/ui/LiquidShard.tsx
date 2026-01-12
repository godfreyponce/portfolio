"use client";

import { motion, useSpring, useTransform, useMotionValue } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";
import { useState, useEffect } from "react";

export default function LiquidShard() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring physics for the "Liquid" feel
  const springConfig = { damping: 20, stiffness: 150, mass: 0.5 };
  const rotateX = useSpring(useTransform(mouseY, [-200, 200], [15, -15]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-200, 200], [-15, 15]), springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div className="relative w-fit h-fit flex items-center justify-center p-12 group">
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, perspective: 1000 }}
        className="relative flex flex-col gap-8 p-6 bg-white/5 backdrop-blur-3xl border border-white/20 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1),inset_0_0_20px_rgba(255,255,255,0.1)] transition-colors duration-500 hover:bg-white/10"
      >
        {/* Subtle Liquid Shine Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        <a href="https://github.com/godfreyponce" target="_blank" rel="noopener noreferrer" 
           className="text-zinc-400 hover:text-zinc-900 transition-all hover:scale-110 active:scale-95">
          <Github size={22} />
        </a>
        <a href="https://linkedin.com/in/godfreyponce" target="_blank" rel="noopener noreferrer"
           className="text-zinc-400 hover:text-zinc-900 transition-all hover:scale-110 active:scale-95">
          <Linkedin size={22} />
        </a>
        <a href="mailto:poncegodfrey@gmail.com"
           className="text-zinc-400 hover:text-zinc-900 transition-all hover:scale-110 active:scale-95">
          <Mail size={22} />
        </a>
      </motion.div>
    </div>
  );
}
