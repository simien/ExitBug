import React, { useState, useEffect } from 'react';
import { Wrench, Trash, ArrowCounterClockwise, CheckSquare, Square } from '@phosphor-icons/react';

const DevTools = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [alwaysShowTutorial, setAlwaysShowTutorial] = useState(() => {
    return localStorage.getItem('hiddenGame_dev_alwaysShowTutorial') === 'true';
  });

  // Only render in development check moved to parent

  useEffect(() => {
    localStorage.setItem('hiddenGame_dev_alwaysShowTutorial', alwaysShowTutorial);
  }, [alwaysShowTutorial]);

  const resetTutorial = () => {
    localStorage.removeItem('hiddenGame_tutorial_seen');
    window.location.reload();
  };

  const clearAllData = () => {
    if (confirm('Clear ALL local storage? This will log you out and reset everything.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-[100] font-mono text-xs">
      <div className={`transition-all duration-300 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none absolute bottom-full right-0 mb-4'}`}>
        <div className="bg-black/90 border border-purple-500/50 rounded-lg shadow-xl p-4 w-64 backdrop-blur-md">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
            <h3 className="text-purple-400 font-bold flex items-center gap-2">
              <Wrench size={14} /> DevTools
            </h3>
            <span className="text-[10px] text-gray-500">Local Only</span>
          </div>

          <div className="flex flex-col gap-3">
            {/* Tutorial Toggle */}
            <div
              className="flex items-center justify-between cursor-pointer hover:bg-white/5 p-1 rounded transition-colors"
              onClick={() => setAlwaysShowTutorial(!alwaysShowTutorial)}
            >
              <span className="text-gray-300">Always Show Tutorial</span>
              {alwaysShowTutorial ? (
                <CheckSquare size={16} className="text-green-400" />
              ) : (
                <Square size={16} className="text-gray-600" />
              )}
            </div>

            {/* Reset Tutorial */}
            <button
              onClick={resetTutorial}
              className="flex items-center gap-2 text-gray-400 hover:text-white p-1 rounded hover:bg-white/5 text-left transition-colors"
            >
              <ArrowCounterClockwise size={14} />
              Reset Tutorial Status
            </button>

            {/* Clear Data */}
            <button
              onClick={clearAllData}
              className="flex items-center gap-2 text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-900/20 text-left transition-colors mt-2 border-t border-white/10 pt-2"
            >
              <Trash size={14} />
              Clear Local Storage
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-3 rounded-full shadow-lg transition-all duration-300 ${isOpen
          ? 'bg-purple-600 text-white rotate-90'
          : 'bg-gray-800 text-gray-400 hover:text-white border border-gray-700 hover:border-purple-500/50'
          }`}
      >
        <Wrench size={20} weight={isOpen ? "fill" : "regular"} />
      </button>
    </div>
  );
};

export default DevTools;
