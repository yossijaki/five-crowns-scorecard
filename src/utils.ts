import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateTotal(scores: number[]): number {
  return scores.reduce((sum, score) => sum + score, 0)
}

export function generatePlayerId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export function generateGameId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

// Format date to readable format
export function formatDate(dateString: string, shortFormat = false): string {
  const date = new Date(dateString);
  
  if (shortFormat) {
    return new Intl.DateTimeFormat('es', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  }
  
  return new Intl.DateTimeFormat('es', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

// Get current date in ISO format
export function getCurrentDate(): string {
  return new Date().toISOString();
}

// Arrays for random name generation
export const subjects = [
  "Ratón", "Zorro", "Gato", "Perro", "Lobo", 
  "Tigre", "León", "Oso", "Mono", "Elefante", 
  "Conejo", "Panda", "Koala", "Búho", "Águila", 
  "Delfín", "Tortuga", "Pingüino", "Canguro", "Jirafa"
]

export const adjectives = [
  "Saltarín", "Parlanchín", "Dormilón", "Juguetón", "Gruñón", 
  "Risueño", "Veloz", "Astuto", "Valiente", "Tímido", 
  "Curioso", "Travieso", "Perezoso", "Inquieto", "Sabio", 
  "Elegante", "Distraído", "Hambriento", "Soñador", "Aventurero"
]

export function generateRandomName(): string {
  const randomSubject = subjects[Math.floor(Math.random() * subjects.length)]
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)]
  return `${randomSubject} ${randomAdjective}`
}

// Player colors - Fixed duplicate #10B981 color by changing Esmeralda to a different shade
export const PLAYER_COLORS = [
  { name: 'Azul', value: '#3B82F6', class: 'bg-blue-500', borderClass: 'border-blue-500', bgClass: 'bg-blue-500/10' },
  { name: 'Rojo', value: '#EF4444', class: 'bg-red-500', borderClass: 'border-red-500', bgClass: 'bg-red-500/10' },
  { name: 'Verde', value: '#10B981', class: 'bg-green-500', borderClass: 'border-green-500', bgClass: 'bg-green-500/10' },
  { name: 'Amarillo', value: '#F59E0B', class: 'bg-yellow-500', borderClass: 'border-yellow-500', bgClass: 'bg-yellow-500/10' },
  { name: 'Púrpura', value: '#8B5CF6', class: 'bg-purple-500', borderClass: 'border-purple-500', bgClass: 'bg-purple-500/10' },
  { name: 'Rosa', value: '#EC4899', class: 'bg-pink-500', borderClass: 'border-pink-500', bgClass: 'bg-pink-500/10' },
  { name: 'Índigo', value: '#6366F1', class: 'bg-indigo-500', borderClass: 'border-indigo-500', bgClass: 'bg-indigo-500/10' },
  { name: 'Esmeralda', value: '#059669', class: 'bg-emerald-600', borderClass: 'border-emerald-600', bgClass: 'bg-emerald-600/10' }, // Changed color value
  { name: 'Naranja', value: '#F97316', class: 'bg-orange-500', borderClass: 'border-orange-500', bgClass: 'bg-orange-500/10' },
  { name: 'Cian', value: '#06B6D4', class: 'bg-cyan-500', borderClass: 'border-cyan-500', bgClass: 'bg-cyan-500/10' }
]

export function getRandomUniqueColors(count: number, usedColors: string[] = []): string[] {
  const availableColors = PLAYER_COLORS.filter(color => !usedColors.includes(color.value))
  const shuffled = [...availableColors].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count).map(color => color.value)
}

export function getColorClasses(colorValue: string) {
  const color = PLAYER_COLORS.find(c => c.value === colorValue) || PLAYER_COLORS[0]
  return {
    borderClass: color.borderClass,
    bgClass: color.bgClass
  }
}
