import { GameBoard } from '../gameBoard';
import { Piece } from '../piece';
import { Position, TerrainType, GameState } from '../types';
import { Renderer } from 'renderers/Renderer'
import { 
  Layer,
  BoardLayer, 
  EntityLayer, 
  PieceLayer, 
  AnimationLayer, 
  UILayer,
  LoadingLayer
} from './layers';
import { Animation } from '../animations/Animation';
import { assetLoader, AssetType } from '../assets/AssetLoader';

export class CanvasRenderer implements Renderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private cellSize: number;
  private boardWidth: number;
  private boardHeight: number;
  private layers: Layer[] = [];
  private boardLayer: BoardLayer;
  public entityLayer: EntityLayer; // Changed to public for external access
  private pieceLayer: PieceLayer;
  private animationLayer: AnimationLayer;
  private uiLayer: UILayer;
  private lastFrameTime: number = 0;
  private frameRate: number = 0;
  private frameCount: number = 0;
  private frameCountStart: number = 0;
  private showPerformanceMetrics: boolean = false;
  
  constructor(canvasId: string) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;
    this.cellSize = 30;
    this.boardWidth = 0;
    this.boardHeight = 0;
    
    // Handle window resize
    window.addEventListener('resize', () => this.resize());
    
    // Create layers
    this.boardLayer = new BoardLayer(new GameBoard(0, 0), this.cellSize, 0);
    this.entityLayer = new EntityLayer(this.cellSize, { x: 0, y: 0 }, [], [], 1);
    this.pieceLayer = new PieceLayer(this.cellSize, null, { x: 0, y: 0 }, 2);
    this.animationLayer = new AnimationLayer(3);
    this.uiLayer = new UILayer({
      phase: 'BUILDING',
      score: 0,
      linesCompleted: 0,
      hazardsCount: 0,
      currentPiece: null,
      currentPiecePosition: { x: 0, y: 0 },
      playerPosition: { x: 0, y: 0 },
      enemies: [],
      treasures: [],
      messages: [],
      actionPoints: 3,
      maxActionPoints: 3
    }, this.cellSize, 0, 0, 4);
    
    // Add layers to the renderer
    this.layers = [
      this.boardLayer,
      this.entityLayer,
      this.pieceLayer,
      this.animationLayer,
      this.uiLayer
    ];
    
    // Sort layers by z-index
    this.sortLayers();
  }
  
  /**
   * Initialize the renderer
   * @param boardWidth The width of the board in cells
   * @param boardHeight The height of the board in cells
   */
  initialize(boardWidth: number, boardHeight: number): void {
    this.boardWidth = boardWidth;
    this.boardHeight = boardHeight;
    this.resize();
    
    // Update layers with new dimensions
    this.boardLayer.updateBoard(new GameBoard(boardWidth, boardHeight));
    this.uiLayer.updateCellSize(this.cellSize);
  }
  
  /**
   * Resize the canvas to fit the window
   */
  resize(): void {
    // Calculate the maximum cell size that fits the window
    const maxWidth = window.innerWidth * 0.8;
    const maxHeight = window.innerHeight * 0.8;
    
    const maxCellWidth = maxWidth / this.boardWidth;
    const maxCellHeight = maxHeight / this.boardHeight;
    
    this.cellSize = Math.min(maxCellWidth, maxCellHeight, 30);
    
    this.canvas.width = this.boardWidth * this.cellSize;
    this.canvas.height = this.boardHeight * this.cellSize + 20; // Extra space for UI
    
    // Update layers with new cell size
    this.layers.forEach(layer => {
      if ('updateCellSize' in layer) {
        (layer as any).updateCellSize(this.cellSize);
      }
    });
  }
  
  /**
   * Mark a region of the canvas as dirty (needs redrawing)
   * @param x X coordinate of the top-left corner of the region
   * @param y Y coordinate of the top-left corner of the region
   * @param width Width of the region
   * @param height Height of the region
   */
  markDirty(x: number, y: number, width: number = 1, height: number = 1): void {
    // Mark the region as dirty in all layers
    this.layers.forEach(layer => {
      layer.markDirty(x, y, width, height);
    });
  }
  
  /**
   * Clear the canvas
   */
  clear(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  
  /**
   * Render the board
   * @param board The game board
   */
  renderBoard(board: GameBoard): void {
    this.boardLayer.updateBoard(board);
  }
  
  /**
   * Render a piece
   * @param piece The piece to render
   * @param position The position of the piece
   */
  renderPiece(piece: Piece, position: Position): void {
    this.pieceLayer.updatePiece(piece, position);
  }
  
  /**
   * Render entities
   * @param player The player position
   * @param enemies The enemy positions
   * @param treasures The treasure positions
   */
  renderEntities(
    player: Position,
    enemies: Position[],
    treasures: (Position & { value: number })[]
  ): void {
    this.entityLayer.updatePlayerPosition(player);
    this.entityLayer.updateEnemies(enemies);
    this.entityLayer.updateTreasures(treasures);
  }
  
  /**
   * Render UI elements
   * @param gameState The game state
   */
  renderUI(gameState: GameState): void {
    this.uiLayer.updateGameState(gameState);
  }
  
  /**
   * Add an animation to the renderer
   * @param animation The animation to add
   */
  addAnimation(animation: Animation): void {
    this.animationLayer.addAnimation(animation);
  }
  
  /**
   * Update and render all layers
   * @param deltaTime Time elapsed since the last update in milliseconds
   */
  update(deltaTime: number): void {
    // Update all layers
    this.layers.forEach(layer => {
      layer.update(deltaTime);
    });
    
    // Update performance metrics
    this.updatePerformanceMetrics(deltaTime);
  }
  
  /**
   * Render all layers
   */
  render(): void {
    // Clear the canvas
    this.clear();
    
    // Render all layers
    this.layers.forEach(layer => {
      layer.render(this.ctx);
    });
    
    // Render performance metrics if enabled
    if (this.showPerformanceMetrics) {
      this.renderPerformanceMetrics();
    }
  }
  
  /**
   * Toggle performance metrics display
   */
  togglePerformanceMetrics(): void {
    this.showPerformanceMetrics = !this.showPerformanceMetrics;
  }
  
  /**
   * Update performance metrics
   * @param deltaTime Time elapsed since the last update in milliseconds
   */
  private updatePerformanceMetrics(deltaTime: number): void {
    const now = performance.now();
    
    // Update frame count
    this.frameCount++;
    
    // Calculate frame rate every second
    if (now - this.frameCountStart >= 1000) {
      this.frameRate = this.frameCount / ((now - this.frameCountStart) / 1000);
      this.frameCount = 0;
      this.frameCountStart = now;
    }
    
    // Store last frame time
    this.lastFrameTime = deltaTime;
  }
  
  /**
   * Render performance metrics
   */
  private renderPerformanceMetrics(): void {
    const metrics = [
      `FPS: ${Math.round(this.frameRate)}`,
      `Frame Time: ${Math.round(this.lastFrameTime)}ms`,
      `Animations: ${this.animationLayer.getAnimationCount()}`
    ];
    
    this.ctx.save();
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(10, 10, 200, 70);
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = '12px monospace';
    this.ctx.textAlign = 'left';
    this.ctx.textBaseline = 'top';
    
    metrics.forEach((metric, index) => {
      this.ctx.fillText(metric, 20, 20 + index * 16);
    });
    
    this.ctx.restore();
  }
  
  /**
   * Sort layers by z-index
   */
  private sortLayers(): void {
    this.layers.sort((a, b) => a.getZIndex() - b.getZIndex());
  }
  
  /**
   * Convert client coordinates to canvas coordinates
   * @param clientX The client X coordinate
   * @param clientY The client Y coordinate
   * @returns The canvas coordinates
   */
  getCanvasPosition(clientX: number, clientY: number): Position {
    const rect = this.canvas.getBoundingClientRect();
    const x = Math.floor((clientX - rect.left) / this.cellSize);
    const y = Math.floor((clientY - rect.top) / this.cellSize);
    return { x, y };
  }
  
  /**
   * Load assets and show a loading screen
   * @param assets An array of assets to load
   * @returns A promise that resolves when all assets are loaded
   */
  loadAssets(assets: { key: string, url: string, type: AssetType }[]): Promise<void> {
    return new Promise<void>((resolve) => {
      // Create a loading layer
      const loadingLayer = new LoadingLayer(
        this.canvas.width,
        this.canvas.height,
        () => {
          // Remove the loading layer when loading is complete
          const index = this.layers.indexOf(loadingLayer);
          if (index !== -1) {
            this.layers.splice(index, 1);
          }
          resolve();
        },
        10 // High z-index to ensure it's on top
      );
      
      // Add the loading layer to the renderer
      this.layers.push(loadingLayer);
      
      // Sort layers by z-index
      this.sortLayers();
      
      // Load the assets
      assetLoader.loadAssets(assets);
    });
  }
}
