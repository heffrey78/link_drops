import { GameBoard } from '../gameBoard';
import { Piece } from '../piece';
import { Position, TerrainType, GameState } from '../types';
import { Renderer } from './Renderer';

export class CanvasRenderer implements Renderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private cellSize: number;
  private boardWidth: number;
  private boardHeight: number;
  private colors: Record<string, string>;
  private dirtyRects: { x: number, y: number, width: number, height: number }[] = [];
  
  constructor(canvasId: string) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;
    this.cellSize = 30;
    this.boardWidth = 0;
    this.boardHeight = 0;
    
    // Use the same colors as the current CSS
    this.colors = {
      empty: '#333',
      forest: '#2d6a4f',
      mountain: '#6c757d',
      water: '#0077b6',
      path: '#ffb347',
      hazard: '#9d0208',
      player: '#fb8500',
      enemy: '#d00000',
      treasure: '#ffba08',
      safeHaven: '#8ecae6'
    };
    
    // Handle window resize
    window.addEventListener('resize', () => this.resize());
  }
  
  initialize(boardWidth: number, boardHeight: number): void {
    this.boardWidth = boardWidth;
    this.boardHeight = boardHeight;
    this.resize();
  }
  
  resize(): void {
    // Calculate the maximum cell size that fits the window
    const maxWidth = window.innerWidth * 0.8;
    const maxHeight = window.innerHeight * 0.8;
    
    const maxCellWidth = maxWidth / this.boardWidth;
    const maxCellHeight = maxHeight / this.boardHeight;
    
    this.cellSize = Math.min(maxCellWidth, maxCellHeight, 30);
    
    this.canvas.width = this.boardWidth * this.cellSize;
    this.canvas.height = this.boardHeight * this.cellSize;
  }
  
  markDirty(x: number, y: number, width: number = 1, height: number = 1): void {
    this.dirtyRects.push({
      x: x * this.cellSize,
      y: y * this.cellSize,
      width: width * this.cellSize,
      height: height * this.cellSize
    });
  }
  
  clear(): void {
    if (this.dirtyRects.length === 0) {
      // Clear entire canvas if no dirty rects
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    } else {
      // Clear only dirty rectangles
      this.dirtyRects.forEach(rect => {
        this.ctx.clearRect(rect.x, rect.y, rect.width, rect.height);
      });
      this.dirtyRects = [];
    }
  }
  
  renderBoard(board: GameBoard): void {
    for (let y = 0; y < board.height; y++) {
      for (let x = 0; x < board.width; x++) {
        const cell = board.getCell(x, y);
        this.drawCell(x, y, cell || TerrainType.EMPTY);
      }
    }
  }
  
  renderPiece(piece: Piece, position: Position): void {
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x] !== 0) {
          const boardX = position.x + x;
          const boardY = position.y + y;
          this.drawCell(boardX, boardY, piece.shape[y][x] as TerrainType);
        }
      }
    }
  }
  
  renderEntities(player: Position, enemies: Position[], treasures: (Position & { value: number })[]): void {
    // Draw player
    this.drawEntity(player.x, player.y, TerrainType.PLAYER);
    
    // Draw enemies
    enemies.forEach(enemy => {
      this.drawEntity(enemy.x, enemy.y, TerrainType.ENEMY);
    });
    
    // Draw treasures
    treasures.forEach(treasure => {
      this.drawEntity(treasure.x, treasure.y, TerrainType.TREASURE);
    });
  }
  
  renderUI(gameState: GameState): void {
    // UI will be handled by DOM elements outside the canvas
    // This method is here to satisfy the interface
  }
  
  private drawCell(x: number, y: number, terrainType: TerrainType): void {
    const terrainClass = this.getTerrainClass(terrainType);
    const color = this.colors[terrainClass];
    
    this.ctx.fillStyle = color;
    this.ctx.fillRect(
      x * this.cellSize,
      y * this.cellSize,
      this.cellSize,
      this.cellSize
    );
    
    // Add cell border
    this.ctx.strokeStyle = '#222';
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(
      x * this.cellSize,
      y * this.cellSize,
      this.cellSize,
      this.cellSize
    );
  }
  
  private drawEntity(x: number, y: number, entityType: TerrainType): void {
    const centerX = (x + 0.5) * this.cellSize;
    const centerY = (y + 0.5) * this.cellSize;
    const radius = this.cellSize * 0.4;
    
    this.ctx.save();
    
    switch (entityType) {
      case TerrainType.PLAYER:
        // Draw player as circle
        this.ctx.fillStyle = this.colors.player;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        this.ctx.fill();
        break;
        
      case TerrainType.ENEMY:
        // Draw enemy as diamond
        this.ctx.fillStyle = this.colors.enemy;
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, centerY - radius);
        this.ctx.lineTo(centerX + radius, centerY);
        this.ctx.lineTo(centerX, centerY + radius);
        this.ctx.lineTo(centerX - radius, centerY);
        this.ctx.closePath();
        this.ctx.fill();
        break;
        
      case TerrainType.TREASURE:
        // Draw treasure as star
        this.ctx.fillStyle = this.colors.treasure;
        this.drawStar(centerX, centerY, 5, radius, radius / 2);
        break;
    }
    
    this.ctx.restore();
  }
  
  private drawStar(cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number): void {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;
    
    this.ctx.beginPath();
    this.ctx.moveTo(cx, cy - outerRadius);
    
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      this.ctx.lineTo(x, y);
      rot += step;
      
      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      this.ctx.lineTo(x, y);
      rot += step;
    }
    
    this.ctx.lineTo(cx, cy - outerRadius);
    this.ctx.closePath();
    this.ctx.fill();
  }
  
  private getTerrainClass(terrainType: TerrainType): string {
    switch (terrainType) {
      case TerrainType.FOREST: return 'forest';
      case TerrainType.MOUNTAIN: return 'mountain';
      case TerrainType.WATER: return 'water';
      case TerrainType.PATH: return 'path';
      case TerrainType.HAZARD: return 'hazard';
      case TerrainType.PLAYER: return 'player';
      case TerrainType.ENEMY: return 'enemy';
      case TerrainType.TREASURE: return 'treasure';
      case TerrainType.SAFE_HAVEN: return 'safeHaven';
      default: return 'empty';
    }
  }
  
  getCanvasPosition(clientX: number, clientY: number): Position {
    const rect = this.canvas.getBoundingClientRect();
    const x = Math.floor((clientX - rect.left) / this.cellSize);
    const y = Math.floor((clientY - rect.top) / this.cellSize);
    return { x, y };
  }
}
