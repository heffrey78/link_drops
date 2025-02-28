import { GameBoard } from './gameBoard';
import { TerrainType, Position, KeyboardControls } from './types';
import { Piece, PIECES } from './piece';

// Game constants
const BOARD_WIDTH: number = 10;
const BOARD_HEIGHT: number = 15;

// Game state
let gamePhase: 'BUILDING' | 'ADVENTURE' = 'BUILDING';
let board: GameBoard = new GameBoard(BOARD_WIDTH, BOARD_HEIGHT);
let score: number = 0;
let linesCompleted: number = 0;
let hazardsCount: number = 0;
let currentPiece: Piece | null = null;
let currentPiecePosition: Position = { x: 0, y: 0 };
let playerPosition: Position = { x: 0, y: 0 };
let enemies: Position[] = [];
let treasures: (Position & { value: number })[] = [];

// DOM Elements
const gameBoardElement: HTMLElement = document.getElementById('game-board')!;
const currentPieceDisplay: HTMLElement = document.getElementById('current-piece')!;
const phaseIndicator: HTMLElement = document.getElementById('phase-indicator')!;
const linesCountElement: HTMLElement = document.getElementById('lines-count')!;
const hazardsCountElement: HTMLElement = document.getElementById('hazards-count')!;
const scoreElement: HTMLElement = document.getElementById('score')!;
const infoPanel: HTMLElement = document.getElementById('info-panel')!;

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

// Add keyboard event listener
document.addEventListener('keydown', handleKeyDown);

// Initialize the game
initializeGame();

function initializeGame(): void {
    createBoard();
    generatePiece();
    updateBoard();
}

function createBoard(): void {
    gameBoardElement.innerHTML = '';
    for (let y = 0; y < BOARD_HEIGHT; y++) {
        for (let x = 0; x < BOARD_WIDTH; x++) {
            const cell: HTMLDivElement = document.createElement('div');
            cell.classList.add('cell', 'empty');
            cell.dataset.x = x.toString();
            cell.dataset.y = y.toString();
            gameBoardElement.appendChild(cell);
        }
    }
}

function generatePiece(): void {
    const randomPiece = PIECES[Math.floor(Math.random() * PIECES.length)];
    currentPiece = new Piece(randomPiece, Math.floor((BOARD_WIDTH - randomPiece.shape[0].length) / 2), 0);
    currentPiecePosition = { x: currentPiece.position.x, y: currentPiece.position.y };
    displayCurrentPiece();
}

