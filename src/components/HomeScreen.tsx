import { useState, useEffect, useRef } from 'react';
import type { GameHistory } from '../types';
import { GameHistoryList } from './GameHistory';

interface HomeScreenProps {
  gameHistory: GameHistory[];
  onStartNewGame: () => void;
  onLoadGame: (gameId: string) => void;
  onDeleteGame: (gameId: string) => void;
  onUpdateGameNote: (gameId: string, note: string) => void;
}

export function HomeScreen({
  gameHistory,
  onStartNewGame,
  onLoadGame,
  onDeleteGame,
  onUpdateGameNote,
}: HomeScreenProps) {
  const [activeTab, setActiveTab] = useState<'recent' | 'all'>('recent');
  const [isHeaderCompact, setIsHeaderCompact] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  // Get recent games (last 5)
  const recentGames = [...gameHistory]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Get all games sorted by date
  const allGames = [...gameHistory].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Handle scroll to make header compact
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsHeaderCompact(true);
      } else {
        setIsHeaderCompact(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-dark-200">
      <div className="fixed top-0 left-0 right-0 z-20 bg-dark-200 flex flex-col">
        {/* Main header with app title and new game button */}
        <div 
          ref={headerRef}
          className={`w-full transition-all duration-300 ease-in-out
                    ${isHeaderCompact ? 'py-2' : 'py-4'}`}
        >
          <div className="max-w-md mx-auto px-4">
            <div className={`bg-dark-100 rounded-xl shadow-lg transition-all duration-300 ease-in-out
                           ${isHeaderCompact ? 'p-3 flex items-center justify-between' : 'p-6'}`}>
              <h1 
                className={`font-bold text-white transition-all duration-300 ease-in-out
                          ${isHeaderCompact ? 'text-lg mb-0' : 'text-2xl text-center mb-6'}`}
              >
                Cinco Coronas
              </h1>
              
              <button
                onClick={onStartNewGame}
                className={`py-2 px-4 bg-primary text-white rounded-lg 
                         hover:bg-primary/90 transition-all duration-300 ease-in-out flex items-center justify-center
                         ${isHeaderCompact ? 'text-sm ml-2 shrink-0' : 'w-full py-3 text-lg font-semibold'}`}
              >
                <span className="mr-2">🃏</span> 
                {isHeaderCompact ? 'Nueva' : 'Nueva Partida'}
              </button>
            </div>
          </div>
        </div>
        
        {/* History header with tabs */}
        <div className="w-full bg-dark-200 pb-2">
          <div className="max-w-md mx-auto px-4">
            <div className="bg-dark-100 rounded-xl shadow-lg p-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <span className="mr-2">📜</span> Historial
                </h2>
                
                <div className="flex bg-dark-300 rounded-lg p-1">
                  <button
                    onClick={() => setActiveTab('recent')}
                    className={`px-3 py-1 rounded-lg text-sm ${
                      activeTab === 'recent'
                        ? 'bg-primary text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Recientes
                  </button>
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`px-3 py-1 rounded-lg text-sm ${
                      activeTab === 'all'
                        ? 'bg-primary text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Todas
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable content area */}
      <div className="pt-72 pb-4">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-dark-100 rounded-xl shadow-lg p-4">
            <GameHistoryList
              history={activeTab === 'recent' ? recentGames : allGames}
              onLoadGame={onLoadGame}
              onDeleteGame={onDeleteGame}
              onUpdateGameNote={onUpdateGameNote}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
