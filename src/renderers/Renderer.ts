import { GameBoard } from '../gameBoard';
import { Piece } from '../piece';
import { Position, GameState } from '../types';
import { Animation } from '../animations/Animation';
import { AssetType } from '../assets/AssetLoader';

export interface Renderer {
  /**
   * Initialize the renderer
   * @param boardWidth The width of the board in cells
   * @param boardHeight The height of the board in cells
   */
  initialize(boardWidth: number, boardHeight: number): void;
  
  /**
   * Clear the canvas
   */
  clear(): void;
  
  /**
   * Render the board
   * @param board The game board
   */
  renderBoard(board: GameBoard): void;
  
  /**
   * Render a piece
   * @param piece The piece to render
   * @param position The position of the piece
   */
  renderPiece(piece: Piece, position: Position): void;
  
  /**
   * Render entities
   * @param player The player position
   * @param enemies The enemy positions
   * @param treasures The treasure positions
   */
  renderEntities(player: Position, enemies: Position[], treasures: (Position & { value: number })[]): void;
  
  /**
   * Render UI elements
   * @param gameState The game state
   */
  renderUI(gameState: GameState): void;
  
  /**
   * Resize the canvas to fit the window
   */
  resize(): void;
  
  /**
   * Convert client coordinates to canvas coordinates
   * @param clientX The client X coordinate
   * @param clientY The client Y coordinate
   * @returns The canvas coordinates
   */
  getCanvasPosition(clientX: number, clientY: number): Position;
  
  /**
   * Add an animation to the renderer
   * @param animation The animation to add
   */
  addAnimation(animation: Animation): void;
  
  /**
   * Update all layers
   * @param deltaTime Time elapsed since the last update in milliseconds
   */
  update(deltaTime: number): void;
  
  /**
   * Render all layers
   */
  render(): void;
  
  /**
   * Toggle performance metrics display
   */
  togglePerformanceMetrics(): void;
  
  /**
   * Mark a region of the canvas as dirty (needs redrawing)
   * @param x X coordinate of the top-left corner of the region
   * @param y Y coordinate of the top-left corner of the region
   * @param width Width of the region
   * @param height Height of the region
   */
  markDirty(x: number, y: number, width?: number, height?: number): void;
  
  /**
   * Load assets and show a loading screen
   * @param assets An array of assets to load
   * @returns A promise that resolves when all assets are loaded
   */
  loadAssets(assets: { key: string, url: string, type: AssetType }[]): Promise<void>;
}
