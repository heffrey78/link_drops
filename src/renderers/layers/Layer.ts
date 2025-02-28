/**
 * Layer interface for the rendering system
 * 
 * This file defines the interface for rendering layers.
 * Each layer is responsible for rendering a specific part of the game.
 */

export interface Layer {
  /**
   * Render the layer to the given context
   * @param ctx The canvas rendering context
   */
  render(ctx: CanvasRenderingContext2D): void;
  
  /**
   * Update the layer state
   * @param deltaTime Time elapsed since the last update in milliseconds
   */
  update(deltaTime: number): void;
  
  /**
   * Get the z-index of the layer (determines rendering order)
   */
  getZIndex(): number;
  
  /**
   * Check if the layer is visible
   */
  isVisible(): boolean;
  
  /**
   * Set the visibility of the layer
   * @param visible Whether the layer should be visible
   */
  setVisible(visible: boolean): void;
  
  /**
   * Mark a region of the layer as dirty (needs redrawing)
   * @param x X coordinate of the top-left corner of the region
   * @param y Y coordinate of the top-left corner of the region
   * @param width Width of the region
   * @param height Height of the region
   */
  markDirty(x: number, y: number, width?: number, height?: number): void;
  
  /**
   * Get the dirty regions of the layer
   */
  getDirtyRegions(): { x: number, y: number, width: number, height: number }[];
  
  /**
   * Clear the dirty regions of the layer
   */
  clearDirtyRegions(): void;
}
