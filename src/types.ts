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
