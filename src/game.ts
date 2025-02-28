import { GameBoard } from './gameBoard';
import { TerrainType, Position, KeyboardControls, GameState } from './types';
import { Piece, PIECES } from './piece';
import { CanvasRenderer } from './renderers/CanvasRenderer';
import { setupTouchControls } from './touchControls';
import { LineCompleteAnimation } from './animations/LineCompleteAnimation';
import { Animation } from './animations/Animation';
import './index.css';

// Game constants
const BOARD_WIDTH: number = 10;
const BOARD_HEIGHT: number = 15;

// Game state
const gameState: GameState = {
  phase: 'BUILDING',
  score: 0,
  linesCompleted: 0,
  hazardsCount: 0,
  currentPiece: null,
  currentPiecePosition: { x: 0, y: 0 },
  playerPosition: { x: 0, y: 0 },
  enemies: [],
  treasures: [],
  messages: []
};

let board: GameBoard = new GameBoard(BOARD_WIDTH, BOARD_HEIGHT);
let renderer: CanvasRenderer;
let lastTime: number = 0;
let dropCounter: number = 0;
let dropInterval: number = 1000; // ms
let animations: Animation[] = [];

// DOM Elements for UI
const phaseIndicator: HTMLElement = document.getElementById('phase-indicator')!;
const linesCountElement: HTMLElement = document.getElementById('lines-count')!;
const hazardsCountElement: HTMLElement = document.getElementById('hazards-count')!;
const scoreElement: HTMLElement = document.getElementById('score')!;
const infoPanel: HTMLElement = document.getElementById('info-panel')!;
const currentPieceDisplay: HTMLElement = document.getElementById('current-piece')!;
const logMessagesElement: HTMLElement = document.getElementById('log-messages')!;

// Function to add a message to the game log
function addLogMessage(text: string, type: 'info' | 'success' | 'warning' | 'danger' = 'info'): void {
  gameState.messages.push({
    text,
    timestamp: Date.now(),
    type
  });
  
  // Keep only the last 20 messages
  if (gameState.messages.length > 20) {
    gameState.messages.shift();
  }
  
  updateStatusLog();
}

// Function to update the status log display
function updateStatusLog(): void {
  logMessagesElement.innerHTML = '';
  
  gameState.messages.forEach(message => {
    const messageElement = document.createElement('div');
    messageElement.classList.add('log-message', message.type || 'info');
    
    const timestamp = new Date(message.timestamp);
    const timeString = `${timestamp.getHours().toString().padStart(2, '0')}:${timestamp.getMinutes().toString().padStart(2, '0')}:${timestamp.getSeconds().toString().padStart(2, '0')}`;
    
    messageElement.innerHTML = `<span class="timestamp">${timeString}</span> ${message.text}`;
    logMessagesElement.appendChild(messageElement);
  });
  
  // Auto-scroll to the bottom
  logMessagesElement.scrollTop = logMessagesElement.scrollHeight;
}

// Keyboard controls configuration
const keyboardControls: KeyboardControls = {
  rotate: ['ArrowUp', 'w', 'W'],
  moveLeft: ['ArrowLeft', 'a', 'A'],
  moveRight: ['ArrowRight', 'd', 'D'],
  moveDown: ['ArrowDown', 's', 'S'],
  drop: [' '], // Space
  switchPhase: ['Enter']
};

// Keyboard event handler
function handleKeyDown(event: KeyboardEvent): void {
  // Prevent default actions for game keys
  if (Object.values(keyboardControls).flat().includes(event.key)) {
    event.preventDefault();
  }

  if (keyboardControls.rotate.includes(event.key)) {
    rotatePiece();
  } else if (keyboardControls.moveLeft.includes(event.key)) {
    movePieceLeft();
  } else if (keyboardControls.moveRight.includes(event.key)) {
    movePieceRight();
  } else if (keyboardControls.moveDown.includes(event.key)) {
    movePieceDown();
  } else if (keyboardControls.drop.includes(event.key)) {
    dropPiece();
  } else if (keyboardControls.switchPhase.includes(event.key)) {
    switchPhase();
  }
}

