import { useEffect, useState } from 'react';
import type { Player } from '../types';
import { calculateTotal } from '../utils';

const PLAYER_COLORS = [
  'border-blue-500 bg-blue-500/10',
  'border-red-500 bg-red-500/10',
  'border-green-500 bg-green-500/10',
  'border-yellow-500 bg-yellow-500/10',
  'border-purple-500 bg-purple-500/10',
  'border-pink-500 bg-pink-500/10',
  'border-indigo-500 bg-indigo-500/10',
];

interface LeaderIndicatorProps {
  players: Player[];
}

export function LeaderIndicator({ players }: LeaderIndicatorProps) {
  const [prevLeader, setPrevLeader] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const getLeaders = () => {
    if (players.length === 0) return [];

    const scores = players.map((p) => ({
      ...p,
      total: calculateTotal(p.scores),
    }));

    const minScore = Math.min(...scores.map((p) => p.total));
    return scores.filter((p) => p.total === minScore);
  };

  const leaders = getLeaders();
  const isTie = leaders.length > 1;

  useEffect(() => {
    const currentLeaderId = leaders[0]?.id;
    if (prevLeader !== null && currentLeaderId !== prevLeader) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 1000);
      return () => clearTimeout(timer);
    }
    setPrevLeader(currentLeaderId);
  }, [leaders, prevLeader]);

  if (players.length === 0 || leaders.length === 0) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 z-20 transition-transform duration-300 
                    ${isAnimating ? 'animate-bounce' : ''}`}
    >
      <div className="bg-dark-100 rounded-xl shadow-lg p-4 max-w-xs">
        <h3 className="text-sm text-gray-400 mb-2">
          {isTie ? '🏆 Líderes actuales' : '🏆 Líder actual'}
        </h3>
        <div className="space-y-2">
          {leaders.map((leader, index) => (
            <div
              key={leader.id}
              className={`border-l-4 rounded p-2 ${
                PLAYER_COLORS[index % PLAYER_COLORS.length]
              }`}
            >
              <div className="font-semibold">{leader.name}</div>
              <div className="text-sm text-gray-400">{leader.total} puntos</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
