/**
 * Piece Layer for rendering the current tetromino piece
 * 
 * This layer is responsible for rendering the current tetromino piece
 * during the building phase.
 */

import { AbstractLayer } from './AbstractLayer';
import { Piece } from '../../piece';
import { Position, TerrainType } from '../../types';

export class PieceLayer extends AbstractLayer {
  private piece: Piece | null;
  private position: Position;
  private cellSize: number;
  private colors: Record<string, string>;
  
  constructor(
    cellSize: number,
    piece: Piece | null = null,
    position: Position = { x: 0, y: 0 },
    zIndex: number = 1
  ) {
    super(zIndex);
    this.cellSize = cellSize;
    this.piece = piece;
    this.position = position;
    
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
  }
  
  /**
   * Update the piece
   * @param piece The new piece
   * @param position The new position
   */
  updatePiece(piece: Piece | null, position: Position): void {
    // Mark the old piece position as dirty
    if (this.piece) {
      const width = this.piece.shape[0].length;
      const height = this.piece.shape.length;
      this.markDirty(this.position.x, this.position.y, width, height);
    }
    
    // Update the piece and position
    this.piece = piece;
    this.position = position;
    
    // Mark the new piece position as dirty
    if (piece) {
      const width = piece.shape[0].length;
      const height = piece.shape.length;
      this.markDirty(position.x, position.y, width, height);
    }
  }
  
  /**
   * Update the cell size
   * @param cellSize The new cell size
   */
  updateCellSize(cellSize: number): void {
    this.cellSize = cellSize;
    
    // Mark the piece position as dirty
    if (this.piece) {
      const width = this.piece.shape[0].length;
      const height = this.piece.shape.length;
      this.markDirty(this.position.x, this.position.y, width, height);
    }
  }
  
  /**
   * Render the piece layer
   * @param ctx The canvas rendering context
   */
  render(ctx: CanvasRenderingContext2D): void {
    if (!this.visible || !this.piece) return;
    
    // Save context state
    ctx.save();
    
    // Set composite operation to ensure proper transparency
    ctx.globalCompositeOperation = 'source-over';
    
    // Render the piece
    for (let y = 0; y < this.piece.shape.length; y++) {
        for (let x = 0; x < this.piece.shape[y].length; x++) {
            if (this.piece.shape[y][x] !== 0) {
                const boardX = this.position.x + x;
                const boardY = this.position.y + y;
                
                const terrainType = this.piece.shape[y][x] as TerrainType;
                const terrainClass = this.getTerrainClass(terrainType);
                const color = this.colors[terrainClass];
                
                ctx.fillStyle = color;
                ctx.fillRect(
                    boardX * this.cellSize,
                    boardY * this.cellSize,
                    this.cellSize,
                    this.cellSize
                );
            }
        }
    }
    
    // Restore context state
    ctx.restore();
  }
  
  /**
   * Render the entire piece
   * @param ctx The canvas rendering context
   */
  private renderPiece(ctx: CanvasRenderingContext2D): void {
    if (!this.piece) return;
    
    // Clear the area where the piece will be rendered
    const pieceWidth = this.piece.shape[0].length * this.cellSize;
    const pieceHeight = this.piece.shape.length * this.cellSize;
    ctx.clearRect(
        this.position.x * this.cellSize,
        this.position.y * this.cellSize,
        pieceWidth,
        pieceHeight
    );
    
    // Then render each non-empty cell
    for (let y = 0; y < this.piece.shape.length; y++) {
        for (let x = 0; x < this.piece.shape[y].length; x++) {
            if (this.piece.shape[y][x] !== 0) {
                const boardX = this.position.x + x;
                const boardY = this.position.y + y;
                this.drawCell(ctx, boardX, boardY, this.piece.shape[y][x] as TerrainType);
            }
        }
    }
}
  
  /**
   * Render only the piece cells in dirty regions
   * @param ctx The canvas rendering context
   */
  private renderPieceInDirtyRegions(ctx: CanvasRenderingContext2D): void {
    if (!this.piece) return;
    
    for (const region of this.dirtyRegions) {
      // Convert from cell coordinates to pixel coordinates
      const pixelRegion = {
        x: region.x * this.cellSize,
        y: region.y * this.cellSize,
        width: region.width * this.cellSize,
        height: region.height * this.cellSize
      };
      
      // Clear the region
      ctx.clearRect(
        pixelRegion.x,
        pixelRegion.y,
        pixelRegion.width,
        pixelRegion.height
      );
      
      // Calculate the piece cells that are in the region
      const startPieceX = Math.max(0, region.x - this.position.x);
      const startPieceY = Math.max(0, region.y - this.position.y);
      const endPieceX = Math.min(
        this.piece.shape[0].length,
        region.x + region.width - this.position.x
      );
      const endPieceY = Math.min(
        this.piece.shape.length,
        region.y + region.height - this.position.y
      );
      
      // Render the piece cells in the region
      for (let y = startPieceY; y < endPieceY; y++) {
        for (let x = startPieceX; x < endPieceX; x++) {
          if (this.piece.shape[y][x] !== 0) {
            const boardX = this.position.x + x;
            const boardY = this.position.y + y;
            this.drawCell(ctx, boardX, boardY, this.piece.shape[y][x] as TerrainType);
          }
        }
      }
    }
  }
  
  /**
   * Draw a single cell
   * @param ctx The canvas rendering context
   * @param x The x coordinate of the cell
   * @param y The y coordinate of the cell
   * @param terrainType The terrain type of the cell
   */
  private drawCell(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    terrainType: TerrainType
  ): void {
    const terrainClass = this.getTerrainClass(terrainType);
    const color = this.colors[terrainClass];
    
    ctx.fillStyle = color;
    ctx.fillRect(
      x * this.cellSize,
      y * this.cellSize,
      this.cellSize,
      this.cellSize
    );
    
    // We're not adding cell borders to avoid the black surroundings
  }
  
  /**
   * Get the CSS class for a terrain type
   * @param terrainType The terrain type
   * @returns The CSS class
   */
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
}