// Initialize the game
function initializeGame(): void {
  // Initialize renderer
  renderer = new CanvasRenderer('game-canvas');
  renderer.initialize(BOARD_WIDTH, BOARD_HEIGHT);
  
  // Set up game state
  board = new GameBoard(BOARD_WIDTH, BOARD_HEIGHT);
  gameState.phase = 'BUILDING';
  gameState.score = 0;
  gameState.linesCompleted = 0;
  gameState.hazardsCount = 0;
  
  // Generate first piece
  generatePiece();
  
  // Set up event listeners
  document.addEventListener('keydown', handleKeyDown);
  
  // Add touch controls for mobile
  setupTouchControls(
    document.getElementById('game-canvas') as HTMLCanvasElement,
    movePieceLeft,
    movePieceRight,
    movePieceDown,
    rotatePiece,
    dropPiece,
    switchPhase
  );
  
  // Display initial instructions
  infoPanel.innerHTML = `
    <p>Building Phase! Create your world by placing tetris blocks.</p>
    <p>Completed lines become paths, and isolated gaps become hazards.</p>
    <p>Your building choices will affect your adventure!</p>
  `;
  
  // Start game loop
  requestAnimationFrame(gameLoop);
}

function gameLoop(timestamp: number): void {
  const deltaTime = timestamp - lastTime;
  lastTime = timestamp;
  
  // Update game state
  update(deltaTime);
  
  // Render game
  render();
  
  // Continue loop
  requestAnimationFrame(gameLoop);
}

function update(deltaTime: number): void {
  // Update animations
  animations = animations.filter(animation => !animation.update(deltaTime));
  
  if (gameState.phase === 'BUILDING' && gameState.currentPiece) {
    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
      movePieceDown();
      dropCounter = 0;
    }
  }
}

function render(): void {
  renderer.clear();
  
  // Render the board
  renderer.renderBoard(board);
  
  // Render current piece in building phase
  if (gameState.phase === 'BUILDING' && gameState.currentPiece) {
    renderer.renderPiece(gameState.currentPiece, gameState.currentPiecePosition);
  }
  
  // Render entities in adventure phase
  if (gameState.phase === 'ADVENTURE') {
    renderer.renderEntities(
      gameState.playerPosition,
      gameState.enemies,
      gameState.treasures
    );
  }
  
  // Render animations
  const ctx = (document.getElementById('game-canvas') as HTMLCanvasElement).getContext('2d')!;
  animations.forEach(animation => animation.render(ctx));
}

function generatePiece(): void {
  const randomPiece = PIECES[Math.floor(Math.random() * PIECES.length)];
  gameState.currentPiece = new Piece(randomPiece, Math.floor((BOARD_WIDTH - randomPiece.shape[0].length) / 2), 0);
  gameState.currentPiecePosition = { 
    x: gameState.currentPiece.position.x, 
    y: gameState.currentPiece.position.y 
  };
  displayCurrentPiece();
}

function displayCurrentPiece(): void {
  if (!gameState.currentPiece) return;

  currentPieceDisplay.innerHTML = '';
  currentPieceDisplay.style.gridTemplateColumns = `repeat(${gameState.currentPiece.shape[0].length}, 20px)`;
  currentPieceDisplay.style.gridTemplateRows = `repeat(${gameState.currentPiece.shape.length}, 20px)`;

  for (let y = 0; y < gameState.currentPiece.shape.length; y++) {
    for (let x = 0; x < gameState.currentPiece.shape[y].length; x++) {
      const cell: HTMLDivElement = document.createElement('div');
      cell.classList.add('piece-cell');

      if (gameState.currentPiece.shape[y][x] !== 0) {
        const terrainType: TerrainType = gameState.currentPiece.shape[y][x] as TerrainType;
        cell.classList.add(getTerrainClass(terrainType));
      } else {
        cell.classList.add('empty');
      }

      currentPieceDisplay.appendChild(cell);
    }
  }
}

