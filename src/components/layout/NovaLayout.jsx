import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import GameStatus from "@/components/game/GameStatus";

export const NovaLayout = ({ children, sidebar, header }) => {
  return (
    <div className="flex h-screen w-full flex-col bg-background text-foreground overflow-hidden">
      {/* Top Navigation */}
      {/* Top Navigation */}
      <header className="z-10 w-full h-16 shrink-0">
        {header}
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Main Game Area */}
        <main className="flex-1 flex items-center justify-center p-4 relative overflow-hidden bg-dot-pattern">
          {/* Background Gradients */}
          <div className="absolute top-[-20%] left-[-20%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[-20%] right-[-20%] w-[50%] h-[50%] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

          <GameStatus />

          <div className="relative z-10 w-full max-w-4xl aspect-square flex items-center justify-center">
            {children}
          </div>
        </main>

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
