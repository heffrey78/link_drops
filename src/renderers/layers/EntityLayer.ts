/**
 * Entity Layer for rendering game entities
 * 
 * This layer is responsible for rendering game entities like the player,
 * enemies, and treasures.
 */

import { AbstractLayer } from './AbstractLayer';
import { Position, TerrainType } from '../../types';

export class EntityLayer extends AbstractLayer {
  private cellSize: number;
  private playerPosition: Position;
  private enemies: Position[];
  private treasures: (Position & { value: number })[];
  private colors: Record<string, string>;
  
  constructor(
    cellSize: number,
    playerPosition: Position,
    enemies: Position[] = [],
    treasures: (Position & { value: number })[] = [],
    zIndex: number = 1
  ) {
    super(zIndex);
    this.cellSize = cellSize;
    this.playerPosition = playerPosition;
    this.enemies = enemies;
    this.treasures = treasures;
    
    // Use the same colors as the current CSS
    this.colors = {
      player: '#fb8500',
      enemy: '#d00000',
      treasure: '#ffba08'
    };
  }
  
  /**
   * Update the player position
   * @param position The new player position
   */
  updatePlayerPosition(position: Position): void {
    // Mark the old position as dirty
    this.markDirty(this.playerPosition.x, this.playerPosition.y);
    
    // Update the position
    this.playerPosition = position;
    
    // Mark the new position as dirty
    this.markDirty(position.x, position.y);
  }
  
  /**
   * Update the enemies
   * @param enemies The new enemies
   */
  updateEnemies(enemies: Position[]): void {
    // Mark the old positions as dirty
    this.enemies.forEach(enemy => {
      this.markDirty(enemy.x, enemy.y);
    });
    
    // Update the enemies
    this.enemies = enemies;
    
    // Mark the new positions as dirty
    enemies.forEach(enemy => {
      this.markDirty(enemy.x, enemy.y);
    });
  }
  
  /**
   * Update the treasures
   * @param treasures The new treasures
   */
  updateTreasures(treasures: (Position & { value: number })[]): void {
    // Mark the old positions as dirty
    this.treasures.forEach(treasure => {
      this.markDirty(treasure.x, treasure.y);
    });
    
    // Update the treasures
    this.treasures = treasures;
    
    // Mark the new positions as dirty
    treasures.forEach(treasure => {
      this.markDirty(treasure.x, treasure.y);
    });
  }
  
  /**
   * Update the cell size
   * @param cellSize The new cell size
   */
  updateCellSize(cellSize: number): void {
    this.cellSize = cellSize;
    
    // Mark all entity positions as dirty
    this.markDirty(this.playerPosition.x, this.playerPosition.y);
    this.enemies.forEach(enemy => {
      this.markDirty(enemy.x, enemy.y);
    });
    this.treasures.forEach(treasure => {
      this.markDirty(treasure.x, treasure.y);
    });
  }
  
  /**
   * Render the entity layer
   * @param ctx The canvas rendering context
   */
  render(ctx: CanvasRenderingContext2D): void {
    if (!this.visible) return;
    
    // Optimize by merging overlapping dirty regions
    this.mergeOverlappingDirtyRegions();
    
    if (this.dirtyRegions.length === 0) {
      // If no dirty regions, render all entities
      this.renderAllEntities(ctx);
    } else {
      // Otherwise, render only the entities in dirty regions
      this.renderEntitiesInDirtyRegions(ctx);
    }
    
    // Clear dirty regions after rendering
    this.clearDirtyRegions();
  }
  
  /**
   * Render all entities
   * @param ctx The canvas rendering context
   */
  private renderAllEntities(ctx: CanvasRenderingContext2D): void {
    // Draw player
    this.drawEntity(ctx, this.playerPosition.x, this.playerPosition.y, TerrainType.PLAYER);
    
    // Draw enemies
    this.enemies.forEach(enemy => {
      this.drawEntity(ctx, enemy.x, enemy.y, TerrainType.ENEMY);
    });
    
    // Draw treasures
    this.treasures.forEach(treasure => {
      this.drawEntity(ctx, treasure.x, treasure.y, TerrainType.TREASURE);
    });
  }
  
  /**
   * Render only the entities in dirty regions
   * @param ctx The canvas rendering context
   */
  private renderEntitiesInDirtyRegions(ctx: CanvasRenderingContext2D): void {
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
      
      // Check if player is in the region
      if (
        this.playerPosition.x >= region.x &&
        this.playerPosition.x < region.x + region.width &&
        this.playerPosition.y >= region.y &&
        this.playerPosition.y < region.y + region.height
      ) {
        this.drawEntity(ctx, this.playerPosition.x, this.playerPosition.y, TerrainType.PLAYER);
      }
      
      // Check if enemies are in the region
      this.enemies.forEach(enemy => {
        if (
          enemy.x >= region.x &&
          enemy.x < region.x + region.width &&
          enemy.y >= region.y &&
          enemy.y < region.y + region.height
        ) {
          this.drawEntity(ctx, enemy.x, enemy.y, TerrainType.ENEMY);
        }
      });
      
      // Check if treasures are in the region
      this.treasures.forEach(treasure => {
        if (
          treasure.x >= region.x &&
          treasure.x < region.x + region.width &&
          treasure.y >= region.y &&
          treasure.y < region.y + region.height
        ) {
          this.drawEntity(ctx, treasure.x, treasure.y, TerrainType.TREASURE);
        }
      });
    }
  }
  
  /**
   * Draw a single entity
   * @param ctx The canvas rendering context
   * @param x The x coordinate of the entity
   * @param y The y coordinate of the entity
   * @param entityType The type of entity
   */
  private drawEntity(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    entityType: TerrainType
  ): void {
    const centerX = (x + 0.5) * this.cellSize;
    const centerY = (y + 0.5) * this.cellSize;
    const radius = this.cellSize * 0.4;
    
    ctx.save();
    
    switch (entityType) {
      case TerrainType.PLAYER:
        // Draw player as circle
        ctx.fillStyle = this.colors.player;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();
        break;
        
      case TerrainType.ENEMY:
        // Draw enemy as diamond
        ctx.fillStyle = this.colors.enemy;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - radius);
        ctx.lineTo(centerX + radius, centerY);
        ctx.lineTo(centerX, centerY + radius);
        ctx.lineTo(centerX - radius, centerY);
        ctx.closePath();
        ctx.fill();
        break;
        
      case TerrainType.TREASURE:
        // Draw treasure as star
        ctx.fillStyle = this.colors.treasure;
        this.drawStar(ctx, centerX, centerY, 5, radius, radius / 2);
        break;
    }
    
    ctx.restore();
  }
  
  /**
   * Draw a star shape
   * @param ctx The canvas rendering context
   * @param cx The center x coordinate
   * @param cy The center y coordinate
   * @param spikes The number of spikes
   * @param outerRadius The outer radius
   * @param innerRadius The inner radius
   */
  private drawStar(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    spikes: number,
    outerRadius: number,
    innerRadius: number
  ): void {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;
    
    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;
      
      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
  }
}