function getTerrainClass(terrainType: TerrainType): string {
  switch (terrainType) {
    case TerrainType.FOREST: return 'forest';
    case TerrainType.MOUNTAIN: return 'mountain';
    case TerrainType.WATER: return 'water';
    case TerrainType.PATH: return 'path';
    case TerrainType.HAZARD: return 'hazard';
    case TerrainType.PLAYER: return 'player';
    case TerrainType.ENEMY: return 'enemy';
    case TerrainType.TREASURE: return 'treasure';
    case TerrainType.SAFE_HAVEN: return 'safe-haven';
    default: return 'empty';
  }
}

function rotatePiece() {
  if (gameState.phase !== 'BUILDING' || !gameState.currentPiece) return;
  const originalShape = gameState.currentPiece.shape;
  gameState.currentPiece.rotate();

  // Check if rotation is valid
  if (!isValidMove(gameState.currentPiece, gameState.currentPiecePosition)) {
    gameState.currentPiece.shape = originalShape; //revert
  }
  displayCurrentPiece();
}

function movePieceLeft() {
  if (gameState.phase === 'BUILDING' && gameState.currentPiece) {
    const newPosition: Position = { 
      ...gameState.currentPiecePosition, 
      x: gameState.currentPiecePosition.x - 1 
    };
    if (isValidMove(gameState.currentPiece, newPosition)) {
      gameState.currentPiecePosition = newPosition;
    }
  } else if (gameState.phase === 'ADVENTURE') {
    movePlayer(-1, 0);
  }
}

function movePieceRight() {
  if (gameState.phase === 'BUILDING' && gameState.currentPiece) {
    const newPosition: Position = { 
      ...gameState.currentPiecePosition, 
      x: gameState.currentPiecePosition.x + 1 
    };
    if (isValidMove(gameState.currentPiece, newPosition)) {
      gameState.currentPiecePosition = newPosition;
    }
  } else if (gameState.phase === 'ADVENTURE') {
    movePlayer(1, 0);
  }
}

function movePieceDown() {
  if (gameState.phase === 'BUILDING' && gameState.currentPiece) {
    const newPosition: Position = { 
      ...gameState.currentPiecePosition, 
      y: gameState.currentPiecePosition.y + 1 
    };
    if (isValidMove(gameState.currentPiece, newPosition)) {
      gameState.currentPiecePosition = newPosition;
    } else {
      placePiece();
    }
  } else if (gameState.phase === 'ADVENTURE') {
    movePlayer(0, 1);
  }
}

function dropPiece() {
  if (gameState.phase !== 'BUILDING' || !gameState.currentPiece) return;

  while (isValidMove(gameState.currentPiece, { 
    ...gameState.currentPiecePosition, 
    y: gameState.currentPiecePosition.y + 1 
  })) {
    gameState.currentPiecePosition.y++;
  }
  placePiece();
}

function isValidMove(piece: Piece, position: Position): boolean {
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x] !== 0) {
        const boardX = position.x + x;
        const boardY = position.y + y;

        if (!board.isPositionValid(boardX, boardY)) {
          return false;
        }

        if (board.getCell(boardX, boardY) !== TerrainType.EMPTY) {
          return false;
        }
      }
    }
  }
  return true;
}

