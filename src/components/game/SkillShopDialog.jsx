
import React from 'react';
import { useGame } from '@/context/GameContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Eye, HeartStraight as Heart, Ghost, Sword, Shield } from '@phosphor-icons/react';
import { UPGRADE_COSTS } from '@/lib/game/constants';

export function SkillShopDialog({ open, onOpenChange }) {
  const { state, dispatch } = useGame();
  const { player } = state;
  const { xp } = player;

  const onPurchase = (stat, cost) => {
    if (player.xp >= cost) {
      dispatch({ type: 'UPGRADE_STAT', payload: { stat, cost } });
    }
  };

  const UPGRADES = [
    {
      id: 'VISION',
      name: 'Eagle Eye',
      desc: 'Increase vision radius to see further.',
      level: `Lvl ${player.stats.visionRadius}`,
      icon: Eye,
      color: "text-amber-400",
      cost: UPGRADE_COSTS.VISION.base + ((player.stats.visionRadius - 1) * UPGRADE_COSTS.VISION.inc)
    },
    {
      id: 'ATTACK',
      name: 'Strength',
      desc: 'Increase combat roll bonus.',
      level: `Lvl ${player.stats.attackBonus || 0}`,
      icon: Sword,
      color: "text-orange-500",
      cost: UPGRADE_COSTS.ATTACK.base + ((player.stats.attackBonus || 0) * UPGRADE_COSTS.ATTACK.inc)
    },
    {
      id: 'SHIELD',
      name: 'Iron Will',
      desc: 'Passive block chance (10% per level).',
      level: `Lvl ${player.stats.shieldLevel || 0}`,
      icon: Shield,
      color: "text-blue-500",
      cost: UPGRADE_COSTS.SHIELD.base + ((player.stats.shieldLevel || 0) * UPGRADE_COSTS.SHIELD.inc)
    },
    {
      id: 'HP',
      name: 'Vitality',
      desc: 'Increase Max HP by 1.',
      level: `${player.maxHp} HP`,
      icon: Heart,
      color: "text-red-500",
      cost: UPGRADE_COSTS.HP.base + ((player.maxHp - 3) * UPGRADE_COSTS.HP.inc)
    },
    {
      id: 'STEALTH',
      name: 'Stealth',
      desc: 'Reduce alert generation from actions.',
      level: `Lvl ${player.stats.stealth || 0}`,
      icon: Ghost,
      color: "text-slate-400",
      cost: UPGRADE_COSTS.STEALTH.base + ((player.stats.stealth || 0) * UPGRADE_COSTS.STEALTH.inc)
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-zinc-950 border-zinc-800 text-zinc-50">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <span className="text-amber-500">Skill Shop</span>
            <Badge variant="outline" className="ml-auto border-amber-500/20 text-amber-500 bg-amber-500/10">
              {xp} XP Available
            </Badge>
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Invest your experience to survive the deeper floors.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-4 py-4">
            {UPGRADES.map((u) => {
              const DeviceIcon = u.icon;
              const canAfford = xp >= u.cost;

              return (
                <div key={u.id} className="group flex items-center justify-between p-4 rounded-lg bg-zinc-900/50 border border-zinc-900 hover:border-zinc-700 hover:bg-zinc-900 transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-md bg-zinc-950 border border-zinc-800 group-hover:border-zinc-700 transition-colors ${u.color}`}>
                      <DeviceIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-zinc-100">{u.name}</h4>
                        <span className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">{u.level}</span>
                      </div>
                      <p className="text-xs text-zinc-500">{u.desc}</p>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant={canAfford ? "default" : "outline"}
                    className={canAfford
                      ? "bg-amber-600 hover:bg-amber-500 text-white border-none"
                      : "text-zinc-500 border-zinc-800 hover:bg-zinc-900 cursor-not-allowed opacity-50"}
                    disabled={!canAfford}
                    onClick={() => onPurchase(u.id, u.cost)}
                    aria-label={`Purchase ${u.name} for ${u.cost} XP`}
                  >
                    {u.cost} XP
                  </Button>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
