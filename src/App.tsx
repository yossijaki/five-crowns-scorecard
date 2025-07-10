import { useState, useEffect } from 'react'
import { PlayerSetup } from './components/PlayerSetup'
import { Scorecard } from './components/Scorecard'
import { HomeScreen } from './components/HomeScreen'
import { GameNoteModal } from './components/GameNoteModal'
import { GameResults } from './components/GameResults'
import { useLocalStorage } from './hooks/useLocalStorage'
import type { AppState, GameState, Player, GameHistory } from './types'
import { generateGameId, getCurrentDate } from './utils'
import { App as CapacitorApp } from '@capacitor/app'
import type { PluginListenerHandle } from '@capacitor/core'
import { Home24Filled, ArrowRepeatAll24Filled, PlayingCardsFilled } from '@fluentui/react-icons';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'

const initialGameState: GameState = {
  players: [],
  currentRound: 1,
  isGameStarted: false,
  isGameComplete: false,
}

const initialAppState: AppState = {
  currentGame: initialGameState,
  gameHistory: [],
}

function App() {
  const [appState, setAppState] = useLocalStorage<AppState>('fiveCrownsApp', initialAppState)
  const [showNoteModal, setShowNoteModal] = useState(false)
  const [tempGameId, setTempGameId] = useState<string | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [isGoHomeDialogOpen, setIsGoHomeDialogOpen] = useState(false);
  const [isNewGameDialogOpen, setIsNewGameDialogOpen] = useState(false);

  const { currentGame, gameHistory } = appState

  const handleStartGame = (players: Player[]) => {
    setAppState({
      ...appState,
      currentGame: {
        ...initialGameState,
        players,
        isGameStarted: true,
      }
    })
  }

  const handleSaveRound = (scores: number[]) => {
    const updatedPlayers = currentGame.players.map((player, index) => ({
      ...player,
      scores: [...player.scores, scores[index]],
    }))

    const nextRound = currentGame.currentRound + 1
    const isComplete = nextRound > 11

    // Update current game
    const updatedGame = {
      ...currentGame,
      players: updatedPlayers,
      currentRound: nextRound,
      isGameComplete: isComplete,
    }

    // Save to history if not already there
    const gameInHistory = gameHistory.some(g =>
      g.players.some(p => p.id === updatedPlayers[0]?.id) &&
      g.date > getCurrentDate().substring(0, 10)
    )

    if (!gameInHistory) {
      const newGameHistory: GameHistory = {
        id: generateGameId(),
        date: getCurrentDate(),
        players: updatedPlayers,
        title: '',
        note: '',
        isComplete: isComplete,
        finalRound: nextRound,
      }

      setAppState({
        currentGame: updatedGame,
        gameHistory: [...gameHistory, newGameHistory]
      })

      if (isComplete) {
        setShowResults(true)
      }
    } else {
      // Just update current game
      setAppState({
        ...appState,
        currentGame: updatedGame
      })

      // Also update the game in history
      const updatedHistory = gameHistory.map(game => {
        if (game.players.some(p => updatedPlayers.some(up => up.id === p.id))) {
          return {
            ...game,
            players: updatedPlayers,
            isComplete: isComplete,
            finalRound: nextRound,
          }
        }
        return game
      })

      setAppState({
        currentGame: updatedGame,
        gameHistory: updatedHistory
      })

      if (isComplete) {
        setShowResults(true)
      }
    }
  }

  const handleNewGame = () => {
    // Save current game to history if it's not already there
    if (currentGame.players.length > 0) {
      const gameInHistory = gameHistory.some(g =>
        g.players.some(p => currentGame.players.some(cp => cp.id === p.id)) &&
        g.date > getCurrentDate().substring(0, 10)
      )

      if (!gameInHistory) {
        const newGameHistory: GameHistory = {
          id: generateGameId(),
          date: getCurrentDate(),
          players: currentGame.players,
          title: '',
          note: '',
          isComplete: false,
          finalRound: currentGame.currentRound,
        }

        setAppState({
          currentGame: {
            ...initialGameState,
            isGameStarted: true,
          },
          gameHistory: [...gameHistory, newGameHistory]
        })
      } else {
        setAppState({
          ...appState,
          currentGame: {
            ...initialGameState,
            isGameStarted: true,
          }
        })
      }
    } else {
      setAppState({
        ...appState,
        currentGame: {
          ...initialGameState,
          isGameStarted: true,
        }
      })
    }

    setShowResults(false)
    setIsNewGameDialogOpen(false);
  }

  const handleUpdatePlayerScores = (players: Player[]) => {
    setAppState({
      ...appState,
      currentGame: {
        ...currentGame,
        players,
      }
    })

    // Also update the game in history if it exists
    const updatedHistory = gameHistory.map(game => {
      if (game.players.some(p => players.some(up => up.id === p.id))) {
        return {
          ...game,
          players,
        }
      }
      return game
    })

    setAppState({
      currentGame: {
        ...currentGame,
        players,
      },
      gameHistory: updatedHistory
    })
  }

  const handleFinishGame = () => {
    // Mark current game as complete
    const updatedGame = {
      ...currentGame,
      isGameComplete: true,
    }

    // Find if game is already in history
    const existingGameIndex = gameHistory.findIndex(g =>
      g.players.some(p => currentGame.players.some(cp => cp.id === p.id)) &&
      g.date > getCurrentDate().substring(0, 10)
    )

    if (existingGameIndex >= 0) {
      // Update existing game in history
      const updatedHistory = [...gameHistory]
      updatedHistory[existingGameIndex] = {
        ...updatedHistory[existingGameIndex],
        players: currentGame.players,
        isComplete: true,
        finalRound: currentGame.currentRound,
      }

      setAppState({
        currentGame: updatedGame,
        gameHistory: updatedHistory
      })

      setShowResults(true)
    } else {
      // Add new game to history
      const newGameHistory: GameHistory = {
        id: generateGameId(),
        date: getCurrentDate(),
        players: currentGame.players,
        title: '',
        note: '',
        isComplete: true,
        finalRound: currentGame.currentRound,
      }

      setTempGameId(newGameHistory.id)

      setAppState({
        currentGame: updatedGame,
        gameHistory: [...gameHistory, newGameHistory]
      })

      setShowResults(true)
    }
  }

  const handleSaveNote = (note: string) => {
    if (!tempGameId) return

    const updatedHistory = gameHistory.map(game => {
      if (game.id === tempGameId) {
        return {
          ...game,
          note,
        }
      }
      return game
    })

    setAppState({
      ...appState,
      gameHistory: updatedHistory
    })

    setShowNoteModal(false)
    setTempGameId(null)
  }

  const handleUpdateGameNote = (gameId: string, note: string) => {
    const updatedHistory = gameHistory.map(game => {
      if (game.id === gameId) {
        return {
          ...game,
          note,
        }
      }
      return game
    })

    setAppState({
      ...appState,
      gameHistory: updatedHistory
    })
  }

  const handleStartNewGame = () => {
    setAppState({
      ...appState,
      currentGame: {
        ...initialGameState,
        isGameStarted: true,
      }
    })
    setShowResults(false)
  }

  const handleLoadGame = (gameId: string) => {
    const gameToLoad = gameHistory.find(g => g.id === gameId)
    if (!gameToLoad) return

    setAppState({
      ...appState,
      currentGame: {
        players: gameToLoad.players,
        currentRound: gameToLoad.finalRound,
        isGameStarted: true,
        isGameComplete: gameToLoad.isComplete,
      }
    })

    if (gameToLoad.isComplete) {
      setShowResults(true)
    } else {
      setShowResults(false)
    }
  }

  const handleDeleteGame = (gameId: string) => {
    const updatedHistory = gameHistory.filter(g => g.id !== gameId)
    setAppState({
      ...appState,
      gameHistory: updatedHistory
    })
  }

  const handleGoHome = () => {
    // If there's an active game, confirm before going home
    if (currentGame.players.length > 0 && !currentGame.isGameComplete) {
      // Save current game to history if it's not already there
      const gameInHistory = gameHistory.some(g =>
        g.players.some(p => currentGame.players.some(cp => cp.id === p.id)) &&
        g.date > getCurrentDate().substring(0, 10)
      )

      if (!gameInHistory && currentGame.players.length > 0) {
        const newGameHistory: GameHistory = {
          id: generateGameId(),
          date: getCurrentDate(),
          players: currentGame.players,
          title: '',
          note: '',
          isComplete: false,
          finalRound: currentGame.currentRound,
        }

        setAppState({
          currentGame: initialGameState,
          gameHistory: [...gameHistory, newGameHistory]
        })
      } else {
        setAppState({
          ...appState,
          currentGame: initialGameState
        })
      }
    } else {
      // No active game or game is complete, just go home
      setAppState({
        ...appState,
        currentGame: initialGameState
      })
    }

    setShowResults(false);
    setIsGoHomeDialogOpen(false);
  }

  const getCardsForRound = (round: number) => round + 2;

  // Find current game in history to get its ID and note
  const currentGameInHistory = gameHistory.find(g =>
    g.players.some(p => currentGame.players.some(cp => cp.id === p.id)) &&
    g.date > getCurrentDate().substring(0, 10)
  );

  useEffect(() => {
    let listener: PluginListenerHandle | undefined;
    const addListener = async () => {
      listener = await CapacitorApp.addListener('backButton', () => {
        // Pantalla PlayerSetup: volver a HomeScreen
        if (currentGame.isGameStarted && currentGame.players.length === 0) {
          setAppState({
            ...appState,
            currentGame: initialGameState
          });
          setShowResults(false);
          return;
        }
        // Pantalla GameResults: volver a HomeScreen
        if (showResults && currentGame.isGameComplete) {
          setAppState({
            ...appState,
            currentGame: initialGameState
          });
          setShowResults(false);
          return;
        }
        // Pantalla Scorecard: ejecutar handleGoHome
        if (currentGame.isGameStarted && currentGame.players.length > 0 && !currentGame.isGameComplete) {
          handleGoHome();
          return;
        }
        // Si está en HomeScreen, salir de la app
        if (!currentGame.isGameStarted) {
          CapacitorApp.exitApp();
        }
      });
    };
    addListener();
    return () => {
      if (listener && typeof listener.remove === 'function') {
        listener.remove();
      }
    };
  }, [currentGame, showResults, appState]);

  const handleDeletePlayer = (playerId: string) => {
    // Eliminar jugador de la partida actual
    const updatedPlayers = currentGame.players.filter(p => p.id !== playerId);
    // Eliminar jugador de todas las partidas del historial
    const updatedGameHistory = gameHistory.map(game => ({
      ...game,
      players: game.players.filter(p => p.id !== playerId),
    }));
    setAppState({
      ...appState,
      currentGame: {
        ...currentGame,
        players: updatedPlayers,
      },
      gameHistory: updatedGameHistory,
    });
  };

  if (!currentGame.isGameStarted) {
    return (
      <HomeScreen
        gameHistory={gameHistory}
        onStartNewGame={handleStartNewGame}
        onLoadGame={handleLoadGame}
        onDeleteGame={handleDeleteGame}
        onUpdateGameNote={handleUpdateGameNote}
      />
    )
  }

  if (currentGame.isGameStarted && currentGame.players.length === 0) {
    return (
      <PlayerSetup
        onStartGame={handleStartGame}
        onGoHome={handleGoHome}
      />
    )
  }

  if (showResults && currentGame.isGameComplete) {
    return (
      <GameResults
        players={currentGame.players}
        gameDate={currentGameInHistory?.date || getCurrentDate()}
        gameId={currentGameInHistory?.id || ''}
        initialNote={currentGameInHistory?.note || ''}
        onSaveNote={handleUpdateGameNote}
        onGoHome={handleGoHome}
        onNewGame={handleNewGame}
      />
    )
  }

  return (
    <div>
      <div className="fixed top-0 left-0 right-0 bg-dark-200 border-b border-dark-300 p-4 z-10">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <button
            onClick={() => setIsGoHomeDialogOpen(true)}
            className="px-4 py-2 bg-dark-100 text-white rounded-lg 
                      hover:bg-dark-200 transition-colors flex items-center"
            aria-label="Volver al inicio"
          >
            <span className="mr-1"><Home24Filled></Home24Filled></span>Inicio
          </button>
          <Dialog
            open={isGoHomeDialogOpen}
            onClose={() => setIsGoHomeDialogOpen(false)}
            className="relative z-50"
          >
            <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-dark-100 p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle className="font-bold">¿Deseas volver a la pantalla de inicio?</DialogTitle>
                <div className="mt-2">
                  <p className="text-sm text-gray-300">
                    La partida se guardará
                  </p>
                </div>
                <div className="mt-4 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200"
                    onClick={ () => setIsGoHomeDialogOpen(false) }
                  >
                    No
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-violet-500 px-4 py-2 text-sm font-medium text-white"
                    onClick={handleGoHome}
                  >
                    Si
                  </button>
                </div>
              </DialogPanel>
            </div>
          </Dialog>
          <h1 className="text-lg font-semibold text-white flex flex-col items-center">
            <span className="flex items-center">
              <span className="mr-2"><PlayingCardsFilled className="h-6 w-6"></PlayingCardsFilled></span> Ronda {currentGame.currentRound}
            </span>
            <span className="text-xs text-gray-400">
              {getCardsForRound(currentGame.currentRound)} cartas por jugador
            </span>
          </h1>
          <button
            onClick={() => setIsNewGameDialogOpen(true)}
            className="px-4 py-2 bg-dark-100 text-white rounded-lg 
                      hover:bg-dark-200 transition-colors flex items-center"
            aria-label="Iniciar nuevo juego"
          >
            <span className="mr-1"><ArrowRepeatAll24Filled></ArrowRepeatAll24Filled></span>Nuevo
          </button>
          <Dialog
            open={isNewGameDialogOpen}
            onClose={() => setIsNewGameDialogOpen(false)}
            className="relative z-50"
          >
            <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-dark-100 p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle className="font-bold">¿Deseas iniciar una nueva partida?</DialogTitle>
                <div className="mt-2">
                  <p className="text-sm text-gray-300">
                    La partida actual se guardará
                  </p>
                </div>
                <div className="mt-4 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200"
                    onClick={ () => setIsNewGameDialogOpen(false) }
                  >
                    No
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-violet-500 px-4 py-2 text-sm font-medium text-white"
                    onClick={handleNewGame}
                  >
                    Si
                  </button>
                </div>
              </DialogPanel>
            </div>
          </Dialog>
        </div>
      </div>

      <div className="pt-16 pb-20">
        <Scorecard
          players={currentGame.players}
          currentRound={currentGame.currentRound}
          onSaveRound={handleSaveRound}
          isGameComplete={currentGame.isGameComplete}
          onUpdatePlayerScores={handleUpdatePlayerScores}
          onFinishGame={handleFinishGame}
          getCardsForRound={getCardsForRound}
          onDeletePlayer={handleDeletePlayer}
        />
      </div>

      {showNoteModal && (
        <GameNoteModal
          initialNote=""
          onSave={handleSaveNote}
          onCancel={() => {
            setShowNoteModal(false)
            setTempGameId(null)
          }}
        />
      )}
    </div>
  )
}

export default App
