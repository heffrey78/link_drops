/**
 * UI Layer for rendering UI elements
 * 
 * This layer is responsible for rendering UI elements like the action points indicator,
 * terrain tooltips, etc.
 */

import { AbstractLayer } from './AbstractLayer';
import { GameState, TerrainType } from '../../types';

export class UILayer extends AbstractLayer {
  private gameState: GameState;
  private cellSize: number;
  private boardWidth: number;
  private boardHeight: number;
  private hoveredCell: { x: number, y: number } | null = null;
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
      tooltip: 'rgba(0, 0, 0, 0.7)',
      tooltipText: '#ffffff',
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
   * Update the hovered cell
   * @param x The x coordinate of the hovered cell
   * @param y The y coordinate of the hovered cell
   */
  updateHoveredCell(x: number, y: number): void {
    // Mark the old hovered cell as dirty
    if (this.hoveredCell) {
      this.markDirty(this.hoveredCell.x, this.hoveredCell.y);
    }
    
    // Update the hovered cell
    this.hoveredCell = { x, y };
    
    // Mark the new hovered cell as dirty
    this.markDirty(x, y);
  }
  
  /**
   * Clear the hovered cell
   */
  clearHoveredCell(): void {
    // Mark the old hovered cell as dirty
    if (this.hoveredCell) {
      this.markDirty(this.hoveredCell.x, this.hoveredCell.y);
    }
    
    // Clear the hovered cell
    this.hoveredCell = null;
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
      this.renderTooltip(ctx);
    } else {
      // Otherwise, render only the UI elements in dirty regions
      this.renderActionPointsInDirtyRegions(ctx);
      this.renderTooltipInDirtyRegions(ctx);
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
  
  /**
   * Render the tooltip for the hovered cell
   * @param ctx The canvas rendering context
   */
  private renderTooltip(ctx: CanvasRenderingContext2D): void {
    // Only render tooltip if there's a hovered cell
    if (!this.hoveredCell) return;
    
    // Get the terrain type at the hovered cell
    // In a real implementation, this would come from the board
    // Using the numeric value to avoid TypeScript enum comparison issues
    const terrainType: number = TerrainType.FOREST; // Placeholder
    
    // Get the AP cost for the terrain type
    let apCost = 1;
    if (terrainType === TerrainType.PATH) {
      apCost = 1;
    } else if (terrainType === TerrainType.FOREST) {
      apCost = 2;
    } else if (terrainType === TerrainType.MOUNTAIN) {
      apCost = 3;
    } else if (terrainType === TerrainType.WATER) {
      apCost = 4;
    }
    
    // Get the terrain name
    let terrainName = 'Unknown';
    if (terrainType === TerrainType.PATH) {
      terrainName = 'Path';
    } else if (terrainType === TerrainType.FOREST) {
      terrainName = 'Forest';
    } else if (terrainType === TerrainType.MOUNTAIN) {
      terrainName = 'Mountain';
    } else if (terrainType === TerrainType.WATER) {
      terrainName = 'Water';
    }
    
    // Get the terrain effect
    let terrainEffect = '';
    if (terrainType === TerrainType.FOREST) {
      terrainEffect = 'Confuses enemies';
    } else if (terrainType === TerrainType.MOUNTAIN) {
      terrainEffect = 'Gives vision bonus';
    }
    
    // Calculate tooltip position
    const tooltipX = (this.hoveredCell.x + 1) * this.cellSize + 5;
    const tooltipY = this.hoveredCell.y * this.cellSize;
    
    // Calculate tooltip dimensions
    ctx.font = '12px Arial';
    const tooltipWidth = Math.max(
      ctx.measureText(terrainName).width,
      ctx.measureText(`AP Cost: ${apCost}`).width,
      terrainEffect ? ctx.measureText(terrainEffect).width : 0
    ) + 20;
    const tooltipHeight = 15 + (terrainEffect ? 15 : 0) + 15;
    
    // Draw tooltip background
    ctx.fillStyle = this.colors.tooltip;
    ctx.fillRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight);
    
    // Draw tooltip border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.strokeRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight);
    
    // Draw tooltip text
    ctx.fillStyle = this.colors.tooltipText;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(terrainName, tooltipX + 10, tooltipY + 5);
    ctx.fillText(`AP Cost: ${apCost}`, tooltipX + 10, tooltipY + 20);
    if (terrainEffect) {
      ctx.fillText(terrainEffect, tooltipX + 10, tooltipY + 35);
    }
  }
  
  /**
   * Render the tooltip for the hovered cell in dirty regions
   * @param ctx The canvas rendering context
   */
  private renderTooltipInDirtyRegions(ctx: CanvasRenderingContext2D): void {
    // Only render tooltip if there's a hovered cell
    if (!this.hoveredCell) return;
    
    // Check if any dirty region intersects with the hovered cell
    for (const region of this.dirtyRegions) {
      if (
        this.hoveredCell.x >= region.x &&
        this.hoveredCell.x < region.x + region.width &&
        this.hoveredCell.y >= region.y &&
        this.hoveredCell.y < region.y + region.height
      ) {
        // Render the tooltip
        this.renderTooltip(ctx);
        break;
      }
    }
  }
}
