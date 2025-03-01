# Task List for Link Drops

## Current Tasks: Phase 1 - Core Gameplay Foundation

### Pre-Roadmap: Refactoring & Technical Foundations (2-3 weeks)

- [x] **Implement State Management System:**
  - [x] Create immutable state store with actions/reducers pattern
  - [x] Define TypeScript interfaces for all game entities
  - [x] Implement proper event system for cross-component communication
  - [ ] Add unit tests for state management

- [x] **Enhance Rendering Architecture:**
  - [x] Refactor CanvasRenderer to support multiple layers
  - [x] Create abstraction for animations and effects
  - [x] Set up asset loading/management system
  - [x] Add performance monitoring for rendering

- [x] **Improve Game Loop:**
  - [x] Separate fixed update (physics, game logic) from render updates
  - [x] Implement proper delta time handling
  - [x] Add debug/performance monitoring tools
  - [ ] Create visualization for game loop metrics

### Phase 1.1: Terrain Mechanics & Line Completion Rework (Weeks 1-3)

- [ ] **Implement Action Points (AP) System:**
  - [ ] Create AP data structure in player state
  - [ ] Add AP UI elements with clear visual representation
  - [ ] Implement AP consumption/regeneration logic
  - [ ] Add turn-end triggers when AP is depleted

- [ ] **Refactor Terrain Types:**
  - [ ] Enhance TerrainType enum with movement costs
  - [ ] Implement varied AP costs (Path: 1, Forest: 2, Water: 3, etc.)
  - [ ] Create terrain effect system
  - [ ] Add special terrain effects (forest confuses enemies, mountains give vision bonus)

- [ ] **Modify Line Completion:**
  - [ ] Refactor line completion to maintain terrain characteristics
  - [ ] Ensure completed lines remain traversable
  - [ ] Add visual indicators for line completion
  - [ ] Implement terrain-specific line completion effects

- [ ] **Enhance Terrain UI:**
  - [ ] Create visual indicators for different terrain types
  - [ ] Implement terrain transition animations
  - [ ] Add accessibility features for terrain identification

### Phase 1.2: Board Generation & Hero Positioning (Weeks 3-4)

- [ ] **Implement Hero Spawn Prioritization:**
  - [ ] Create algorithm for spawn point detection
  - [ ] Prioritize traversable terrain for hero spawning
  - [ ] Ensure hero spawns at top of screen when possible
  - [ ] Add fallback spawn position creation if no valid positions exist

- [ ] **Improve Board Generation:**
  - [ ] Refactor board generation algorithm
  - [ ] Balance terrain distribution
  - [ ] Create difficulty-based generation parameters
  - [ ] Add seed-based generation for reproducible boards

### Phase 1.3: Tetromino & Enemy System (Weeks 5-7)

- [ ] **Create Enemy-Containing Tetromino Pieces:**
  - [ ] Implement data structure for enemy types on pieces
  - [ ] Add clear visual indicators for enemy-containing pieces
  - [ ] Create enemy type variation system
  - [ ] Balance enemy piece frequency based on score/difficulty

- [ ] **Implement Enemy Behavior:**
  - [ ] Create base enemy class with common behaviors
  - [ ] Implement different enemy types with unique behaviors
  - [ ] Add enemy state management
  - [ ] Create enemy animation system

### Phase 1.4: Movement System & Turn Flow (Weeks 7-8)

- [ ] **Implement Turn-Based Movement:**
  - [ ] Create turn state machine
  - [ ] Implement player movement with AP consumption
  - [ ] Add enemy movement patterns based on terrain
  - [ ] Create turn transition animations

- [ ] **Add Terrain Special Effect Activation:**
  - [ ] Implement effect trigger system
  - [ ] Create visual feedback for effect activation
  - [ ] Add sound effects for terrain interactions
  - [ ] Balance effect strength and duration

## Technical Implementation Details

### State Management Architecture

