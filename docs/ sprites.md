# Implementing Sprite System for Link Drops

Looking at your game's architecture, I'll implement a sprite system that integrates with your existing rendering layers and asset management. This will allow you to replace the current shape-based rendering with animated sprites for your game entities.

## Implementation Guide

I've created a complete sprite system for your Link Drops game. Here's a summary of the components and how to use them:

### Key Components

1. **Sprite Class** (`src/sprites/Sprite.ts`):
   - Handles rendering and animation of sprite sheets
   - Supports frame-by-frame animation with configurable speed
   - Provides methods for playing, pausing, and resetting animations

2. **SpriteManager** (`src/sprites/SpriteManager.ts`):
   - Creates sprites from loaded images
   - Caches sprites for efficient reuse
   - Provides methods to get, create, and remove sprites

3. **SpriteLayer** (`src/renderers/layers/SpriteLayer.ts`):
   - Integrates with your existing rendering layer system
   - Manages sprite instances and their properties (position, scale, rotation)
   - Handles dirty region tracking for efficient rendering

4. **CanvasRenderer Updates**:
   - Added sprite layer to the renderer
   - Added methods for adding, updating, and removing sprites
   - Maintained compatibility with your existing rendering pipeline

### Integration Steps

1. **Asset Loading**:
   ```typescript
   await renderer.loadAssets([
     { key: 'player_sprite', url: 'assets/sprites/player.png', type: 'image' },
     { key: 'enemy_sprite', url: 'assets/sprites/enemy.png', type: 'image' },
     { key: 'treasure_sprite', url: 'assets/sprites/treasure.png', type: 'image' }
   ]);
   ```

2. **Creating Sprites**:
   ```typescript
   const playerSprite = spriteManager.createSprite(
     'player_sprite',  // Image key
     32, 32,           // Frame width and height
     4,                // Number of animation frames
     200               // Animation speed (ms per frame)
   );
   ```

3. **Adding Sprites to Renderer**:
   ```typescript
   renderer.addSprite(
     'player',        // Sprite instance ID
     playerSprite,    // Sprite object
     x, y,            // Position in grid coordinates
     width, height,   // Optional rendering dimensions
     scale,           // Optional scale factor
     rotation,        // Optional rotation in radians
     zIndex           // Optional z-index for sorting
   );
   ```

4. **Updating Sprite Positions**:
   ```typescript
   renderer.updateSpritePosition('player', newX, newY);
   ```

5. **Removing Sprites**:
   ```typescript
   renderer.removeSprite('treasure_5_3');
   ```

### Asset Organization

Create a directory structure for your sprite assets:
```
/src
  /assets
    /sprites
      player.png
      enemy.png
      treasure.png
```

### Sprite Sheet Format

The system expects sprite sheets to be arranged horizontally, with frames side by side. If your sprite sheet has multiple rows, frames are read from left to right, top to bottom.

For example, a sprite sheet with 4 frames might look like:
```
[Frame 1][Frame 2][Frame 3][Frame 4]
```

Or for multiple rows:
```
[Frame 1][Frame 2][Frame 3]
[Frame 4][Frame 5][Frame 6]
```

### Next Steps

1. **Create sprite assets** for your player, enemies, treasures, and other game elements
2. **Modify your game.ts** file to use sprites instead of the current shape rendering
3. **Test performance** with many sprites on screen and optimize if needed
4. **Consider adding features** like sprite flipping, color tinting, or more complex animations

The sprite system is designed to work with your existing code structure, so you can gradually replace the current rendering with sprites without breaking functionality.