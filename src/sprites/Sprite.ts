export class Sprite {
  private image: HTMLImageElement;
  private frameWidth: number;
  private frameHeight: number;
  private numFrames: number;
  private animationSpeed: number;
  private currentFrame: number;
  private animationTimer: number;
  private isPlaying: boolean;

  constructor(
    image: HTMLImageElement,
    frameWidth: number,
    frameHeight: number,
    numFrames: number,
    animationSpeed: number
  ) {
    this.image = image;
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    this.numFrames = numFrames;
    this.animationSpeed = animationSpeed;
    this.currentFrame = 0;
    this.animationTimer = 0;
    this.isPlaying = true;
  }

  update(deltaTime: number): void {
    if (!this.isPlaying) return;

    this.animationTimer += deltaTime;
    if (this.animationTimer >= this.animationSpeed) {
      this.currentFrame = (this.currentFrame + 1) % this.numFrames;
      this.animationTimer = 0;
    }
  }

  draw(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    width?: number,
    height?: number,
    scale: number = 1,
    rotation: number = 0
  ): void {
      const renderWidth = width ? width * scale : this.frameWidth * scale;
      const renderHeight = height ? height * scale : this.frameHeight * scale;
      const sourceX = this.currentFrame * this.frameWidth;
      const sourceY = 0;

      context.save();
      context.translate(x + renderWidth / 2, y + renderHeight / 2);
      context.rotate(rotation);
      context.drawImage(
          this.image,
          sourceX,
          sourceY,
          this.frameWidth,
          this.frameHeight,
          -renderWidth / 2,
          -renderHeight / 2,
          renderWidth,
          renderHeight
      );
      context.restore();
  }

  play(): void {
    this.isPlaying = true;
  }

  pause(): void {
    this.isPlaying = false;
  }

  reset(): void {
    this.currentFrame = 0;
    this.animationTimer = 0;
  }
}
