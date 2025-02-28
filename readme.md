# Tetris Adventure

## Description

Tetris Adventure is a unique browser-based game that blends the addictive gameplay of Tetris with an engaging adventure exploration element. The game is divided into two distinct phases: **Building Phase** and **Adventure Phase**, each offering a different style of gameplay and strategic challenges.

In the **Building Phase**, players are tasked with constructing the game world using familiar Tetris-style pieces. As pieces are placed, the goal is to complete horizontal lines. Successfully completed lines are transformed into **paths** for the adventure phase, representing safe and traversable routes. Conversely, any gaps or unfilled spaces within the Tetris grid become **hazards**, which will play a critical role in the subsequent adventure phase by spawning enemies. This phase requires strategic planning and spatial reasoning, as the layout created directly impacts the difficulty and dynamics of the adventure to come.

Transitioning to the **Adventure Phase**, players explore the world they have meticulously built. Players control a character navigating through the game board, with the primary objective of collecting **treasures** scattered throughout the environment. However, the adventure is not without peril. The **hazards** created in the building phase now come to life, spawning **enemies** that players must avoid. **Paths** provide safe passage and are often strategically placed to lead players towards treasures and **safe havens**. Safe havens offer respite and bonus points, encouraging players to explore thoroughly. The adventure phase combines elements of exploration, collection, and evasion, challenging players to utilize the world they created to their advantage.

## How to Play

### Building Phase

1.  **Objective**: Construct a game world by strategically placing falling Tetris pieces.
2.  **Controls**:
    *   **Rotate Button**: Rotates the current Tetris piece to help fit it into desired locations.
    *   **Left Button**: Moves the current piece one cell to the left, if possible.
    *   **Right Button**: Moves the current piece one cell to the right, if possible.
    *   **Down Button**: Moves the current piece down one cell.
    *   **Drop Button**: Instantly drops the current piece to the lowest possible position.
    *   **Complete Phase Button**: Ends the Building Phase and transitions the game to the Adventure Phase. This button becomes "Restart Game" in the Adventure Phase to reset and start a new game.
3.  **Gameplay**:
    *   Use the controls to manipulate falling Tetris pieces.
    *   Fill complete horizontal lines with blocks to convert them into **paths** (yellow).
    *   Unfilled spaces will become **hazards** (red) in the Adventure Phase.
    *   The game ends the building phase automatically when the Tetris grid is filled to the top, or manually by pressing "Complete Phase".

### Adventure Phase

1.  **Objective**: Explore the world, collect treasures, and reach the bottom of the game board while avoiding enemies.
2.  **Controls**:
    *   **Left Button**: Moves the player character one cell to the left, if possible.
    *   **Right Button**: Moves the player character one cell to the right, if possible.
    *   **Down Button**: Moves the player character one cell down, if possible.
3.  **Gameplay**:
    *   Navigate your player character (orange circle) using the movement buttons.
    *   Collect **treasures** (yellow star) to earn points. Each treasure is worth 50 points.
    *   Avoid **enemies** (red diamond) that spawn from **hazards**. Contact with enemies results in a point penalty.
    *   **Paths** (yellow) are safe zones for movement.
    *   **Safe havens** (cyan) found on paths provide bonus points (100 points each) when visited.
    *   Reaching the bottom row of the game board successfully completes the adventure.

## Game Elements

*   **Terrains**:
    *   **Empty (Gray)**: Initial state of the game board.
    *   **Forest (Green)**: Represented by '1' in piece templates.
    *   **Mountain (Gray)**: Represented by '2' in piece templates.
    *   **Water (Blue)**: Represented by '3' in piece templates.
    *   **Path (Yellow)**: Created from completed lines in the Building Phase, safe to traverse in Adventure Phase.
    *   **Hazard (Red)**: Gaps left in Building Phase, spawn enemies in Adventure Phase.
    *   **Safe Haven (Cyan)**: Rest points on paths, provide bonus points in Adventure Phase.
*   **Player (Orange Circle)**: The character controlled by the player in the Adventure Phase.
*   **Enemy (Red Diamond)**: Spawned from hazards, to be avoided in Adventure Phase.
*   **Treasure (Yellow Star)**: Collectibles in Adventure Phase, provide score.

## Scoring

*   **Building Phase**:
    *   Lines Completed: While lines are converted to paths, there are no direct points awarded in the building phase itself other than setting up the Adventure Phase strategically.
*   **Adventure Phase**:
    *   Treasure Collection: +50 points per treasure.
    *   Safe Haven Bonus: +100 points per safe haven.
    *   Enemy Encounter Penalty: -50 points per enemy contact in initial encounter, -100 points if enemy catches player.
    *   Adventure Completion: Completing the adventure by reaching the bottom row awards points based on the accumulated score.

## Technologies Used

*   **HTML**: Provides the structure for the game interface and elements.
*   **CSS**: Styles the game, including the board, pieces, and UI elements, to create a visually appealing experience.
*   **TypeScript**: Implements the game logic with strong typing, enhancing code quality and maintainability.
*   **Vite**: Modern build tool that provides fast development server with hot module replacement and optimized production builds.

## Architecture

The game is structured with a clear separation of concerns:

*   **Game Logic (TypeScript)**: Handles game state management, piece generation, movement, collision detection, scoring, and phase transitions.
*   **Rendering (TypeScript & DOM)**: Dynamically updates the HTML elements to reflect the current game state, rendering the game board, pieces, player, enemies, and treasures.
*   **User Interface (HTML & CSS)**: Provides the interactive elements such as buttons and information panels, styled with CSS for a user-friendly presentation.

## Development

To run the game in development mode:

```bash
npm run dev
```

To build for production:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```
