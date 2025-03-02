export interface Player {
  id: string;
  name: string;
  scores: number[];
  color: string;
}

export interface GameState {
  players: Player[];
  currentRound: number;
  isGameStarted: boolean;
  isGameComplete: boolean;
}

export interface GameHistory {
  id: string;
  date: string;
  players: Player[];
  title: string;
  note: string;
  isComplete: boolean;
  finalRound: number;
}

export interface AppState {
  currentGame: GameState;
  gameHistory: GameHistory[];
}
