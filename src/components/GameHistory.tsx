import { useState } from 'react';
import type { GameHistory } from '../types';
import { formatDate } from '../utils';

interface GameHistoryProps {
  history: GameHistory[];
  onLoadGame: (gameId: string) => void;
  onDeleteGame: (gameId: string) => void;
  onUpdateGameNote: (gameId: string, note: string) => void;
}

export function GameHistoryList({
  history,
  onLoadGame,
  onDeleteGame,
  onUpdateGameNote,
}: GameHistoryProps) {
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');

  const handleEditNote = (game: GameHistory) => {
    setEditingNoteId(game.id);
    setNoteText(game.note || '');
  };

  const handleSaveNote = (gameId: string) => {
    onUpdateGameNote(gameId, noteText);
    setEditingNoteId(null);
  };

  const handleCancelEdit = () => {
    setEditingNoteId(null);
  };

  const handleDeleteGame = (gameId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta partida?')) {
      onDeleteGame(gameId);
    }
  };

  if (history.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p>No hay partidas guardadas</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {history.map((game) => (
        <div
          key={game.id}
          className="bg-dark-100 rounded-xl shadow-lg p-4 transition-all hover:bg-dark-300/80"
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-semibold text-white text-lg flex items-center">
                {game.title || formatDate(game.date, true)}
                {game.isComplete && <span className="ml-2 text-green-500 text-sm">✓</span>}
              </h3>
              <p className="text-xs text-gray-400">{formatDate(game.date)}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEditNote(game)}
                className="p-2 text-gray-400 hover:text-white rounded-full"
                title="Editar nota"
              >
                ✏️
              </button>
              <button
                onClick={() => onLoadGame(game.id)}
                className="p-2 text-blue-400 hover:text-blue-300 rounded-full"
                title="Cargar partida"
              >
                🔄
              </button>
              <button
                onClick={() => handleDeleteGame(game.id)}
                className="p-2 text-red-400 hover:text-red-300 rounded-full"
                title="Eliminar partida"
              >
                🗑️
              </button>
            </div>
          </div>

          {editingNoteId === game.id ? (
            <div className="mt-2">
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className="w-full p-2 bg-dark-300 text-white border border-dark-100 rounded-lg 
                         focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Añade una nota a esta partida..."
                rows={2}
                autoFocus
              />
              <div className="flex justify-end space-x-2 mt-2">
                <button
                  onClick={handleCancelEdit}
                  className="px-3 py-1 bg-dark-300 text-white rounded-lg hover:bg-dark-200 text-sm"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleSaveNote(game.id)}
                  className="px-3 py-1 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm"
                >
                  Guardar
                </button>
              </div>
            </div>
          ) : (
            <>
              {game.note ? (
                <p className="text-gray-300 mt-2 text-sm italic">"{game.note}"</p>
              ) : (
                <p className="text-gray-500 mt-2 text-sm italic">Sin nota</p>
              )}
            </>
          )}

          <div className="mt-3 flex flex-wrap gap-2">
            {game.players.map((player) => (
              <div
                key={player.id}
                className="flex items-center bg-dark-300 px-2 py-1 rounded-lg"
              >
                <div
                  className="w-2 h-2 rounded-full mr-1"
                  style={{ backgroundColor: player.color }}
                ></div>
                <span className="text-xs text-gray-300">{player.name}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
