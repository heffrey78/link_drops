import { Animation } from './Animation';

export class LineCompleteAnimation implements Animation {
  private y: number;
  private width: number;
  private cellSize: number;
  private progress: number = 0;
  private duration: number = 500; // ms
  
  constructor(y: number, width: number, cellSize: number) {
    this.y = y;
    this.width = width;
    this.cellSize = cellSize;
  }
  
  update(deltaTime: number): boolean {
    this.progress += deltaTime;
    return this.progress >= this.duration;
  }
  
  render(ctx: CanvasRenderingContext2D): void {
    const alpha = Math.min(1, this.progress / this.duration);
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.fillRect(0, this.y * this.cellSize, this.width * this.cellSize, this.cellSize);
  }
}
