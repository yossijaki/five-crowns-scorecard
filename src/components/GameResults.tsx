import { useState } from 'react';
import type { Player } from '../types';
import { calculateTotal, formatDate } from '../utils';

interface GameResultsProps {
  players: Player[];
  gameDate: string;
  gameId: string;
  initialNote: string;
  onSaveNote: (gameId: string, note: string) => void;
  onGoHome: () => void;
  onNewGame: () => void;
}

export function GameResults({
  players,
  gameDate,
  gameId,
  initialNote,
  onSaveNote,
  onGoHome,
  onNewGame,
}: GameResultsProps) {
  const [note, setNote] = useState(initialNote);
  const [isEditingNote, setIsEditingNote] = useState(false);

  const handleSaveNote = () => {
    onSaveNote(gameId, note);
    setIsEditingNote(false);
  };

  // Sort players by score (lowest first)
  const sortedPlayers = [...players].sort(
    (a, b) => calculateTotal(a.scores) - calculateTotal(b.scores)
  );

  return (
    <div className="min-h-screen bg-dark-200 p-4">
      <div className="max-w-md mx-auto">
        <div className="fixed top-0 left-0 right-0 bg-dark-200 border-b border-dark-300 p-4 z-10">
          <div className="max-w-md mx-auto flex justify-between items-center">
            <button
              onClick={onGoHome}
              className="px-4 py-2 bg-dark-100 text-white rounded-lg 
                        hover:bg-dark-200 transition-colors flex items-center"
              aria-label="Volver al inicio"
            >
              <span className="mr-1">🏠</span> Inicio
            </button>
            <h1 className="text-lg font-semibold text-white flex items-center">
              <span className="mr-2">🏆</span>Resultados
            </h1>
            <button
              onClick={onNewGame}
              className="px-4 py-2 bg-dark-100 text-white rounded-lg 
                        hover:bg-dark-200 transition-colors flex items-center"
              aria-label="Iniciar nuevo juego"
            >
              <span className="mr-1">🔄</span> Nuevo
            </button>
          </div>
        </div>

        <div className="pt-16">
          <div className="bg-dark-100 rounded-xl shadow-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-bold text-white">Partida finalizada</h2>
                <p className="text-sm text-gray-400">{formatDate(gameDate)}</p>
              </div>
              <div className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm">
                Completada
              </div>
            </div>

            {isEditingNote ? (
              <div className="mb-4">
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full p-3 bg-dark-300 text-white border border-dark-100 rounded-lg 
                           focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Añade una nota a esta partida..."
                  rows={3}
                  autoFocus
                />
                <div className="flex justify-end space-x-2 mt-2">
                  <button
                    onClick={() => setIsEditingNote(false)}
                    className="px-3 py-1 bg-dark-300 text-white rounded-lg hover:bg-dark-200 text-sm"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveNote}
                    className="px-3 py-1 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm"
                  >
                    Guardar
                  </button>
                </div>
              </div>
            ) : (
              <div 
                className="mb-4 p-3 bg-dark-300 rounded-lg cursor-pointer hover:bg-dark-200 transition-colors"
                onClick={() => setIsEditingNote(true)}
              >
                {note ? (
                  <p className="text-gray-300 text-sm italic">"{note}"</p>
                ) : (
                  <p className="text-gray-500 text-sm italic flex items-center">
                    <span className="mr-2">✏️</span> Añadir nota a esta partida...
                  </p>
                )}
              </div>
            )}

            <h3 className="text-lg font-semibold mb-3 text-white flex items-center">
              <span className="mr-2">🏆</span> Clasificación
            </h3>
            
            {sortedPlayers.map((player, index) => (
              <div
                key={player.id}
                className={`p-3 rounded-lg ${
                  index === 0
                    ? 'bg-primary/20 border border-primary'
                    : 'bg-dark-300'
                } mb-2 transition-all hover:transform hover:scale-[1.01]`}
                style={{
                  borderLeftColor: player.color,
                  borderLeftWidth: '4px',
                  backgroundColor:
                    index === 0 ? `${player.color}20` : undefined,
                }}
              >
                <span className="font-semibold text-white">
                  {index === 0 && <span className="mr-1">👑</span>}
                  {index + 1}. {player.name}
                </span>
                <span className="float-right text-gray-300">
                  {calculateTotal(player.scores)} puntos
                </span>
              </div>
            ))}
          </div>

          <div className="bg-dark-100 rounded-xl shadow-lg p-4">
            <h3 className="text-lg font-semibold mb-3 text-white flex items-center">
              <span className="mr-2">📊</span> Detalles de puntuación
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400">
                    <th className="text-left p-2 sticky left-0 bg-dark-100 z-10">Jugador</th>
                    {Array.from({ length: Math.max(...players.map(p => p.scores.length)) }, (_, i) => i + 1).map(round => (
                      <th key={round} className="p-2 text-center">
                        <div className="flex flex-col items-center">
                          <div>R{round}</div>
                        </div>
                      </th>
                    ))}
                    <th className="p-2 text-center bg-dark-300 sticky right-0 z-10">Total</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  {sortedPlayers.map(player => (
                    <tr key={player.id} className="hover:bg-dark-300/50">
                      <td className="p-2 sticky left-0 bg-dark-100 flex items-center z-10">
                        <div 
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: player.color }}
                        ></div>
                        {player.name}
                      </td>
                      {player.scores.map((score, i) => (
                        <td key={i} className="p-2 text-center">
                          {score}
                        </td>
                      ))}
                      <td className="p-2 text-center font-bold text-white sticky right-0 bg-dark-300 z-10">
                        {calculateTotal(player.scores)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
