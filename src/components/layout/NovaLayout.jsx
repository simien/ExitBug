import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import GameStatus from "@/components/game/GameStatus";

export const NovaLayout = ({ children, sidebar, header }) => {
  return (
    <div className="flex h-screen w-full flex-col bg-background text-foreground overflow-hidden">
      {/* Top Navigation */}
      <header className="z-10 w-full h-16 shrink-0">
        {header}
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Game Area Wrapper (Main + Overlay) */}
        <div className="flex-1 flex flex-col relative min-w-0 overflow-hidden">
          {/* Background Gradients - Moved here to prevent scroll overflow */}
          <div className="absolute top-[-20%] left-[-20%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] pointer-events-none z-0" />
          <div className="absolute bottom-[-20%] right-[-20%] w-[50%] h-[50%] bg-accent/10 rounded-full blur-[120px] pointer-events-none z-0" />
          {/* Fixed Game Status Overlay */}
          <div className="absolute top-4 left-0 w-full z-30 flex justify-center pointer-events-none">
            <GameStatus />
          </div>

          {/* Main Game Area */}
          <main className="flex-1 relative overflow-auto overscroll-x-none bg-dot-pattern flex">
            {/*
              Using flex + m-auto is a reliable way to center content when it fits,
              but allow scrolling when it overflows, while preserving padding.
            */}
            <div className="m-auto p-8 min-w-fit min-h-fit flex flex-col items-center justify-center relative z-10">

              <div className="relative z-10 flex items-center justify-center">
                {children}
              </div>
            </div>
          </main>
        </div>

        {/* Inventory / Sidebar */}
        <aside className="w-80 border-l bg-card/50 backdrop-blur p-4 hidden md:flex flex-col">
          <ScrollArea className="h-full">
            {sidebar}
          </ScrollArea>
        </aside>
      </div>
    </div>
  );
};
