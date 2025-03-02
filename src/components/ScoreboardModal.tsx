import { useEffect, useRef } from 'react'
import type { Player } from '../types'
import { calculateTotal } from '../utils'

interface ScoreboardModalProps {
  players: Player[]
  currentRound: number
  onClose: () => void
  onEditRound: (round: number) => void
  getCardsForRound: (round: number) => number
}

export function ScoreboardModal({ 
  players, 
  currentRound, 
  onClose, 
  onEditRound,
  getCardsForRound
}: ScoreboardModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const rounds = Array.from({ length: 11 }, (_, i) => i + 1)

  // Close modal when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [onClose])

  // Prevent scrolling of background
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div 
        ref={modalRef}
        className="bg-dark-100 rounded-xl shadow-lg p-4 max-w-3xl w-full max-h-[90vh] overflow-auto"
      >
        <div className="flex justify-between items-center mb-4 sticky top-0 bg-dark-100 z-10 pb-2">
          <h2 className="text-xl font-semibold text-white flex items-center">
            <span className="mr-2">📊</span> Marcador completo
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400">
                <th className="text-left p-2 sticky left-0 bg-dark-100 z-10">Jugador</th>
                {rounds.map(round => (
                  <th 
                    key={round} 
                    className={`p-2 text-center ${round === currentRound ? 'bg-primary/20 text-primary rounded-t-lg' : ''}`}
                  >
                    <div className="flex flex-col items-center">
                      <div>R{round}</div>
                      <div className="text-xs">({getCardsForRound(round)}🃏)</div>
                      {round < currentRound && (
                        <button 
                          onClick={() => onEditRound(round)}
                          className="text-xs mt-1 text-primary hover:underline flex items-center justify-center"
                          title="Editar puntuación"
                          aria-label={`Editar puntuación de ronda ${round}`}
                        >
                          <span className="bg-primary/10 p-1 rounded-full">✏️</span>
                        </button>
                      )}
                    </div>
                  </th>
                ))}
                <th className="p-2 text-center bg-dark-300 sticky right-0 z-10">Total</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              {players.map(player => (
                <tr key={player.id} className="hover:bg-dark-300/50">
                  <td className="p-2 sticky left-0 bg-dark-100 flex items-center z-10">
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: player.color }}
                    ></div>
                    {player.name}
                  </td>
                  {rounds.map((round, i) => (
                    <td 
                      key={round} 
                      className={`p-2 text-center ${round === currentRound ? 'bg-primary/10' : ''}`}
                    >
                      {player.scores[i] !== undefined ? player.scores[i] : '-'}
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

        <div className="mt-4 flex justify-end sticky bottom-0 bg-dark-100 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-dark-300 text-white rounded-lg hover:bg-dark-200"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}