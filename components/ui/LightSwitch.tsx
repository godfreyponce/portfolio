"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function LightSwitch() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMount] = useState(false);

  useEffect(() => {
    setMount(true);
  }, []);

  if (!mounted) return null;

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className="flex flex-col items-center">
      {/* Wall Plate */}
      <div className="relative w-16 h-24 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_4px_10px_rgba(0,0,0,0.1)] flex items-center justify-center transition-colors duration-500">
        
        {/* The Toggle Button */}
        <button 
          onClick={toggleTheme}
          className="relative w-6 h-12 bg-white dark:bg-zinc-200 rounded shadow-sm border border-zinc-200 dark:border-zinc-400 group overflow-hidden"
        >
          {/* Top/Bottom highlights to create the rocking effect */}
          <div className={`
            absolute inset-0 transition-all duration-300
            ${theme === "light" 
              ? "bg-gradient-to-b from-zinc-50 to-zinc-200 shadow-[inset_0_4px_6px_rgba(0,0,0,0.1)]" 
              : "bg-gradient-to-t from-zinc-50 to-zinc-200 shadow-[inset_0_-4px_6px_rgba(0,0,0,0.1)]"}
          `} />
          
          {/* Subtle horizontal line in middle */}
          <div className="absolute top-1/2 left-0 w-full h-px bg-zinc-300/50" />
        </button>

        {/* Subtle screw details */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600 shadow-inner" />
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600 shadow-inner" />
      </div>
    </div>
  );
}
