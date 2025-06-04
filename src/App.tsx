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
    if (window.confirm('¿Quieres iniciar un nuevo juego? La partida actual se guardará en el historial.')) {
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
    }
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
    if (window.confirm('¿Estás seguro de que quieres finalizar la partida actual?')) {
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
      if (window.confirm('¿Quieres volver al inicio? La partida actual se guardará en el historial.')) {
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
      }
    } else {
      // No active game or game is complete, just go home
      setAppState({
        ...appState,
        currentGame: initialGameState
      })
    }
    
    setShowResults(false)
  }

  const getCardsForRound = (round: number) => round + 2;

  // Find current game in history to get its ID and note
  const currentGameInHistory = gameHistory.find(g => 
    g.players.some(p => currentGame.players.some(cp => cp.id === p.id)) &&
    g.date > getCurrentDate().substring(0, 10)
  );

  useEffect(() => {
    const addListener = async () => {
      const handler = await CapacitorApp.addListener('backButton', () => {
        if (!currentGame.isGameStarted) {
          CapacitorApp.exitApp();
        }
      });
      return handler;
    };
    let listener: PluginListenerHandle | undefined;
    addListener().then(h => { listener = h });
    return () => {
      if (listener && typeof listener.remove === 'function') {
        listener.remove();
      }
    };
  }, [currentGame.isGameStarted]);

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
          <h1 className="text-lg font-semibold text-white flex flex-col items-center">
            <span className="flex items-center">
              <span className="mr-2">🃏</span> Ronda {currentGame.currentRound}
            </span>
            <span className="text-xs text-gray-400">
              {getCardsForRound(currentGame.currentRound)} cartas por jugador
            </span>
          </h1>
          <div className="flex space-x-2">
            <button
              onClick={handleGoHome}
              className="px-4 py-2 bg-dark-100 text-white rounded-lg 
                       hover:bg-dark-200 transition-colors flex items-center"
              aria-label="Volver al inicio"
            >
              <span className="mr-1">🏠</span> Inicio
            </button>
            <button
              onClick={handleNewGame}
              className="px-4 py-2 bg-dark-100 text-white rounded-lg 
                       hover:bg-dark-200 transition-colors flex items-center"
              aria-label="Iniciar nuevo juego"
            >
              <span className="mr-1">🔄</span> Nuevo Juego
            </button>
          </div>
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
