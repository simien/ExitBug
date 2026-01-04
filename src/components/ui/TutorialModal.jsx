import React from 'react';
import { X, Compass, Skull, DoorOpen, TrendUp, Bug } from '@phosphor-icons/react';

const TutorialModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-gray-900 border border-purple-500/30 rounded-2xl shadow-[0_0_50px_rgba(168,85,247,0.15)] overflow-y-auto">

        {/* Header Background Effect */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-purple-900/20 to-transparent pointer-events-none" />

        {/* Content Container */}
        <div className="relative p-8 flex flex-col items-center text-center">

          {/* Icon / Graphic Placeholder */}
          <div className="mb-6 p-4 rounded-full bg-purple-500/10 border border-purple-500/20 shadow-inner">
            <div className="w-12 h-12 flex items-center justify-center text-3xl">
              <Bug size={48} weight="fill" className="text-purple-400" />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-white mb-2 tracking-wide drop-shadow-md">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">ExitBug</span>
          </h2>

          <p className="text-gray-400 mb-8 max-w-lg leading-relaxed">
            Your mission is waiting. Explore the grid, uncover hidden treasures, and climb the leaderboard. But watch your step—danger lurks in the shadows.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-8">
            <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50 hover:border-purple-500/30 transition-colors flex items-start text-left gap-3">
              <Compass size={32} className="text-purple-400 shrink-0" />
              <div>
                <div className="text-purple-400 mb-1 font-semibold">Explore</div>
                <p className="text-xs text-gray-400">Reveal tiles to gain XP, collect loot, and uncover the path forward.</p>
              </div>
            </div>

            <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50 hover:border-red-500/30 transition-colors flex items-start text-left gap-3">
              <Skull size={32} className="text-red-400 shrink-0" />
              <div>
                <div className="text-red-400 mb-1 font-semibold">Survive</div>
                <p className="text-xs text-gray-400">Avoid hidden traps and enemies. One wrong step could be fatal.</p>
              </div>
            </div>

            <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50 hover:border-blue-500/30 transition-colors flex items-start text-left gap-3">
              <DoorOpen size={32} className="text-blue-400 shrink-0" />
              <div>
                <div className="text-blue-400 mb-1 font-semibold">Escape</div>
                <p className="text-xs text-gray-400">Find the Exit Portal to secure your loot and advance to the next level.</p>
              </div>
            </div>

            <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50 hover:border-green-500/30 transition-colors flex items-start text-left gap-3">
              <TrendUp size={32} className="text-green-400 shrink-0" />
              <div>
                <div className="text-green-400 mb-1 font-semibold">Upgrade</div>
                <p className="text-xs text-gray-400">Visit the Skill Shop to spend XP and unlock powerful abilities.</p>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="group relative px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg transition-all transform hover:scale-105 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] active:scale-95"
          >
            Start Playing
          </button>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white transition-colors rounded-full hover:bg-white/10"
          >
            <X size={20} />
          </button>

        </div>
      </div>
    </div>
  );
};

export default TutorialModal;
