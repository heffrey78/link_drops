/**
 * Animation Layer for rendering animations
 * 
 * This layer is responsible for rendering animations like line completion,
 * piece placement, etc.
 */

import { AbstractLayer } from './AbstractLayer';
import { Animation } from '../../animations/Animation';

export class AnimationLayer extends AbstractLayer {
  private animations: Animation[] = [];
  
  constructor(zIndex: number = 3) {
    super(zIndex);
  }
  
  /**
   * Add an animation to the layer
   * @param animation The animation to add
   */
  addAnimation(animation: Animation): void {
    this.animations.push(animation);
  }
  
  /**
   * Remove an animation from the layer
   * @param animation The animation to remove
   */
  removeAnimation(animation: Animation): void {
    const index = this.animations.indexOf(animation);
    if (index !== -1) {
      this.animations.splice(index, 1);
    }
  }
  
  /**
   * Clear all animations
   */
  clearAnimations(): void {
    this.animations = [];
  }
  
  /**
   * Update the animations
   * @param deltaTime Time elapsed since the last update in milliseconds
   */
  update(deltaTime: number): void {
    // Update animations and remove completed ones
    this.animations = this.animations.filter(animation => !animation.update(deltaTime));
  }
  
  /**
   * Render the animations
   * @param ctx The canvas rendering context
   */
  render(ctx: CanvasRenderingContext2D): void {
    if (!this.visible || this.animations.length === 0) return;
    
    // Render all animations
    this.animations.forEach(animation => {
      animation.render(ctx);
    });
  }
  
  /**
   * Get the number of active animations
   * @returns The number of active animations
   */
  getAnimationCount(): number {
    return this.animations.length;
  }
  
  /**
   * Check if there are any active animations
   * @returns True if there are active animations, false otherwise
   */
  hasAnimations(): boolean {
    return this.animations.length > 0;
  }
}
