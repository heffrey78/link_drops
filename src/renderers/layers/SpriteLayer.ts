import { Sprite } from '../../sprites/Sprite';
import { Layer } from './Layer';

interface SpriteInstance {
  sprite: Sprite;
  x: number;
  y: number;
  width?: number;
  height?: number;
  scale: number;
  rotation: number;
  zIndex: number;
}

export class SpriteLayer implements Layer {
  private sprites: Map<string, SpriteInstance>;
  private _isVisible: boolean;
  private canvasWidth: number;
  private canvasHeight: number;
  private _isDirty: boolean;
  private deltaTime: number;

  constructor() {
    this.sprites = new Map();
    this._isVisible = true;
    this.canvasWidth = 0;
    this.canvasHeight = 0;
    this._isDirty = true;
    this.deltaTime = 0;
  }

  update(deltaTime: number): void {
    this.deltaTime = deltaTime;
    if (!this._isVisible) return;

    for (const spriteInstance of this.sprites.values()) {
      spriteInstance.sprite.update(deltaTime);
    }
  }

  addSprite(
    id: string,
    sprite: Sprite,
    x: number,
    y: number,
    width?: number,
    height?: number,
    scale: number = 1,
    rotation: number = 0,
    zIndex: number = 0
  ): void {
    this.sprites.set(id, { sprite, x, y, width, height, scale, rotation, zIndex });
    this._isDirty = true;
  }

  getSpriteInstance(id: string): SpriteInstance | undefined {
    return this.sprites.get(id);
  }

  updateSpritePosition(id: string, x: number, y: number): void {
    const spriteInstance = this.sprites.get(id);
    if (spriteInstance) {
      spriteInstance.x = x;
      spriteInstance.y = y;
      this._isDirty = true;
    }
  }

  updateSprite(id: string, updates: Partial<SpriteInstance>): void {
    const spriteInstance = this.sprites.get(id);
    if (spriteInstance) {
      Object.assign(spriteInstance, updates);
      this._isDirty = true;
    }
  }

  removeSprite(id: string): void {
    this.sprites.delete(id);
    this._isDirty = true;
  }

  render(ctx: CanvasRenderingContext2D): void {
    if (!this._isVisible) return;

    // Sort sprites by zIndex
    const sortedSprites = Array.from(this.sprites.values()).sort(
      (a, b) => a.zIndex - b.zIndex
    );

    for (const spriteInstance of sortedSprites) {
      spriteInstance.sprite.draw(
        ctx,
        spriteInstance.x * this.canvasWidth, // Convert grid coordinates to canvas coordinates
        spriteInstance.y * this.canvasHeight,
        spriteInstance.width,
        spriteInstance.height,
        spriteInstance.scale,
        spriteInstance.rotation
      );
    }
    this._isDirty = false;
  }

  setVisible(visible: boolean): void {
    this._isVisible = visible;
    this._isDirty = true;
  }

  resize(width: number, height: number): void {
    this.canvasWidth = width;
    this.canvasHeight = height;
    this._isDirty = true;
  }

  clear() {
    this.sprites.clear();
    this._isDirty = true;
  }

  isVisible(): boolean {
    return this._isVisible;
  }

  isDirty(): boolean {
    return this._isDirty;
  }
    
    markDirty(x: number, y: number, width?: number, height?: number): void {
        //
    }
    getDirtyRegions(): {
        x: number;
        y: number;
        width: number;
        height: number;
    }[] {
        return [];
    }
    clearDirtyRegions(): void {
        //
    }
    getZIndex(): number {
        return 0;
    }
}
