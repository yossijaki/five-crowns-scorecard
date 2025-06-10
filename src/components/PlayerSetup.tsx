import { useState, useRef, useEffect } from 'react'
import type { Player } from '../types'
import { generatePlayerId, generateRandomName, PLAYER_COLORS, getRandomUniqueColors } from '../utils'
import { Home24Filled, Delete24Filled, AddCircle24Filled } from '@fluentui/react-icons'

interface PlayerSetupProps {
  onStartGame: (players: Player[]) => void
  onGoHome: () => void
}

export function PlayerSetup({ onStartGame, onGoHome }: PlayerSetupProps) {
  const [playerNames, setPlayerNames] = useState<string[]>(['', ''])
  const [playerColors, setPlayerColors] = useState<string[]>([])
  const [error, setError] = useState('')
  const [showColorPicker, setShowColorPicker] = useState<number | null>(null)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const colorPickerRef = useRef<HTMLDivElement>(null)

  // Initialize with random names and colors
  useEffect(() => {
    const randomNames = playerNames.map(() => generateRandomName())
    setPlayerNames(randomNames)
    
    // Assign random unique colors
    setPlayerColors(getRandomUniqueColors(playerNames.length))
  }, [])

  // Close color picker when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node) && 
          !(event.target as Element).classList.contains('color-button')) {
        setShowColorPicker(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const addPlayer = () => {
    if (playerNames.length < 7) {
      setPlayerNames([...playerNames, generateRandomName()])
      setPlayerColors([...playerColors, getRandomUniqueColors(1, playerColors)[0]])
    }
  }

  const removePlayer = (index: number) => {
    if (playerNames.length > 2) {
      const newNames = [...playerNames]
      newNames.splice(index, 1)
      setPlayerNames(newNames)
      
      const newColors = [...playerColors]
      newColors.splice(index, 1)
      setPlayerColors(newColors)
    }
  }

  const handleNameChange = (index: number, value: string) => {
    const newNames = [...playerNames]
    newNames[index] = value
    setPlayerNames(newNames)
  }

  const handleColorChange = (index: number, colorValue: string) => {
    // Check if color is already used by another player
    if (playerColors.includes(colorValue) && playerColors[index] !== colorValue) {
      // Find the player using this color
      const existingIndex = playerColors.findIndex(c => c === colorValue)
      
      // Swap colors
      const newColors = [...playerColors]
      const oldColor = newColors[index]
      newColors[index] = colorValue
      newColors[existingIndex] = oldColor
      setPlayerColors(newColors)
    } else {
      // Just update the color
      const newColors = [...playerColors]
      newColors[index] = colorValue
      setPlayerColors(newColors)
    }
    
    // Close color picker
    setShowColorPicker(null)
  }

  const toggleColorPicker = (index: number) => {
    setShowColorPicker(showColorPicker === index ? null : index)
  }

  const handleInputFocus = (index: number) => {
    // Select all text when focusing for the first time
    if (inputRefs.current[index]) {
      inputRefs.current[index]?.select()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Filter out empty names and replace with random names
    const processedNames = playerNames.map(name => 
      name.trim() === '' ? generateRandomName() : name.trim()
    )
    
    if (new Set(processedNames).size !== processedNames.length) {
      setError('Los nombres de los jugadores deben ser únicos')
      return
    }

    const players: Player[] = processedNames.map((name, index) => ({
      id: generatePlayerId(),
      name: name,
      scores: [],
      color: playerColors[index]
    }))

    onStartGame(players)
  }

  // Get color name from value
  const getColorName = (colorValue: string) => {
    const color = PLAYER_COLORS.find(c => c.value === colorValue)
    return color ? color.name : 'Color'
  }

  return (
    <div className="min-h-screen bg-dark-200 p-4">
      <div className="max-w-md mx-auto bg-dark-100 rounded-xl shadow-lg p-6">
        <div className="flex space-x-2 items-center mb-6">
          <button
            onClick={onGoHome}
            className="p-2 bg-dark-300 text-white rounded-lg hover:bg-dark-200 flex items-center"
            aria-label="Volver al inicio"
          >
            <span className="text-lg"><Home24Filled></Home24Filled></span>
          </button>
          <h1 className="text-2xl font-bold text-white">Configurar Jugadores</h1>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {playerNames.map((name, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="relative flex-1 flex items-center">
                  <button
                    type="button"
                    onClick={() => toggleColorPicker(index)}
                    className="absolute left-2 w-3 h-3 rounded-full cursor-pointer color-button flex items-center justify-center"
                    style={{ backgroundColor: playerColors[index] }}
                    aria-label={`Seleccionar color para ${name || `Jugador ${index + 1}`}`}
                    title={`Color actual: ${getColorName(playerColors[index])}`}
                  >
                    {showColorPicker === index && (
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-30"></span>
                    )}
                  </button>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => handleNameChange(index, e.target.value)}
                    onFocus={() => handleInputFocus(index)}
                    placeholder={`Jugador ${index + 1}`}
                    className="flex-1 p-2 pl-14 bg-dark-300 text-white border border-dark-100 rounded-lg 
                             focus:ring-2 focus:ring-primary focus:border-primary"
                    maxLength={30}
                    ref={(el) => { inputRefs.current[index] = el }}
                  />
                  
                  {showColorPicker === index && (
                    <div 
                      ref={colorPickerRef}
                      className="absolute z-20 left-0 top-10 bg-dark-300 rounded-lg p-3 shadow-lg grid grid-cols-5 gap-1 border border-dark-100 animate-fadeIn"
                    >
                      <div className="col-span-5 mb-1 text-xs text-gray-400 text-center">
                        Selecciona un color
                      </div>
                      {PLAYER_COLORS.map(color => {
                        const isUsed = playerColors.includes(color.value) && playerColors[index] !== color.value;
                        return (
                          <button
                            key={color.value}
                            type="button"
                            className={`w-5 h-5 rounded-full transition-transform hover:scale-110 relative
                                      ${isUsed ? 'opacity-40 cursor-not-allowed' : 'hover:ring-2 hover:ring-white'}`}
                            style={{ backgroundColor: color.value }}
                            onClick={() => !isUsed && handleColorChange(index, color.value)}
                            title={isUsed ? `${color.name} (usado por otro jugador)` : color.name}
                            disabled={isUsed}
                          >
                            {playerColors[index] === color.value && (
                              <span className="absolute inset-0 flex items-center justify-center text-white text-xs">✓</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
                {playerNames.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removePlayer(index)}
                    className="p-2 text-red-400 hover:text-red-300"
                    aria-label={`Eliminar jugador ${name || index + 1}`}
                  >
                    <Delete24Filled></Delete24Filled>
                  </button>
                )}
              </div>
            ))}
          </div>

          {error && (
            <p className="text-red-400 text-sm mt-2">{error}</p>
          )}

          <div className="mt-4 space-y-3">
            {playerNames.length < 7 && (
              <button
                type="button"
                onClick={addPlayer}
                className="w-full py-2 px-4 bg-dark-300 text-white rounded-lg 
                         hover:bg-zinc-700 transition-colors flex items-center justify-center"
              >
                <span className="mr-2"><AddCircle24Filled></AddCircle24Filled></span> Añadir jugador
              </button>
            )}
            <button
              type="submit"
              className="w-full py-2 px-4 bg-primary text-white rounded-lg 
                       hover:bg-primary/90 transition-colors"
            >
              Iniciar el juego
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
