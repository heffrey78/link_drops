/**
 * Board Layer for rendering the game board
 * 
 * This layer is responsible for rendering the game board with all terrain types.
 */

import { AbstractLayer } from './AbstractLayer';
import { GameBoard } from '../../gameBoard';
import { TerrainType } from '../../types';

export class BoardLayer extends AbstractLayer {
  private board: GameBoard;
  private cellSize: number;
  private colors: Record<string, string>;
  
  constructor(board: GameBoard, cellSize: number, zIndex: number = 0) {
    super(zIndex);
    this.board = board;
    this.cellSize = cellSize;
    
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
   * Update the board reference
   * @param board The new board
   */
  updateBoard(board: GameBoard): void {
    this.board = board;
    // Mark the entire board as dirty
    this.markDirty(0, 0, this.board.width, this.board.height);
  }
  
  /**
   * Update the cell size
   * @param cellSize The new cell size
   */
  updateCellSize(cellSize: number): void {
    this.cellSize = cellSize;
    // Mark the entire board as dirty
    this.markDirty(0, 0, this.board.width, this.board.height);
  }
  
  /**
   * Render the board layer
   * @param ctx The canvas rendering context
   */
  render(ctx: CanvasRenderingContext2D): void {
    if (!this.visible) return;
    
    // Optimize by merging overlapping dirty regions
    this.mergeOverlappingDirtyRegions();
    
    if (this.dirtyRegions.length === 0) {
      // If no dirty regions, render the entire board
      this.renderEntireBoard(ctx);
    } else {
      // Otherwise, render only the dirty regions
      this.renderDirtyRegions(ctx);
    }
    
    // Clear dirty regions after rendering
    this.clearDirtyRegions();
  }
  
  /**
   * Render the entire board
   * @param ctx The canvas rendering context
   */
  private renderEntireBoard(ctx: CanvasRenderingContext2D): void {
    for (let y = 0; y < this.board.height; y++) {
      for (let x = 0; x < this.board.width; x++) {
        const cell = this.board.getCell(x, y);
        this.drawCell(ctx, x, y, cell || TerrainType.EMPTY);
      }
    }
  }
  
  /**
   * Render only the dirty regions
   * @param ctx The canvas rendering context
   */
  private renderDirtyRegions(ctx: CanvasRenderingContext2D): void {
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
      
      // Render the cells in the region
      const startX = Math.max(0, region.x);
      const startY = Math.max(0, region.y);
      const endX = Math.min(this.board.width, region.x + region.width);
      const endY = Math.min(this.board.height, region.y + region.height);
      
      for (let y = startY; y < endY; y++) {
        for (let x = startX; x < endX; x++) {
          const cell = this.board.getCell(x, y);
          this.drawCell(ctx, x, y, cell || TerrainType.EMPTY);
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
