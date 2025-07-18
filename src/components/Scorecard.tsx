import { useState } from "react";
import type { Player } from "../types";
import { calculateTotal, getColorClasses } from "../utils";
import { ScoreboardModal } from "./ScoreboardModal";
import { EditScoreModal } from "./EditScoreModal";
import {
  TableEdit24Filled,
  Flag24Filled,
  Trophy16Filled,
  Delete20Filled,
} from "@fluentui/react-icons";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

interface ScorecardProps {
  players: Player[];
  currentRound: number;
  onSaveRound: (scores: number[]) => void;
  isGameComplete: boolean;
  onUpdatePlayerScores: (players: Player[]) => void;
  onFinishGame: () => void;
  onDeletePlayer: (playerId: string) => void;
  getCardsForRound: (round: number) => number;
}

export function Scorecard({
  players,
  currentRound,
  onSaveRound,
  isGameComplete,
  onUpdatePlayerScores,
  onFinishGame,
  onDeletePlayer,
  getCardsForRound,
}: ScorecardProps) {
  const [currentScores, setCurrentScores] = useState<string[]>(
    new Array(players.length).fill("")
  );
  const [showScoreboard, setShowScoreboard] = useState(false);
  const [editingRound, setEditingRound] = useState<number | null>(null);
  const [editScores, setEditScores] = useState<string[]>([]);
  const [activeInputIndex, setActiveInputIndex] = useState<number | null>(null);
  const [playerToDelete, setPlayerToDelete] = useState<Player | null>(null);
  const [isFinishGameDialogOpen, setIsFinishGameDialogOpen] = useState(false);

  const handleScoreChange = (index: number, value: string) => {
    if (value === "" || /^\d+$/.test(value)) {
      const newScores = [...currentScores];
      newScores[index] = value;
      setCurrentScores(newScores);
    }
  };

  const handleSaveRound = () => {
    const numericScores = currentScores.map((score) =>
      score === "" ? 0 : Number(score)
    );
    onSaveRound(numericScores);
    setCurrentScores(new Array(players.length).fill(""));
  };

  const getLeaders = () => {
    if (players.length === 0 || currentRound <= 1) return [];

    const scores = players.map((p) => ({
      ...p,
      total: calculateTotal(p.scores),
    }));

    const minScore = Math.min(...scores.map((p) => p.total));
    return scores.filter((p) => p.total === minScore);
  };

  const leaders = getLeaders();
  const showLeaderIndicator = currentRound > 1 && leaders.length > 0;

  const handleEditRound = (round: number) => {
    if (round >= currentRound) return;

    const roundIndex = round - 1;
    const roundScores = players.map(
      (player) => player.scores[roundIndex]?.toString() || "0"
    );

    setEditScores(roundScores);
    setEditingRound(round);
  };

  const handleSaveEditedScores = (editedScores: number[]) => {
    if (editingRound === null) return;

    const roundIndex = editingRound - 1;
    const updatedPlayers = players.map((player, playerIndex) => {
      const newScores = [...player.scores];
      newScores[roundIndex] = editedScores[playerIndex];
      return {
        ...player,
        scores: newScores,
      };
    });

    onUpdatePlayerScores(updatedPlayers);
    setEditingRound(null);
  };

  const handleInputFocus = (index: number) => {
    setActiveInputIndex(index);
  };

  const handleInputBlur = () => {
    setActiveInputIndex(null);
  };

  // Function to move to next input when Enter is pressed
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Enter") {
      e.preventDefault();

      // If this is the last input, save the round
      if (index === players.length - 1) {
        handleSaveRound();
      } else {
        // Focus the next input
        const nextInput = document.getElementById(`score-input-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  // Check if all scores are filled
  const allScoresFilled = currentScores.every((score) => score !== "");

  const handleDeleteRequest = (player: Player) => {
    if (players.length <= 2) return;
    setPlayerToDelete(player);
  };

  const handleConfirmDelete = () => {
    if (playerToDelete) {
      onDeletePlayer(playerToDelete.id);
      setPlayerToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-dark-200 flex flex-col">
      <div className="max-w-sm mx-auto w-full flex flex-col px-4 mt-4">
        <div className="bg-dark-100 rounded-xl shadow-lg p-4 mb-4 mt-4">
          {/* Header with scoreboard button */}
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => setShowScoreboard(true)}
              className="flex items-center justify-center bg-dark-300 text-white p-2 rounded-lg hover:bg-dark-200"
              aria-label="Ver marcador completo"
            >
              <span>
                <TableEdit24Filled></TableEdit24Filled>
              </span>
            </button>
            <div className="text-center">
              <h4 className="text-xl font-bold text-white">
                Puntos de la ronda
              </h4>
            </div>
            <button
              onClick={() => setIsFinishGameDialogOpen(true)}
              className="bg-dark-300 text-white p-2 rounded-lg hover:bg-dark-200 transition-colors flex items-center"
              aria-label="Finalizar partida"
            >
              <span className="m-auto"><Flag24Filled /></span>
            </button>
            <Dialog
              open={isFinishGameDialogOpen}
              onClose={() => setIsFinishGameDialogOpen(false)}
              className="relative z-50"
            >
              <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
              <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-dark-100 p-6 text-left align-middle shadow-xl transition-all">
                  <DialogTitle className="font-bold">
                    ¿Estás seguro de que quieres finalizar la partida actual?
                  </DialogTitle>
                  <div className="mt-4 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200"
                      onClick={() => setIsFinishGameDialogOpen(false)}
                    >
                      No
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-violet-500 px-4 py-2 text-sm font-medium text-white"
                      onClick={onFinishGame}
                    >
                      Si
                    </button>
                  </div>
                </DialogPanel>
              </div>
            </Dialog>
          </div>

          <div className="space-y-3 mb-4">
            {players.map((player, index) => {
              const isLeader =
                showLeaderIndicator &&
                leaders.some((leader) => leader.id === player.id);
              const { borderClass } = getColorClasses(player.color);
              const isActive = activeInputIndex === index;

              return (
                <div
                  key={player.id}
                  className={`bg-dark-300 p-3 rounded-lg transition-all duration-200 
                            ${isLeader ? `border-l-4 ${borderClass}` : ""}
                            ${isActive ? "ring-2 ring-primary" : ""}`}
                  style={{
                    borderLeftColor: isLeader ? player.color : "transparent",
                  }}
                >
                  <div className="flex items-center mb-2">
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <div
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: player.color }}
                        ></div>
                        <label
                          htmlFor={`score-input-${index}`}
                          className="text-sm font-medium text-white"
                        >
                          {player.name}
                          {isLeader && (
                            <span className="ml-2 text-xs bg-primary/20 text-yellow-500 px-2 py-1 rounded-full">
                              <Trophy16Filled></Trophy16Filled>
                            </span>
                          )}
                        </label>
                      </div>
                      {isLeader && (
                        <span className="text-xs text-primary ml-5">
                          Líder actual
                        </span>
                      )}
                    </div>
                    <span className="ml-auto mr-2 text-xs text-gray-200">
                      Total: {calculateTotal(player.scores)}
                    </span>
                    {players.length > 2 && (
                      <button
                        onClick={() => handleDeleteRequest(player)}
                        className="ml-2 p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-dark-200"
                        title={`Eliminar a ${player.name}`}
                      >
                        <Delete20Filled />
                      </button>
                    )}
                  </div>
                  <input
                    id={`score-input-${index}`}
                    type="number"
                    inputMode="numeric"
                    value={currentScores[index]}
                    onChange={(e) => handleScoreChange(index, e.target.value)}
                    onFocus={() => handleInputFocus(index)}
                    onBlur={handleInputBlur}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    placeholder="0"
                    className={`w-full p-2 text-lg bg-dark-100 border border-dark-300 rounded-lg 
                             focus:ring-2 focus:ring-primary focus:border-primary text-white
                             transition-all duration-200`}
                    style={{
                      borderLeftColor: player.color,
                      borderLeftWidth: "4px",
                      transform: isActive ? "scale(1.02)" : "scale(1)",
                    }}
                    disabled={isGameComplete}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {!isGameComplete && (
        <div className="bg-dark-200 p-4 fixed bottom-0 inset-x-0">
          <button
            onClick={handleSaveRound}
            className={`w-full py-3 px-4 bg-primary text-white rounded-lg 
                     transition-colors text-lg font-semibold
                     ${allScoresFilled ? "animate-pulse" : "opacity-90"}`}
          >
            Siguiente ronda
          </button>
        </div>
      )}

      {showScoreboard && (
        <ScoreboardModal
          players={players}
          currentRound={currentRound}
          onClose={() => setShowScoreboard(false)}
          onEditRound={handleEditRound}
          getCardsForRound={getCardsForRound}
        />
      )}

      {editingRound !== null && (
        <EditScoreModal
          players={players}
          round={editingRound}
          initialScores={editScores}
          onSave={handleSaveEditedScores}
          onCancel={() => setEditingRound(null)}
        />
      )}

      {/* Delete player confirmation dialog */}
      <Dialog
        open={playerToDelete !== null}
        onClose={() => setPlayerToDelete(null)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-dark-100 p-6 text-left align-middle shadow-xl transition-all">
            <DialogTitle className="text-lg font-medium leading-6 text-gray-200">
              Confirmar eliminación
            </DialogTitle>
            <div className="mt-2">
              <p className="text-sm text-gray-300">
                ¿Seguro que deseas eliminar a {playerToDelete?.name} del juego?
                Esta acción no podrá deshacerse.
              </p>
            </div>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                type="button"
                className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200"
                onClick={() => setPlayerToDelete(null)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                onClick={handleConfirmDelete}
              >
                Eliminar
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
}