```typescript
// Example of State Management with immutable updates
interface GameStateStore {
  dispatch(action: GameAction): void;
  getState(): GameState;
  subscribe(listener: () => void): () => void;
}

// Example action with strong typing
interface MovePlayerAction {
  type: 'MOVE_PLAYER';
  payload: {
    x: number;
    y: number;
  };
}

// Consistent error handling
function gameReducer(state: GameState, action: GameAction): GameState {
  try {
    switch (action.type) {
      case 'MOVE_PLAYER':
        // Immutable update pattern
        return {
          ...state,
          player: {
            ...state.player,
            position: {
              x: action.payload.x,
              y: action.payload.y
            }
          }
        };
      // Other cases...
      default:
        return state;
    }
  } catch (error) {
    // Proper error handling
    if (error instanceof GameLogicError) {
      // Handle domain-specific errors
      console.error(`Game logic error: ${error.message}`);
    }
    // Log and rethrow system errors
    throw error;
  }
}

// Terrain and AP system with strong typing
export enum TerrainCost {
  PATH = 1,
  FOREST = 2,
  MOUNTAIN = 3,
  WATER = 4
}

export interface PlayerState {
  position: Position;
  actionPoints: number;
  maxActionPoints: number;
  equipment: Equipment[];  // Planning for future equipment system
}

// Small, focused interfaces following single responsibility
export interface Position {
  x: number;
  y: number;
}

export interface Equipment {
  id: string;
  name: string;
  apModifier?: number;  // Optional modifier for action points
}
```

### Testing Strategy

Following the testing requirements from our engineering guidelines:

- **Unit Tests**:
  - AP calculations with different modifiers
  - Terrain effect applications
  - State management reducers
  - Enemy behavior patterns

- **Integration Tests**:
  - Turn flow and state transitions
  - Player-terrain interactions
  - Enemy-terrain interactions
  - Line completion effects

- **Performance Testing**:
  - Rendering performance with varied board sizes
  - State update performance with complex game states
  - Animation performance on different devices

- **Visual Regression Tests**:
  - UI components and animations
  - Terrain visualization
  - AP indicator rendering
  - Enemy visualization

- **Test-Driven Development**:
  - Write tests before or alongside code implementation
  - Focus on behavior, not implementation details
  - Test edge cases and error conditions

## Engineering Guidelines Applied

### Architecture Philosophy
- **Platform Thinking**: 
  - Implementing modular systems (terrain, movement, enemies) with clear boundaries
  - Establishing separation between game state and rendering
  - Creating reusable core services (state management, asset loading)
  - Planning for scalability with future phases in mind

### Code Minimalism
- **Start Simple**: 
  - Implementing minimal viable solutions first for each feature
  - Adding complexity only when proven necessary through testing
  - Challenging each additional field/method/class for necessity

- **Complexity Budget**:
  - Allocating "complexity budget" for each module
  - Justifying complexity cost for new features
  - Planning for regular complexity audits

- **Refactoring Signals**:
  - Watching for duplicate code to extract common patterns
  - Removing unused optionals and speculative features
  - Preferring composition over deep inheritance

### Development Standards
- **Type Safety**: Using strong typing throughout new implementations
- **Error Handling**: Implementing consistent error handling patterns
- **Testing Requirements**: Writing tests alongside code implementation
- **Code Quality**: Keeping functions small and focused with meaningful names

### Documentation Requirements
- **Code Documentation**: Documenting why, not what, keeping documentation close to code
- **Technical Documentation**: Updating docs/development.md with architecture decisions

### Review Standards
- **Quality Checklist**:
  - [ ] Type safety
  - [ ] Error handling
  - [ ] Test coverage
  - [ ] Documentation

### Maintenance Guidelines
- **Regular Tasks**:
  - Update dependencies
  - Remove unused code
  - Refactor complex sections
  - Review error logs
  - Update documentation

## Completed Tasks

- [x] Migrate from DOM-based to Canvas-based rendering (core implementation)
- [x] Implement basic game loop with requestAnimationFrame
- [x] Create animation system foundation
- [x] Implement state management system with actions/reducers pattern
- [x] Create layered rendering architecture with dirty rectangle tracking
- [x] Implement asset loading system with loading screen
- [x] Add performance monitoring and metrics display
- [x] Separate update and render loops with proper delta time handling

## Documentation Updates Required

- [ ] Create/update docs/development.md with architecture decisions for Phase 1
- [ ] Create/update docs/testing.md with testing strategy for new components
