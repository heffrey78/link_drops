import { GameBoard } from '../gameBoard';
import { Piece } from '../piece';
import { Position, GameState } from '../types';

export interface Renderer {
  initialize(boardWidth: number, boardHeight: number): void;
  clear(): void;
  renderBoard(board: GameBoard): void;
  renderPiece(piece: Piece, position: Position): void;
  renderEntities(player: Position, enemies: Position[], treasures: (Position & { value: number })[]): void;
  renderUI(gameState: GameState): void;
  resize(): void;
  getCanvasPosition(clientX: number, clientY: number): Position;
}
