/**
 * UI Layer for rendering UI elements
 * 
 * This layer is responsible for rendering UI elements like the action points indicator, etc.
 */

import { AbstractLayer } from './AbstractLayer';
import { GameState, TerrainType } from '../../types';

export class UILayer extends AbstractLayer {
  private gameState: GameState;
  private cellSize: number;
  private boardWidth: number;
  private boardHeight: number;
  private colors: Record<string, string>;
  
  constructor(
    gameState: GameState,
    cellSize: number,
    boardWidth: number,
    boardHeight: number,
    zIndex: number = 4
  ) {
    super(zIndex);
    this.gameState = gameState;
    this.cellSize = cellSize;
    this.boardWidth = boardWidth;
    this.boardHeight = boardHeight;
    
    // Use the same colors as the current CSS
    this.colors = {
      actionPoints: '#4cc9f0',
      forest: '#2d6a4f',
      mountain: '#6c757d',
      water: '#0077b6',
      path: '#ffb347'
    };
  }
  
  /**
   * Update the game state
   * @param gameState The new game state
   */
  updateGameState(gameState: GameState): void {
    this.gameState = gameState;
    this.markDirty(0, 0, this.boardWidth, this.boardHeight);
  }
  
  /**
   * Update the cell size
   * @param cellSize The new cell size
   */
  updateCellSize(cellSize: number): void {
    this.cellSize = cellSize;
    this.markDirty(0, 0, this.boardWidth, this.boardHeight);
  }
  
  /**
   * Render the UI layer
   * @param ctx The canvas rendering context
   */
  render(ctx: CanvasRenderingContext2D): void {
    if (!this.visible) return;
    
    // Optimize by merging overlapping dirty regions
    this.mergeOverlappingDirtyRegions();
    
    if (this.dirtyRegions.length === 0) {
      // If no dirty regions, render all UI elements
      this.renderActionPoints(ctx);
    } else {
      // Otherwise, render only the UI elements in dirty regions
      this.renderActionPointsInDirtyRegions(ctx);
    }
    
    // Clear dirty regions after rendering
    this.clearDirtyRegions();
  }
  
  /**
   * Render the action points indicator
   * @param ctx The canvas rendering context
   */
  private renderActionPoints(ctx: CanvasRenderingContext2D): void {
    // Only render action points in adventure phase
    if (this.gameState.phase !== 'ADVENTURE') return;
    
    const apBarWidth = this.boardWidth * this.cellSize;
    const apBarHeight = 10;
    const apBarY = this.boardHeight * this.cellSize + 10;
    
    // Draw background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(0, apBarY, apBarWidth, apBarHeight);
    
    // Draw action points
    const apPercentage = this.gameState.actionPoints / this.gameState.maxActionPoints;
    ctx.fillStyle = this.colors.actionPoints;
    ctx.fillRect(0, apBarY, apBarWidth * apPercentage, apBarHeight);
    
    // Draw text
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(
      `AP: ${this.gameState.actionPoints}/${this.gameState.maxActionPoints}`,
      apBarWidth / 2,
      apBarY + apBarHeight / 2
    );
  }
  
  /**
   * Render the action points indicator in dirty regions
   * @param ctx The canvas rendering context
   */
  private renderActionPointsInDirtyRegions(ctx: CanvasRenderingContext2D): void {
    // Only render action points in adventure phase
    if (this.gameState.phase !== 'ADVENTURE') return;
    
    const apBarY = this.boardHeight * this.cellSize + 10;
    const apBarHeight = 10;
    
    // Check if any dirty region intersects with the action points bar
    for (const region of this.dirtyRegions) {
      const pixelRegion = {
        x: region.x * this.cellSize,
        y: region.y * this.cellSize,
        width: region.width * this.cellSize,
        height: region.height * this.cellSize
      };
      
      if (
        pixelRegion.y + pixelRegion.height >= apBarY &&
        pixelRegion.y <= apBarY + apBarHeight
      ) {
        // Render the action points bar
        this.renderActionPoints(ctx);
        break;
      }
    }
  }
}
