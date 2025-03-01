import { Sprite } from './Sprite';

export class SpriteManager {
  private sprites: Map<string, Sprite>;

  constructor() {
    this.sprites = new Map();
  }

  createSprite(
    imageKey: string,
    image: HTMLImageElement,
    frameWidth: number,
    frameHeight: number,
    numFrames: number,
    animationSpeed: number
  ): Sprite {
    const key = `${imageKey}_${frameWidth}_${frameHeight}_${numFrames}_${animationSpeed}`;
    if (this.sprites.has(key)) {
      return this.sprites.get(key)!;
    }

    const sprite = new Sprite(image, frameWidth, frameHeight, numFrames, animationSpeed);
    this.sprites.set(key, sprite);
    return sprite;
  }

  getSprite(key: string): Sprite | undefined {
    return this.sprites.get(key);
  }

    removeSprite(key: string): void {
        this.sprites.delete(key);
    }
}

export const spriteManager = new SpriteManager();
