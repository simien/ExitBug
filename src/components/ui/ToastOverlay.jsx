
import React, { useEffect } from 'react';
import { useGame } from '@/context/GameContext';
import { Lightning as Zap, X } from '@phosphor-icons/react';
import { Button } from "@/components/ui/button";

export default function ToastOverlay() {
  const { state, dispatch } = useGame();
  const { notification } = state;

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        dispatch({ type: 'DISMISS_NOTIFICATION' });
      }, 5000); // Auto dismiss after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [notification, dispatch]);

  if (!notification) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-sm px-4">
      <div className="animate-in slide-in-from-bottom-full fade-in duration-500 relative flex items-center gap-4 bg-zinc-950 border border-amber-500/30 text-zinc-100 px-4 py-3 rounded-lg shadow-2xl shadow-amber-500/10 mx-auto w-full">

        {/* Glow effect */}
        <div className="absolute inset-0 bg-amber-500/5 rounded-lg animate-pulse pointer-events-none" />

        <div className="p-2 bg-amber-500/10 rounded-full border border-amber-500/20 shrink-0">
          <Zap className="w-5 h-5 text-amber-500" weight="fill" />
        </div>

        <div className="flex-1">
          <h4 className="text-sm font-bold text-amber-500 mb-0.5">Upgrade Available!</h4>
          <p className="text-xs text-zinc-400">{notification.message}</p>
        </div>

        <button
          onClick={() => dispatch({ type: 'DISMISS_NOTIFICATION' })}
          className="p-1 hover:bg-white/10 rounded-full transition-colors text-zinc-500 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
