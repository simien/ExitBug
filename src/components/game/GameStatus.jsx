
import React, { useEffect, useState } from 'react';
import { useGame } from '@/context/GameContext';
import { cn } from "@/lib/utils";

export default function GameStatus() {
  const { state } = useGame();
  const { message, gameState } = state;
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Trigger animation on message change
    const animTimer = setTimeout(() => setAnimate(true), 0);
    const timer = setTimeout(() => setAnimate(false), 500); // Pulse duration
    return () => {
      clearTimeout(timer);
      clearTimeout(animTimer);
    };
  }, [message]);

  if (!message) return null;

  return (
    <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none w-full max-w-md text-center px-4">
      <div className={cn(
        "inline-block px-4 py-2 rounded-full border bg-black/60 backdrop-blur-md shadow-lg transition-all duration-300",
        gameState === 'won' ? "border-green-500/30 text-green-400" :
          gameState === 'lost' ? "border-red-500/30 text-red-400" :
            "border-zinc-800 text-zinc-300",
        animate ? "scale-105 bg-zinc-900/80" : "scale-100"
      )}>
        <p className="text-sm font-medium tracking-wide font-mono">
          {message}
        </p>
      </div>
    </div>
  );
}
