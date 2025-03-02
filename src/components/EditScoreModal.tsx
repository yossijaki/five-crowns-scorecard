import { useState, useEffect, useRef } from 'react'
import type { Player } from '../types'

interface EditScoreModalProps {
  players: Player[]
  round: number
  initialScores: string[]
  onSave: (scores: number[]) => void
  onCancel: () => void
}

export function EditScoreModal({ 
  players, 
  round, 
  initialScores, 
  onSave, 
  onCancel 
}: EditScoreModalProps) {
  const [scores, setScores] = useState<string[]>(initialScores)
  const [activeInputIndex, setActiveInputIndex] = useState<number | null>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleScoreChange = (index: number, value: string) => {
    if (value === '' || /^\d+$/.test(value)) {
      const newScores = [...scores]
      newScores[index] = value
      setScores(newScores)
    }
  }

  const handleSave = () => {
    const numericScores = scores.map(score => score === '' ? 0 : Number(score))
    onSave(numericScores)
  }

  const handleInputFocus = (index: number) => {
    setActiveInputIndex(index)
    inputRefs.current[index]?.select()
  }

  const handleInputBlur = () => {
    setActiveInputIndex(null)
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      
      // If this is the last input, save
      if (index === players.length - 1) {
        handleSave()
      } else {
        // Focus the next input
        inputRefs.current[index + 1]?.focus()
      }
    } else if (e.key === 'Escape') {
      onCancel()
    }
  }

  // Close modal when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onCancel()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [onCancel])

  // Prevent scrolling of background
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div 
        ref={modalRef}
        className="bg-dark-100 rounded-xl shadow-lg p-4 max-w-md w-full"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Editar puntuación - Ronda {round}</h2>
          <button 
            onClick={onCancel}
            className="text-gray-400 hover:text-white p-2"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3 mb-4">
          {players.map((player, index) => {
            const isActive = activeInputIndex === index;
            
            return (
              <div 
                key={player.id} 
                className={`bg-dark-300 p-3 rounded-lg transition-all duration-200
                          ${isActive ? 'ring-2 ring-primary' : ''}`}
              >
                <div className="flex justify-between items-center mb-2">
                  <label 
                    htmlFor={`edit-score-${index}`}
                    className="text-sm font-medium text-white flex items-center"
                  >
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: player.color }}
                    ></div>
                    {player.name}
                  </label>
                </div>
                <input
                  id={`edit-score-${index}`}
                  type="number"
                  inputMode="numeric"
                  value={scores[index]}
                  onChange={(e) => handleScoreChange(index, e.target.value)}
                  onFocus={() => handleInputFocus(index)}
                  onBlur={handleInputBlur}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  placeholder="0"
                  className="w-full p-2 text-lg bg-dark-100 border border-dark-300 rounded-lg 
                           focus:ring-2 focus:ring-primary focus:border-primary text-white
                           transition-all duration-200"
                  style={{ 
                    borderLeftColor: player.color, 
                    borderLeftWidth: '4px',
                    transform: isActive ? 'scale(1.02)' : 'scale(1)'
                  }}
                  ref={(el) => { inputRefs.current[index] = el }}
                />
              </div>
            );
          })}
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-dark-300 text-white rounded-lg hover:bg-dark-200"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  )
}
