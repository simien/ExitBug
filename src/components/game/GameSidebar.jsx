
import React from 'react';
import { useGame } from '@/context/GameContext';
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Eye,
  Sword,
  Shield,
  Lightning as Zap,
  Flask as FlaskConical,
  Scroll,
  Bomb,
  ArrowsClockwise as RefreshCw,
  Star,
  Fire,
  Skull
} from '@phosphor-icons/react';
import { GAME_STATE } from '@/lib/game/constants'; // Adjusted import path

const StatItem = ({ icon, value, label, colorClass, tooltip }) => {
  const Icon = icon;
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`flex flex-col items-center justify-center p-2 rounded-md border bg-card hover:bg-accent hover:text-accent-foreground transition-colors cursor-help ${colorClass}`}>
            <Icon className="w-5 h-5 mb-1" />
            <span className="text-xs font-bold">{value}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>{tooltip || label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default function GameSidebar() {
  const { state, dispatch } = useGame();
  const { player, gameState } = state;

  // Group inventory items
  const groupedInventory = player.inventory.reduce((acc, item) => {
    if (!item) return acc;
    if (acc[item.id]) {
      acc[item.id].count += 1;
    } else {
      acc[item.id] = { ...item, count: 1 };
    }
    return acc;
  }, {});

  const uniqueItems = Object.values(groupedInventory);



  return (
    <div className="flex flex-col gap-4 py-4 h-full">

      {/* Floor Indicator */}
      <div className="flex items-center justify-center pt-2">
        <Badge variant="outline" className="text-xs font-bold tracking-widest py-1 px-4 border-primary/20 bg-background/50 backdrop-blur-md whitespace-nowrap shadow-sm">
          FLOOR <span className="text-primary ml-1 text-sm">{state.floor}</span>
        </Badge>
      </div>

      <Separator className="bg-border/40 my-2" />

      {/* Passives Section */}
      <div className="space-y-3">
        <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center">Stats & Passives</h3>
        <div className="grid grid-cols-3 gap-2">
          <StatItem
            icon={Eye}
            value={player.stats.visionRadius}
            colorClass="text-amber-500 border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10"
            tooltip={`Eagle Eye Level ${player.stats.visionRadius}`}
          />
          <StatItem
            icon={Sword}
            value={`+${player.stats.attackBonus}`}
            colorClass="text-red-500 border-red-500/20 bg-red-500/5 hover:bg-red-500/10"
            tooltip="Attack Bonus"
          />
          <StatItem
            icon={Shield}
            value={`Lvl ${player.stats.shieldLevel || 0}`}
            colorClass={player.stats.shieldLevel > 0 ? "text-blue-500 border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10" : "text-muted-foreground border-border bg-muted/20 hover:bg-muted/30"}
            tooltip={`Iron Will (${(player.stats.shieldLevel || 0) * 10}% Block Chance)`}
          />
        </div>
      </div>

      <Separator className="bg-border/40 my-2" />

      {/* Inventory Section */}
      <div className="space-y-3 flex-1">
        <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center">Inventory</h3>

        {uniqueItems.length === 0 && (
          <div className="text-center py-8 text-xs text-muted-foreground border border-dashed border-border/60 rounded-md bg-muted/10">Empty</div>
        )}

        <div className="grid grid-cols-4 gap-2">
          {uniqueItems.map((item) => {
            let Icon = Star;
            let color = "text-yellow-500";
            if (item.id === 'potion') { Icon = FlaskConical; color = "text-pink-500"; }
            else if (item.id === 'vision_scroll') { Icon = Scroll; color = "text-cyan-500"; }
            else if (item.id === 'shield') { Icon = Shield; color = "text-blue-500"; }
            else if (item.id === 'smoke_bomb') { Icon = Bomb; color = "text-gray-500"; }
            else if (item.id === 'flint') { Icon = Fire; color = "text-orange-600"; }
            else if (item.id === 'cursed_blade') { Icon = Skull; color = "text-purple-600"; }

            return (
              <TooltipProvider key={item.id} delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className="relative aspect-square flex items-center justify-center rounded-md border bg-card hover:bg-accent transition-all cursor-pointer group shadow-sm hover:shadow-md hover:border-primary/20"
                      onClick={() => dispatch({ type: 'USE_ITEM', payload: { itemId: item.id } })}
                    >
                      <Icon className={`w-5 h-5 ${color} group-hover:scale-110 transition-transform`} />
                      <Badge variant="secondary" className="absolute -top-1.5 -right-1.5 h-4 w-4 p-0 flex items-center justify-center text-[9px] border-background shadow-none">{item.count}</Badge>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p>{item.name} (Click to Use)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )
          })}
        </div>
      </div>

      {gameState !== GAME_STATE.PLAYING && (
        <Button
          className={`w-full font-bold animate-pulse ${gameState === GAME_STATE.WON ? 'bg-green-600 hover:bg-green-700' : 'bg-destructive hover:bg-destructive/90'}`}
          onClick={() => dispatch({ type: 'START_GAME' })}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          {gameState === GAME_STATE.WON ? "Play Again" : "Try Again"}
        </Button>
      )}

      <div className="mt-auto pt-2 text-center">
        <p className="text-[10px] text-muted-foreground/40 font-medium tracking-wider">Antigravity ExitBug</p>
      </div>

    </div>
  );
}