function placePiece() {
  if (!gameState.currentPiece) return;
  
  // Add the piece to the board
  for (let y = 0; y < gameState.currentPiece.shape.length; y++) {
    for (let x = 0; x < gameState.currentPiece.shape[y].length; x++) {
      if (gameState.currentPiece.shape[y][x] !== 0) {
        const boardX = gameState.currentPiecePosition.x + x;
        const boardY = gameState.currentPiecePosition.y + y;

        if (board.isPositionValid(boardX, boardY)) {
          board.setCell(boardX, boardY, gameState.currentPiece.terrainType);
        }
      }
    }
  }

  // Check for completed lines and convert to path
  const completedLines = board.checkCompletedLines();
  if (completedLines.length > 0) {
    board.convertCompletedLinesToPath(completedLines);
    gameState.linesCompleted += completedLines.length;
    gameState.score += completedLines.length * 100;
    linesCountElement.textContent = gameState.linesCompleted.toString();
    scoreElement.textContent = gameState.score.toString();
    
    // Add line completion animations
    const cellSize = 30; // This should match the cell size in the renderer
    completedLines.forEach(line => {
      animations.push(new LineCompleteAnimation(line, BOARD_WIDTH, cellSize));
    });
  }

  // Identify hazards (gaps)
  board.identifyHazards();
  gameState.hazardsCount = board.grid.flat().filter((cell: TerrainType) => cell === TerrainType.HAZARD).length;
  hazardsCountElement.textContent = gameState.hazardsCount.toString();

  // Generate new piece
  generatePiece();

  // Check if game is over (building phase)
  if (gameState.currentPiece && !isValidMove(gameState.currentPiece, gameState.currentPiecePosition)) {
    addLogMessage("Building phase complete! The top is filled.", "info");
    switchPhase();
  }
}

function switchPhase() {
  if (gameState.phase === 'BUILDING') {
    gameState.phase = 'ADVENTURE';
    phaseIndicator.textContent = 'ADVENTURE PHASE';

    // Convert the world for adventure mode
    prepareAdventurePhase();

    // Display instructions
    infoPanel.innerHTML = `
      <p>Adventure Phase! Explore the world you've built.</p>
      <p>Use arrow keys or WASD to move. Collect treasures (★) and avoid enemies (◆).</p>
      <p>Paths (yellow) are safe to travel. Hazards spawned enemies!</p>
    `;
  } else {
    // Reset the game
    gameState.phase = 'BUILDING';
    phaseIndicator.textContent = 'BUILDING PHASE';

    board = new GameBoard(BOARD_WIDTH, BOARD_HEIGHT);
    gameState.score = 0;
    gameState.linesCompleted = 0;
    gameState.hazardsCount = 0;
    gameState.enemies = [];
    gameState.treasures = [];

    linesCountElement.textContent = '0';
    hazardsCountElement.textContent = '0';
    scoreElement.textContent = '0';

    generatePiece();

    // Reset instructions
    infoPanel.innerHTML = `
      <p>Building Phase! Create your world by placing tetris blocks.</p>
      <p>Completed lines become paths, and isolated gaps become hazards.</p>
      <p>Your building choices will affect your adventure!</p>
    `;
  }
}

function prepareAdventurePhase() {
  // Place player at the top
  for (let x = 0; x < BOARD_WIDTH; x++) {
    if (board.getCell(x, 0) !== TerrainType.HAZARD && board.getCell(x, 0) !== TerrainType.EMPTY) {
      gameState.playerPosition = { x, y: 0 };
      break;
    }
  }

  // If no valid position found, place player at a random position
  if (!gameState.playerPosition.x && !gameState.playerPosition.y) {
    do {
      gameState.playerPosition = {
        x: Math.floor(Math.random() * BOARD_WIDTH),
        y: Math.floor(Math.random() * 3)
      };
    } while (board.getCell(gameState.playerPosition.x, gameState.playerPosition.y) === TerrainType.HAZARD);
  }

  // Create enemies from hazards
  gameState.enemies = [];
  for (let y = 0; y < BOARD_HEIGHT; y++) {
    for (let x = 0; x < BOARD_WIDTH; x++) {
      if (board.getCell(x, y) === TerrainType.HAZARD) {
        gameState.enemies.push({ x, y });
      }
    }
  }

  // Create treasures on paths and near completed lines
  gameState.treasures = [];
  for (let y = 0; y < BOARD_HEIGHT; y++) {
    for (let x = 0; x < BOARD_WIDTH; x++) {
      if (board.getCell(x, y) === TerrainType.PATH && Math.random() < 0.3) {
        gameState.treasures.push({ x, y, value: 50 });
      }
    }
  }

  // Create safe havens (rest points) near the bottom
  for (let y = BOARD_HEIGHT - 5; y < BOARD_HEIGHT; y++) {
    for (let x = 0; x < BOARD_WIDTH; x++) {
      if (board.getCell(x, y) === TerrainType.PATH && Math.random() < 0.2) {
        board.setCell(x, y, TerrainType.SAFE_HAVEN);
      }
    }
  }
}

