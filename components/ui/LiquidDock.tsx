"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";
import { useRef } from "react";

function DockIcon({ href, children }: { href: string; children: React.ReactNode }) {
  const mouseX = useMotionValue(Infinity);
  const ref = useRef<HTMLDivElement>(null);

  // Z-layering effect
  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() || { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  // Spring physics for "energy transfer"
  const widthSync = useTransform(distance, [-100, 0, 100], [40, 60, 40]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      style={{ width }}
      className="aspect-square flex items-center justify-center rounded-full bg-white/5 dark:bg-white/5 backdrop-blur-sm border border-white/10 shadow-inner group transition-colors duration-500 hover:bg-white/20"
    >
      <a href={href} target="_blank" rel="noopener noreferrer" className="text-zinc-500 group-hover:text-zinc-900 transition-colors">
        {children}
      </a>
    </motion.div>
  );
}

export default function LiquidDock() {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] pointer-events-none">
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.5 }}
        className="flex items-center gap-4 px-4 py-3 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.1)] pointer-events-auto"
      >
        <DockIcon href="https://github.com/godfreyponce">
          <Github size={20} />
        </DockIcon>
        <DockIcon href="https://linkedin.com/in/godfreyponce">
          <Linkedin size={20} />
        </DockIcon>
        <DockIcon href="mailto:poncegodfrey@gmail.com">
          <Mail size={20} />
        </DockIcon>
      </motion.div>
    </div>
  );
}
