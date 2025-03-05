export type Position = {
  x: number;
  y: number;
};

export type MazeCell = {
  walls: {
    top: boolean;
    right: boolean;
    bottom: boolean;
    left: boolean;
  };
  visited: boolean;
  isExit?: boolean;
  isBonus?: boolean;
  isObstacle?: boolean;
};

export type MazeConfig = {
  width: number;
  height: number;
  cells: MazeCell[][];
};

export type Difficulty = 'easy' | 'medium' | 'hard';

export type GameState = {
  isPlaying: boolean;
  timeElapsed: number;
  moves: number;
  hasWon: boolean;
  score: number;
  timeLimit: number;
};

export type HighScore = {
  playerName: string;
  difficulty: Difficulty;
  score: number;
  time: number;
  moves: number;
  date: string;
};