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
  // Colores originales
  { name: 'Azul', value: '#3B82F6', class: 'bg-blue-500', borderClass: 'border-blue-500', bgClass: 'bg-blue-500/10' },
  { name: 'Rojo', value: '#EF4444', class: 'bg-red-500', borderClass: 'border-red-500', bgClass: 'bg-red-500/10' },
  { name: 'Verde', value: '#10B981', class: 'bg-green-500', borderClass: 'border-green-500', bgClass: 'bg-green-500/10' },
  { name: 'Amarillo', value: '#F59E0B', class: 'bg-yellow-500', borderClass: 'border-yellow-500', bgClass: 'bg-yellow-500/10' },
  { name: 'Púrpura', value: '#8B5CF6', class: 'bg-purple-500', borderClass: 'border-purple-500', bgClass: 'bg-purple-500/10' },
  { name: 'Rosa', value: '#EC4899', class: 'bg-pink-500', borderClass: 'border-pink-500', bgClass: 'bg-pink-500/10' },
  { name: 'Índigo', value: '#6366F1', class: 'bg-indigo-500', borderClass: 'border-indigo-500', bgClass: 'bg-indigo-500/10' },
  { name: 'Esmeralda', value: '#059669', class: 'bg-emerald-600', borderClass: 'border-emerald-600', bgClass: 'bg-emerald-600/10' },
  { name: 'Naranja', value: '#F97316', class: 'bg-orange-500', borderClass: 'border-orange-500', bgClass: 'bg-orange-500/10' },
  { name: 'Cian', value: '#06B6D4', class: 'bg-cyan-500', borderClass: 'border-cyan-500', bgClass: 'bg-cyan-500/10' },
  { name: 'Lima', value: '#84CC16', class: 'bg-lime-500', borderClass: 'border-lime-500', bgClass: 'bg-lime-500/10' },
  { name: 'Turquesa', value: '#14B8A6', class: 'bg-teal-500', borderClass: 'border-teal-500', bgClass: 'bg-teal-500/10' },
  { name: 'Celeste', value: '#0EA5E9', class: 'bg-sky-500', borderClass: 'border-sky-500', bgClass: 'bg-sky-500/10' },
  { name: 'Magenta', value: '#D946EF', class: 'bg-fuchsia-500', borderClass: 'border-fuchsia-500', bgClass: 'bg-fuchsia-500/10' },
  { name: 'Coral', value: '#F43F5E', class: 'bg-rose-500', borderClass: 'border-rose-500', bgClass: 'bg-rose-500/10' },
  { name: 'Lavanda', value: '#7C3AED', class: 'bg-violet-600', borderClass: 'border-violet-600', bgClass: 'bg-violet-600/10' },
  { name: 'Ámbar', value: '#D97706', class: 'bg-amber-600', borderClass: 'border-amber-600', bgClass: 'bg-amber-600/10' },
  { name: 'Océano', value: '#0891B2', class: 'bg-cyan-600', borderClass: 'border-cyan-600', bgClass: 'bg-cyan-600/10' },
  { name: 'Frambuesa', value: '#DB2777', class: 'bg-pink-600', borderClass: 'border-pink-600', bgClass: 'bg-pink-600/10' },
  { name: 'Zafiro', value: '#4F46E5', class: 'bg-indigo-600', borderClass: 'border-indigo-600', bgClass: 'bg-indigo-600/10' },
  { name: 'Chartreuse', value: '#65A30D', class: 'bg-lime-600', borderClass: 'border-lime-600', bgClass: 'bg-lime-600/10' },
  { name: 'Verde Marino', value: '#0D9488', class: 'bg-teal-600', borderClass: 'border-teal-600', bgClass: 'bg-teal-600/10' },
  { name: 'Azul Francia', value: '#0284C7', class: 'bg-sky-600', borderClass: 'border-sky-600', bgClass: 'bg-sky-600/10' },
  { name: 'Orquídea', value: '#C026D3', class: 'bg-fuchsia-600', borderClass: 'border-fuchsia-600', bgClass: 'bg-fuchsia-600/10' },
  { name: 'Carmín', value: '#E11D48', class: 'bg-rose-600', borderClass: 'border-rose-600', bgClass: 'bg-rose-600/10' },
  { name: 'Jade', value: '#047857', class: 'bg-emerald-700', borderClass: 'border-emerald-700', bgClass: 'bg-emerald-700/10' },
  { name: 'Amatista', value: '#6D28D9', class: 'bg-purple-700', borderClass: 'border-purple-700', bgClass: 'bg-purple-700/10' },
  { name: 'Mango', value: '#EA580C', class: 'bg-orange-600', borderClass: 'border-orange-600', bgClass: 'bg-orange-600/10' },
  { name: 'Rubí', value: '#DC2626', class: 'bg-red-600', borderClass: 'border-red-600', bgClass: 'bg-red-600/10' },
  { name: 'Bosque', value: '#16A34A', class: 'bg-green-600', borderClass: 'border-green-600', bgClass: 'bg-green-600/10' },
  { name: 'Ciruela', value: '#9333EA', class: 'bg-purple-600', borderClass: 'border-purple-600', bgClass: 'bg-purple-600/10' },
  { name: 'Lavanda Pastel', value: '#DDD6FE', class: 'bg-violet-200', borderClass: 'border-violet-200', bgClass: 'bg-violet-200/10' },
  { name: 'Menta', value: '#A7F3D0', class: 'bg-emerald-200', borderClass: 'border-emerald-200', bgClass: 'bg-emerald-200/10' },
  { name: 'Melocotón', value: '#FED7AA', class: 'bg-orange-200', borderClass: 'border-orange-200', bgClass: 'bg-orange-200/10' },
  { name: 'Rosa Pastel', value: '#FBCFE8', class: 'bg-pink-200', borderClass: 'border-pink-200', bgClass: 'bg-pink-200/10' }
];
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
