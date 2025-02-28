export interface Animation {
  update(deltaTime: number): boolean; // Returns true when animation is complete
  render(ctx: CanvasRenderingContext2D): void;
}