function displayCurrentPiece(): void {
  if (!currentPiece) return;

  currentPieceDisplay.innerHTML = '';
  currentPieceDisplay.style.gridTemplateColumns = `repeat(${currentPiece.shape[0].length}, 20px)`;
  currentPieceDisplay.style.gridTemplateRows = `repeat(${currentPiece.shape.length}, 20px)`;

  for (let y = 0; y < currentPiece.shape.length; y++) {
    for (let x = 0; x < currentPiece.shape[y].length; x++) {
      const cell: HTMLDivElement = document.createElement('div');
      cell.classList.add('piece-cell');

      if (currentPiece.shape[y][x] !== 0) {
        const terrainType: TerrainType = currentPiece.shape[y][x] as TerrainType;
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

function updateBoard(): void {
    const cells: NodeListOf<HTMLElement> = gameBoardElement.querySelectorAll('.cell');

    cells.forEach(cell => {
        const x: number = parseInt(cell.dataset.x!);
        const y: number = parseInt(cell.dataset.y!);

        // Reset class
        cell.className = 'cell';

        // Check if current position has a piece
        if (gamePhase === 'BUILDING' && currentPiece &&
            y >= currentPiecePosition.y &&
            y < currentPiecePosition.y + currentPiece.shape.length &&
            x >= currentPiecePosition.x &&
            x < currentPiecePosition.x + currentPiece.shape[0].length) {

            const pieceX: number = x - currentPiecePosition.x;
            const pieceY: number = y - currentPiecePosition.y;

            if (currentPiece.shape[pieceY][pieceX] !== 0) {
                cell.classList.add(getTerrainClass(currentPiece.shape[pieceY][pieceX] as TerrainType));
            } else {
                cell.classList.add(getTerrainClass(board.getCell(x, y) ?? TerrainType.EMPTY));
            }
        } else {
            // Add player in adventure mode
            if (gamePhase === 'ADVENTURE' && x === playerPosition.x && y === playerPosition.y) {
                cell.classList.add('player');
            }
            // Add enemies
            else if (gamePhase === 'ADVENTURE' && enemies.some(e => e.x === x && e.y === y)) {
                cell.classList.add('enemy');
            }
            // Add treasures
            else if (gamePhase === 'ADVENTURE' && treasures.some(t => t.x === x && t.y === y)) {
                cell.classList.add('treasure');
            }
            // Show board terrain
            else {
                cell.classList.add(getTerrainClass(board.getCell(x, y) ?? TerrainType.EMPTY));
            }
        }
    });
}

function rotatePiece() {
    if (gamePhase !== 'BUILDING' || !currentPiece) return;
    const originalShape = currentPiece.shape;
    currentPiece.rotate();

    // Check if rotation is valid
    if (!isValidMove(currentPiece, currentPiecePosition)) {
        currentPiece.shape = originalShape; //revert
    }
    displayCurrentPiece();
    updateBoard();
}

function movePieceLeft() {
    if (gamePhase === 'BUILDING' && currentPiece) {
        const newPosition: Position = { ...currentPiecePosition, x: currentPiecePosition.x - 1 };
        if (isValidMove(currentPiece, newPosition)) {
            currentPiecePosition = newPosition;
            updateBoard();
        }
    } else if (gamePhase === 'ADVENTURE') {
        movePlayer(-1, 0);
    }
}

function movePieceRight() {
    if (gamePhase === 'BUILDING' && currentPiece) {
        const newPosition: Position = { ...currentPiecePosition, x: currentPiecePosition.x + 1 };
        if (isValidMove(currentPiece, newPosition)) {
            currentPiecePosition = newPosition;
            updateBoard();
        }
    } else if (gamePhase === 'ADVENTURE') {
        movePlayer(1, 0);
    }
}

function movePieceDown() {
    if (gamePhase === 'BUILDING' && currentPiece) {
        const newPosition: Position = { ...currentPiecePosition, y: currentPiecePosition.y + 1 };
        if (isValidMove(currentPiece, newPosition)) {
            currentPiecePosition = newPosition;
            updateBoard();
        } else {
            placePiece();
        }
    } else if (gamePhase === 'ADVENTURE') {
        movePlayer(0, 1);
    }
}

function dropPiece() {
    if (gamePhase !== 'BUILDING' || !currentPiece) return;

    while (isValidMove(currentPiece, { ...currentPiecePosition, y: currentPiecePosition.y + 1 })) {
        currentPiecePosition.y++;
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
  if (!currentPiece) return;
    // Add the piece to the board
    for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
            if (currentPiece.shape[y][x] !== 0) {
                const boardX = currentPiecePosition.x + x;
                const boardY = currentPiecePosition.y + y;

                if (board.isPositionValid(boardX, boardY)) {
                    board.setCell(boardX, boardY, currentPiece.terrainType);
                }
            }
        }
    }

    // Check for completed lines and convert to path
    const completedLines = board.checkCompletedLines();
    if(completedLines.length > 0){
        board.convertCompletedLinesToPath(completedLines);
        linesCompleted += completedLines.length;
        score += completedLines.length * 100;
        linesCountElement.textContent = linesCompleted.toString();
        scoreElement.textContent = score.toString();
    }

    // Identify hazards (gaps)
    board.identifyHazards();
    hazardsCount = board.grid.flat().filter((cell: TerrainType) => cell === TerrainType.HAZARD).length; // Count hazards
    hazardsCountElement.textContent = hazardsCount.toString(); // Update display

    // Generate new piece
    generatePiece();

    // Update the board
    updateBoard();

    // Check if game is over (building phase)
    if (currentPiece && !isValidMove(currentPiece, currentPiecePosition)) {
        alert("Building phase complete! The top is filled.");
        switchPhase();
    }
}

function switchPhase() {
    if (gamePhase === 'BUILDING') {
        gamePhase = 'ADVENTURE';
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
        gamePhase = 'BUILDING';
        phaseIndicator.textContent = 'BUILDING PHASE';

        board = new GameBoard(BOARD_WIDTH, BOARD_HEIGHT);
        score = 0;
        linesCompleted = 0;
        hazardsCount = 0;

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

    updateBoard();
}

function prepareAdventurePhase() {
    // Place player at the top
    for (let x = 0; x < BOARD_WIDTH; x++) {
      if (board.getCell(x, 0) !== TerrainType.HAZARD && board.getCell(x, 0) !== TerrainType.EMPTY) {
        playerPosition = { x, y: 0 };
        break;
      }
    }

    // If no valid position found, place player at a random position
    if (!playerPosition.x && !playerPosition.y) {
        do {
            playerPosition = {
                x: Math.floor(Math.random() * BOARD_WIDTH),
                y: Math.floor(Math.random() * 3)
            };
        } while (board.getCell(playerPosition.x, playerPosition.y) === TerrainType.HAZARD);
    }

    // Create enemies from hazards
    enemies = [];
    for (let y = 0; y < BOARD_HEIGHT; y++) {
        for (let x = 0; x < BOARD_WIDTH; x++) {
            if (board.getCell(x,y) === TerrainType.HAZARD) {
                enemies.push({ x, y });
            }
        }
    }

    // Create treasures on paths and near completed lines
    treasures = [];
    for (let y = 0; y < BOARD_HEIGHT; y++) {
        for (let x = 0; x < BOARD_WIDTH; x++) {
            if (board.getCell(x,y) === TerrainType.PATH && Math.random() < 0.3) {
                treasures.push({ x, y, value: 50 });
            }
        }
    }

    // Create safe havens (rest points) near the bottom
    for (let y = BOARD_HEIGHT - 5; y < BOARD_HEIGHT; y++) {
        for (let x = 0; x < BOARD_WIDTH; x++) {
            if (board.getCell(x,y) === TerrainType.PATH && Math.random() < 0.2) {
                board.setCell(x,y, TerrainType.SAFE_HAVEN);
            }
        }
    }
}

function movePlayer(dx: number, dy: number) {
    const newX = playerPosition.x + dx;
    const newY = playerPosition.y + dy;

    // Check boundaries
    if (!board.isPositionValid(newX, newY)) {
        return;
    }

    // Check if valid position (not empty or hazard)
    if (board.getCell(newX, newY) === TerrainType.EMPTY || board.getCell(newX, newY) === TerrainType.HAZARD) {
        return;
    }

    // Check for enemy collision
    const enemyAtPosition = enemies.findIndex(e => e.x === newX && e.y === newY);
    if (enemyAtPosition !== -1) {
        alert("You encountered an enemy! Lost 50 points.");
        score -= 50;
        if (score < 0) score = 0;
        scoreElement.textContent = score.toString();
        return;
    }

    // Check for treasure collection
    const treasureIndex = treasures.findIndex(t => t.x === newX && t.y === newY);
    if (treasureIndex !== -1) {
        const treasure = treasures[treasureIndex];
        score += treasure.value;
        scoreElement.textContent = score.toString();
        treasures.splice(treasureIndex, 1);
        alert(`Found a treasure! +${treasure.value} points`);
    }

    // Move player
    playerPosition = { x: newX, y: newY };

    // Check for safe haven
    if (board.getCell(newX, newY) === TerrainType.SAFE_HAVEN) {
        alert("You found a safe haven! +100 points");
        score += 100;
        scoreElement.textContent = score.toString();
    }

    // Check if reached bottom
    if (newY === BOARD_HEIGHT - 1) {
        alert(`Congratulations! You completed the adventure with ${score} points!`);
        switchPhase();
        return;
    }

    updateBoard();

    // Move enemies (simple AI)
    setTimeout(() => {
        moveEnemies();
    }, 300);
}

function moveEnemies() {
    enemies.forEach(enemy => {
        // Simple enemy AI - move toward player with some randomness
        const dx = playerPosition.x - enemy.x;
        const dy = playerPosition.y - enemy.y;

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
            if (newX === playerPosition.x && newY === playerPosition.y) {
                alert("An enemy caught you! Lost 100 points.");
                score -= 100;
                if (score < 0) score = 0;
                scoreElement.textContent = score.toString();
            } else {
                enemy.x = newX;
                enemy.y = newY;
            }
        }
    });

    updateBoard();
}
