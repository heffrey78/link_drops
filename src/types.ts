export interface Position {
  x: number;
  y: number;
}

export enum TerrainType {
  EMPTY = 0,
  FOREST = 1,
  MOUNTAIN = 2,
  WATER = 3,
  PATH = 4,
  HAZARD = 5,
  PLAYER = 6,
  ENEMY = 7,
  TREASURE = 8,
  SAFE_HAVEN = 9,
}

export interface PieceTemplate {
    shape: number[][];
    terrainType: TerrainType
}

export interface KeyboardControls {
  rotate: string[];
  moveLeft: string[];
  moveRight: string[];
  moveDown: string[];
  drop: string[];
  switchPhase: string[];
}

export type GamePhase = 'BUILDING' | 'ADVENTURE';

export interface GameState {
  phase: GamePhase;
  score: number;
  linesCompleted: number;
  hazardsCount: number;
  currentPiece: any | null; // Using any to avoid circular dependency
  currentPiecePosition: Position;
  playerPosition: Position;
  enemies: Position[];
  treasures: (Position & { value: number })[];
  messages: {
    text: string;
    timestamp: number;
    type?: 'info' | 'success' | 'warning' | 'danger';
  }[];
  // Action Points System (for Phase 1.1)
  actionPoints: number;
  maxActionPoints: number;
}
