import { TerrainType, Position } from './types';

export class GameBoard {
  width: number;
  height: number;
  grid: TerrainType[][];

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.grid = Array(height).fill(null).map(() => Array(width).fill(TerrainType.EMPTY));
  }

  isPositionValid(x: number, y: number): boolean {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }
    
  getCell(x: number, y: number): TerrainType | undefined {
      if (this.isPositionValid(x, y)) {
          return this.grid[y][x];
      }
      return undefined;
  }

  setCell(x: number, y: number, terrainType: TerrainType): void {
    if (this.isPositionValid(x, y)) {
      this.grid[y][x] = terrainType;
    }
  }

  checkCompletedLines(): number[] {
    const completedLines: number[] = [];
    for (let y = 0; y < this.height; y++) {
      let isComplete = true;
      for (let x = 0; x < this.width; x++) {
        if (this.grid[y][x] === TerrainType.EMPTY) {
          isComplete = false;
          break;
        }
      }
      if (isComplete) {
        completedLines.push(y);
      }
    }
    return completedLines;
  }

    convertCompletedLinesToPath(completedLines: number[]): void {
        for (const y of completedLines) {
            for (let x = 0; x < this.width; x++) {
                this.grid[y][x] = TerrainType.PATH;
            }
        }
    }

    identifyHazards(): void {
        const visited = Array(this.height).fill(null).map(() => Array(this.width).fill(false));

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.grid[y][x] === TerrainType.EMPTY && !visited[y][x]) {
                    const emptyCluster = [];
                    const stack: Position[] = [{ x, y }];

                    while (stack.length > 0) {
                        const current = stack.pop();
                        if (!current) continue;
                        const cx = current.x;
                        const cy = current.y;

                        if (cx < 0 || cx >= this.width || cy < 0 || cy >= this.height ||
                            visited[cy][cx] || this.grid[cy][cx] !== TerrainType.EMPTY) {
                            continue;
                        }

                        visited[cy][cx] = true;
                        emptyCluster.push({ x: cx, y: cy });

                        stack.push({ x: cx + 1, y: cy });
                        stack.push({ x: cx - 1, y: cy });
                        stack.push({ x: cx, y: cy + 1 });
                        stack.push({ x: cx, y: cy - 1 });
                    }

                    if (emptyCluster.length > 0 && emptyCluster.length <= 3) {
                        emptyCluster.forEach(cell => {
                            this.grid[cell.y][cell.x] = TerrainType.HAZARD;
                        });
                    }
                }
            }
        }
    }
}
