
import React from 'react';
import { useGame } from '@/context/GameContext';
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  HeartStraight as Heart,
  Trophy,
  SignOut as LogOut,
  User,
  Lightning as Zap,
  Tote as ShoppingBag
} from '@phosphor-icons/react';
import { SkillShopDialog } from '@/components/game/SkillShopDialog';

export default function GameHeader({ user, onLogout, onShowLeaderboard }) {
  const { state } = useGame();
  const { alertness, floor, player } = state;
  const [isShopOpen, setShopOpen] = React.useState(false);

  return (
    // Header Grid: [Game Area Header (Flexible)] [Sidebar Header Padded Area (Fixed 20rem)]
    <div className="grid h-full w-full grid-cols-[1fr_auto] md:grid-cols-[1fr_20rem] bg-muted/40 backdrop-blur border-b">

      {/* Col 1: Game Area Controls (Centered relative to tiling area) */}
      <div className="relative flex items-center justify-center px-4 min-w-0">

        {/* ABSOLUTE LEFT: Floor Indicator (Kept independent) */}
        <div className="absolute left-4 flex items-center gap-4">
          <Badge variant="outline" className="text-xs font-bold tracking-widest py-1 px-3 border-primary/20 bg-black/40 backdrop-blur-md">
            FLOOR <span className="text-primary ml-1 text-sm">{floor}</span>
          </Badge>
        </div>

        {/* CENTER GROUP: [HP] [METER] [XP] */}
        <div className="relative flex items-center justify-center w-full max-w-[800px] gap-2 md:gap-4">

          {/* 1. HP */}
          <div className="flex items-center justify-end gap-2 text-white bg-red-500/10 px-2 md:px-3 py-1 rounded-full border border-red-500/20 whitespace-nowrap shrink-0">
            <span className="font-mono font-bold text-sm hidden md:inline">{player.hp}/{player.maxHp}</span>
            <Heart size={16} className="text-red-500 fill-current" />
          </div>

          {/* 2. ALERT METER */}
          <div className="w-full max-w-[200px] md:max-w-[412px] flex-shrink flex flex-col gap-1 mx-0 md:mx-2 transition-all">
            <div className="flex justify-between text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
              <span>Alertness</span>
              <span className={alertness > 80 ? "text-red-500" : "text-primary"}>{alertness}%</span>
            </div>
            <Progress value={alertness} className="h-2 bg-secondary" indicatorClassName={alertness > 80 ? "bg-red-500 shadow-[0_0_10px_red]" : "bg-primary shadow-[0_0_10px_currentColor]"} />
          </div>

          {/* 3. XP */}
          <button
            onClick={() => setShopOpen(true)}
            className="hidden md:flex items-center gap-2 text-amber-200 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 whitespace-nowrap hover:bg-amber-500/20 hover:scale-105 transition-all cursor-pointer pointer-events-auto shrink-0"
            title="Open Skill Shop"
          >
            <Zap size={16} className="text-amber-400 fill-current" />
            <span className="font-mono font-bold text-sm">{player.xp} XP</span>
          </button>

        </div>

        {/* Mobile Actions (Visible only on small screens) */}
        <div className="absolute right-4 md:hidden flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setShopOpen(true)}>
            <Zap size={18} className="text-amber-400" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onShowLeaderboard}>
            <Trophy size={18} />
          </Button>
        </div>
      </div>

      {/* Col 2: Sidebar Header Area (Desktop Only) */}
      <div className="hidden md:flex items-center justify-end px-4 border-l border-white/5 bg-black/20">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onShowLeaderboard} className="hover:bg-amber-500/10 hover:text-amber-500">
            <Trophy size={18} />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full ring-2 ring-primary/20 hover:ring-primary/50 transition-all">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">{user?.email?.[0]?.toUpperCase() || 'G'}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-black/90 border-white/10 backdrop-blur-xl" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none text-white">{user?.email?.split('@')[0] || 'Guest'}</p>
                  <p className="text-xs leading-none text-gray-400">{user?.email || 'Guest Account'}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem onClick={onLogout} className="text-red-400 focus:text-red-400 focus:bg-red-500/10 cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <SkillShopDialog open={isShopOpen} onOpenChange={setShopOpen} />
    </div>
  );
}

