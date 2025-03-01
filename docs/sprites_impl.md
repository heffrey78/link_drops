// Import the sprite manager
import { spriteManager } from './sprites';

// Add to the initializeGame function
async function initializeGame(): void {
  // Initialize renderer
  renderer = new CanvasRenderer('game-canvas');
  renderer.initialize(BOARD_WIDTH, BOARD_HEIGHT);
  
  // Load sprite assets
  await renderer.loadAssets([
    { key: 'player_sprite', url: 'assets/sprites/player.png', type: 'image' },
    { key: 'enemy_sprite', url: 'assets/sprites/enemy.png', type: 'image' },
    { key: 'treasure_sprite', url: 'assets/sprites/treasure.png', type: 'image' }
  ]);
  
  // Create sprites
  const playerSprite = spriteManager.createSprite('player_sprite', 32, 32, 4, 200);
  const enemySprite = spriteManager.createSprite('enemy_sprite', 32, 32, 2, 300);
  const treasureSprite = spriteManager.createSprite('treasure_sprite', 32, 32, 6, 150);
  
  // Set up game state
  board = new GameBoard(BOARD_WIDTH, BOARD_HEIGHT);
  gameState.phase = 'BUILDING';
  gameState.score = 0;
  gameState.linesCompleted = 0;
  gameState.hazardsCount = 0;
  
  // Hide entity layer during building phase
  renderer.entityLayer.setVisible(false);
  
  // Hide sprite layer during building phase
  renderer.setSpriteVisibility('player', false);
  
  // Generate first piece
  generatePiece();
  
  // Rest of initialization code...
}

// Update the prepareAdventurePhase function
function prepareAdventurePhase() {
  // First determine player position
  placePlayerAtStart();
  
  // Create player sprite at player position
  const playerSprite = spriteManager.getSprite('player_sprite');
  if (playerSprite) {
    renderer.addSprite('player', playerSprite, gameState.playerPosition.x, gameState.playerPosition.y);
  }
  
  // Create enemies from hazards
  gameState.enemies = [];
  for (let y = 0; y < BOARD_HEIGHT; y++) {
    for (let x = 0; x < BOARD_WIDTH; x++) {
      if (board.getCell(x, y) === TerrainType.HAZARD) {
        gameState.enemies.push({ x, y });
        
        // Create enemy sprite
        const enemySprite = spriteManager.getSprite('enemy_sprite');
        if (enemySprite) {
          renderer.addSprite(`enemy_${x}_${y}`, enemySprite, x, y);
        }
      }
    }
  }

  // Create treasures on paths and near completed lines
  gameState.treasures = [];
  for (let y = 0; y < BOARD_HEIGHT; y++) {
    for (let x = 0; x < BOARD_WIDTH; x++) {
      if (board.getCell(x, y) === TerrainType.PATH && Math.random() < 0.3) {
        gameState.treasures.push({ x, y, value: 50 });
        
        // Create treasure sprite
        const treasureSprite = spriteManager.getSprite('treasure_sprite');
        if (treasureSprite) {
          renderer.addSprite(`treasure_${x}_${y}`, treasureSprite, x, y);
        }
      }
    }
  }

  // Rest of the function...
}

// Update the movePlayer function
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
    
    // Remove treasure sprite
    renderer.removeSprite(`treasure_${newX}_${newY}`);
  }

  // Move player
  gameState.playerPosition = { x: newX, y: newY };
  
  // Update player sprite position
  renderer.updateSpritePosition('player', newX, newY);

  // Rest of the function...
}

// Update the moveEnemies function
function moveEnemies() {
  gameState.enemies.forEach((enemy, index) => {
    // Store old position
    const oldX = enemy.x;
    const oldY = enemy.y;
    
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
        
        // Update enemy sprite position
        renderer.updateSpritePosition(`enemy_${oldX}_${oldY}`, newX, newY);
        
        // Update sprite ID to match new position
        const enemySprite = spriteManager.getSprite('enemy_sprite');
        if (enemySprite) {
          renderer.removeSprite(`enemy_${oldX}_${oldY}`);
          renderer.addSprite(`enemy_${newX}_${newY}`, enemySprite, newX, newY);
        }
      }
    }
  });
}