function movePlayer(dx: number, dy: number) {
  const newX = gameState.playerPosition.x + dx;
  const newY = gameState.playerPosition.y + dy;

  // Check boundaries
  if (!board.isPositionValid(newX, newY)) {
    return;
  }

  // Check if valid position (not empty or hazard)
  if (board.getCell(newX, newY) === TerrainType.EMPTY || board.getCell(newX, newY) === TerrainType.HAZARD) {
    return;
  }

  // Check for enemy collision
  const enemyAtPosition = gameState.enemies.findIndex(e => e.x === newX && e.y === newY);
  if (enemyAtPosition !== -1) {
    addLogMessage("You encountered an enemy! Lost 50 points.", "danger");
    gameState.score -= 50;
    if (gameState.score < 0) gameState.score = 0;
    scoreElement.textContent = gameState.score.toString();
    return;
  }

  // Check for treasure collection
  const treasureIndex = gameState.treasures.findIndex(t => t.x === newX && t.y === newY);
  if (treasureIndex !== -1) {
    const treasure = gameState.treasures[treasureIndex];
    gameState.score += treasure.value;
    scoreElement.textContent = gameState.score.toString();
    gameState.treasures.splice(treasureIndex, 1);
    addLogMessage(`Found a treasure! +${treasure.value} points`, "success");
  }

  // Move player
  gameState.playerPosition = { x: newX, y: newY };

  // Check for safe haven
  if (board.getCell(newX, newY) === TerrainType.SAFE_HAVEN) {
    addLogMessage("You found a safe haven! +100 points", "success");
    gameState.score += 100;
    scoreElement.textContent = gameState.score.toString();
  }

  // Check if reached bottom
  if (newY === BOARD_HEIGHT - 1) {
    addLogMessage(`Congratulations! You completed the adventure with ${gameState.score} points!`, "success");
    switchPhase();
    return;
  }

  // Move enemies (simple AI)
  setTimeout(() => {
    moveEnemies();
  }, 300);
}

function moveEnemies() {
  gameState.enemies.forEach(enemy => {
    // Simple enemy AI - move toward player with some randomness
    const dx = gameState.playerPosition.x - enemy.x;
    const dy = gameState.playerPosition.y - enemy.y;

    let moveX = 0;
    let moveY = 0;

    // Determine direction with some randomness
    if (Math.random() < 0.7) {
      moveX = dx !== 0 ? (dx > 0 ? 1 : -1) : 0;
    } else {
      moveY = dy !== 0 ? (dy > 0 ? 1 : -1) : 0;
    }

    // Only move if the position is valid
    const newX = enemy.x + moveX;
    const newY = enemy.y + moveY;

    if (board.isPositionValid(newX, newY) &&
      board.getCell(newX, newY) !== TerrainType.EMPTY &&
      board.getCell(newX, newY) !== TerrainType.HAZARD) {

      // Check for player collision
      if (newX === gameState.playerPosition.x && newY === gameState.playerPosition.y) {
        addLogMessage("An enemy caught you! Lost 100 points.", "danger");
        gameState.score -= 100;
        if (gameState.score < 0) gameState.score = 0;
        scoreElement.textContent = gameState.score.toString();
      } else {
        enemy.x = newX;
        enemy.y = newY;
      }
    }
  });
}

// Start the game
document.addEventListener('DOMContentLoaded', initializeGame);
