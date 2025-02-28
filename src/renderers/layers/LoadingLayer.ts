/**
 * Loading Layer for displaying loading progress
 * 
 * This layer is responsible for rendering a loading screen while assets are being loaded.
 */

import { AbstractLayer } from './AbstractLayer';
import { assetLoader } from '../../assets/AssetLoader';

export class LoadingLayer extends AbstractLayer {
  private width: number;
  private height: number;
  private progress: number = 0;
  private targetProgress: number = 0;
  private progressSpeed: number = 0.005; // Speed of progress animation
  private isLoading: boolean = true;
  private onLoadComplete: () => void;
  
  constructor(
    width: number,
    height: number,
    onLoadComplete: () => void,
    zIndex: number = 10 // High z-index to ensure it's on top
  ) {
    super(zIndex);
    this.width = width;
    this.height = height;
    this.onLoadComplete = onLoadComplete;
  }
  
  /**
   * Update the loading progress
   * @param deltaTime Time elapsed since the last update in milliseconds
   */
  update(deltaTime: number): void {
    // Get the actual loading progress from the asset loader
    this.targetProgress = assetLoader.getProgress();
    
    // Animate the progress bar
    if (this.progress < this.targetProgress) {
      this.progress += this.progressSpeed * (deltaTime / 16.67); // Normalize to 60fps
      
      if (this.progress > this.targetProgress) {
        this.progress = this.targetProgress;
      }
    }
    
    // Check if loading is complete
    if (this.isLoading && this.progress >= 1) {
      this.isLoading = false;
      setTimeout(() => {
        this.onLoadComplete();
      }, 500); // Wait a bit before calling the callback
    }
  }
  
  /**
   * Render the loading screen
   * @param ctx The canvas rendering context
   */
  render(ctx: CanvasRenderingContext2D): void {
    if (!this.visible || !this.isLoading) return;
    
    // Draw background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, this.width, this.height);
    
    // Draw loading text
    ctx.fillStyle = '#ffffff';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Loading...', this.width / 2, this.height / 2 - 40);
    
    // Draw progress bar background
    const barWidth = this.width * 0.6;
    const barHeight = 20;
    const barX = (this.width - barWidth) / 2;
    const barY = this.height / 2;
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fillRect(barX, barY, barWidth, barHeight);
    
    // Draw progress bar
    ctx.fillStyle = '#4cc9f0';
    ctx.fillRect(barX, barY, barWidth * this.progress, barHeight);
    
    // Draw progress percentage
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Arial';
    ctx.fillText(`${Math.round(this.progress * 100)}%`, this.width / 2, barY + barHeight + 20);
  }
  
  /**
   * Reset the loading layer
   */
  reset(): void {
    this.progress = 0;
    this.targetProgress = 0;
    this.isLoading = true;
  }
  
  /**
   * Update the dimensions of the loading layer
   * @param width The new width
   * @param height The new height
   */
  updateDimensions(width: number, height: number): void {
    this.width = width;
    this.height = height;
    this.markDirty(0, 0, width, height);
  }
}
