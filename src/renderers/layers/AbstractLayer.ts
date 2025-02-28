/**
 * Abstract Layer class for the rendering system
 * 
 * This class implements common functionality for rendering layers.
 */

import { Layer } from "./Layer";

export abstract class AbstractLayer implements Layer {
  protected zIndex: number;
  protected visible: boolean;
  protected dirtyRegions: { x: number, y: number, width: number, height: number }[] = [];
  
  constructor(zIndex: number) {
    this.zIndex = zIndex;
    this.visible = true;
  }
  
  /**
   * Abstract method to render the layer
   * Must be implemented by subclasses
   */
  abstract render(ctx: CanvasRenderingContext2D): void;
  
  /**
   * Update the layer state
   * Can be overridden by subclasses
   */
  update(deltaTime: number): void {
    // Default implementation does nothing
  }
  
  /**
   * Get the z-index of the layer
   */
  getZIndex(): number {
    return this.zIndex;
  }
  
  /**
   * Check if the layer is visible
   */
  isVisible(): boolean {
    return this.visible;
  }
  
  /**
   * Set the visibility of the layer
   */
  setVisible(visible: boolean): void {
    this.visible = visible;
  }
  
  /**
   * Mark a region of the layer as dirty
   */
  markDirty(x: number, y: number, width: number = 1, height: number = 1): void {
    this.dirtyRegions.push({ x, y, width, height });
  }
  
  /**
   * Get the dirty regions of the layer
   */
  getDirtyRegions(): { x: number, y: number, width: number, height: number }[] {
    return this.dirtyRegions;
  }
  
  /**
   * Clear the dirty regions of the layer
   */
  clearDirtyRegions(): void {
    this.dirtyRegions = [];
  }
  
  /**
   * Merge overlapping dirty regions to optimize rendering
   * This is an optimization that can be called before rendering
   */
  protected mergeOverlappingDirtyRegions(): void {
    if (this.dirtyRegions.length <= 1) return;
    
    let i = 0;
    while (i < this.dirtyRegions.length) {
      let merged = false;
      
      for (let j = i + 1; j < this.dirtyRegions.length; j++) {
        const region1 = this.dirtyRegions[i];
        const region2 = this.dirtyRegions[j];
        
        // Check if regions overlap
        if (this.regionsOverlap(region1, region2)) {
          // Merge regions
          const mergedRegion = this.mergeRegions(region1, region2);
          this.dirtyRegions[i] = mergedRegion;
          this.dirtyRegions.splice(j, 1);
          merged = true;
          break;
        }
      }
      
      if (!merged) {
        i++;
      }
    }
  }
  
  /**
   * Check if two regions overlap
   */
  private regionsOverlap(
    region1: { x: number, y: number, width: number, height: number },
    region2: { x: number, y: number, width: number, height: number }
  ): boolean {
    return !(
      region1.x + region1.width <= region2.x ||
      region2.x + region2.width <= region1.x ||
      region1.y + region1.height <= region2.y ||
      region2.y + region2.height <= region1.y
    );
  }
  
  /**
   * Merge two regions into a single region that contains both
   */
  private mergeRegions(
    region1: { x: number, y: number, width: number, height: number },
    region2: { x: number, y: number, width: number, height: number }
  ): { x: number, y: number, width: number, height: number } {
    const x = Math.min(region1.x, region2.x);
    const y = Math.min(region1.y, region2.y);
    const width = Math.max(region1.x + region1.width, region2.x + region2.width) - x;
    const height = Math.max(region1.y + region1.height, region2.y + region2.height) - y;
    
    return { x, y, width, height };
  }
}
