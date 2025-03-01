import { TerrainType, PieceTemplate } from './types';

export class Piece {
  shape: number[][];
  terrainType: TerrainType;
  position: { x: number; y: number };

  constructor(template: PieceTemplate, x: number, y: number) {
    this.shape = template.shape;
    this.terrainType = template.terrainType;
    this.position = { x, y };
  }

    rotate() {
        const rotated = [];
        for (let i = 0; i < this.shape[0].length; i++) {
            const row = [];
            for (let j = this.shape.length - 1; j >= 0; j--) {
                row.push(this.shape[j][i]);
            }
            rotated.push(row);
        }
        this.shape = rotated;
    }
}

export const PIECES: PieceTemplate[] = [
    // I piece
    {
        shape: [
            [1, 1, 1, 1]
        ],
        terrainType: TerrainType.FOREST
    },
    // L piece
    {
        shape: [
            [2, 0, 0],
            [2, 2, 2]
        ],
        terrainType: TerrainType.MOUNTAIN
    },
    // J piece
    {
        shape: [
            [0, 0, 3],
            [3, 3, 3]
        ],
        terrainType: TerrainType.WATER
    },
    // O piece
    {
        shape: [
            [1, 1],
            [1, 1]
        ],
        terrainType: TerrainType.FOREST
    },
    // T piece
    {
        shape: [
            [0, 2, 0],
            [2, 2, 2]
        ],
        terrainType: TerrainType.MOUNTAIN
    },
    // S piece
    {
        shape: [
            [0, 3, 3],
            [3, 3, 0]
        ],
        terrainType: TerrainType.WATER
    },
    // Z piece
    {
        shape: [
            [1, 1, 0],
            [0, 1, 1]
        ],
        terrainType: TerrainType.FOREST
    }
];
