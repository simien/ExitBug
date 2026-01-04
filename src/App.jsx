import React, { useState, useEffect } from 'react';
import { GameProvider } from '@/context/GameContext';
import Board from '@/components/game/Board';
import GameHeader from '@/components/game/GameHeader';
import GameSidebar from '@/components/game/GameSidebar';
import { NovaLayout } from '@/components/layout/NovaLayout';
import ErrorBoundary from '@/components/ErrorBoundary';

// Migrated Auth Components
import Login from '@/components/auth/Login';
import Register from '@/components/auth/Register';
import { EnemyIcon } from '@/components/ui/Icons';

import TutorialModal from '@/components/ui/TutorialModal';
import DevTools from '@/components/dev/DevTools';

function App() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('hiddenGame_user');
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (e) {
        console.error("Failed to parse user session", e);
      }
    }
    return null;
  });
  const [isLogin, setIsLogin] = useState(true);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  const handleLogin = (userData) => {
    const sessionUser = userData || { email: 'guest@explorer.com', uid: 'guest-' + Date.now(), isGuest: true };
    setUser(sessionUser);
    localStorage.setItem('hiddenGame_user', JSON.stringify(sessionUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('hiddenGame_user');
  };

  useEffect(() => {
    if (user) {
      const seen = localStorage.getItem('hiddenGame_tutorial_seen');
      const alwaysShow = localStorage.getItem('hiddenGame_dev_alwaysShowTutorial') === 'true';
      const urlParams = new URLSearchParams(window.location.search);
      const forceTutorial = urlParams.get('tutorial') === 'true';

      if (!seen || forceTutorial || alwaysShow) {
        // Use timeout to push to next tick, avoiding sync state update warning
        setTimeout(() => setShowTutorial(true), 0);
      }
    }
  }, [user]);



  return (
    <>
      {!user ? (
        <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
          {/* Background blobs */}
          <div className="absolute top-[-20%] left-[-20%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[-20%] right-[-20%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />

          <div className="z-10 flex flex-col items-center gap-8 w-full max-w-md">
            <div className="p-4 bg-white/5 rounded-full border border-white/10 shadow-2xl">
              <EnemyIcon className="w-12 h-12 text-white" weight="fill" />
            </div>

            {isLogin ? (
              <Login
                onSwitch={() => setIsLogin(false)}
                onGuestLogin={() => handleLogin()}
              />
            ) : (
              <Register
                onSwitch={() => setIsLogin(true)}
                onGuestLogin={() => handleLogin()}
              />
            )}
          </div>
        </div>
      ) : (
        <ErrorBoundary>
          <GameProvider user={user}>
            <NovaLayout
              header={
                <GameHeader
                  user={user}
                  onLogout={handleLogout}
                  onShowLeaderboard={() => setShowLeaderboard(true)}
                />
              }
              sidebar={<GameSidebar />}
            >
              <Board />
            </NovaLayout>

            {/* Leaderboard Modal logic would go here, maybe refactor to Dialog */}
            {showLeaderboard && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => setShowLeaderboard(false)}>
                <div className="bg-card p-4 rounded-xl border max-w-md w-full" onClick={e => e.stopPropagation()}>
                  <h2 className="text-xl font-bold mb-4">Leaderboard</h2>
                  <p className="text-muted-foreground">Coming soon...</p>
                  <button className="mt-4 text-primary" onClick={() => setShowLeaderboard(false)}>Close</button>
                </div>
              </div>
            )}

            {/* Tutorial Modal */}
            {showTutorial && (
              <TutorialModal
                onClose={() => {
                  setShowTutorial(false);
                  localStorage.setItem('hiddenGame_tutorial_seen', 'true');
                }}
              />
            )}
          </GameProvider>
        </ErrorBoundary>
      )}
      {/* Dev Tools (Only visible in development) */}
      {import.meta.env.DEV && <DevTools />}
    </>
  );
}

export default App;
