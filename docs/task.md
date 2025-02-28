# Task List

## Current Tasks

- [ ] **Convert JavaScript game to TypeScript with best practices:**
    - [x] **Setup TypeScript Project:**
        - [x] Initialize a `tsconfig.json` file with recommended settings for a browser-based game:
            ```json
            {
              "compilerOptions": {
                "target": "ES6",
                "module": "ESNext",
                "moduleResolution": "Node",
                "esModuleInterop": true,
                "forceConsistentCasingInFileNames": true,
                "strict": true,
                "skipLibCheck": true,
                "outDir": "dist",
                "rootDir": "src",
                "baseUrl": ".",
                "paths": {
                  "*": ["src/*"]
                }
              },
              "include": ["src"],
              "exclude": ["node_modules"]
            }
            ```
            *(This configuration sets up ES6 target, ES modules, strict type checking, and output to the `dist` folder.  Adjust as needed.)*
        - [x] Configure build process: Use Vite for modern development and build process. Add scripts to `package.json` for easy building:
            ```json
            "scripts": {
              "dev": "vite",
              "build": "tsc && vite build",
              "preview": "vite preview"
            }
            ```
            *(This adds a `dev` script for development, a `build` script for production, and a `preview` script to preview the production build.)*
        - [ ] Setup source and output directories:
            - Create a `src` directory to hold TypeScript source files.
            - The compiled JavaScript files will be output to the `dist` directory as configured in `tsconfig.json`.
    - [ ] **Codebase Conversion - Step-by-Step:**
        - [ ] Rename `docs/code.md` content and move it to `src/game.js`.  Create `src/index.html` to load `dist/game.js`. Initially keep as `.js` for incremental conversion. Basic `index.html` example:
            ```html
            <!DOCTYPE html>
            <html>
            <head>
                <title>Tetris Adventure</title>
            </head>
            <body>
                <script src="dist/game.js"></script>
            </body>
            </html>
            ```
        - [ ] Gradually convert `.js` files to `.ts` files, starting with core game logic and data structures. Good starting points are:
            - `src/gameBoard.ts` (for board related logic)
            - `src/piece.ts` (for piece logic)
            - `src/types.ts` (for interfaces and type definitions)
        - [ ] Introduce type annotations throughout the codebase:
            - [ ] Define interfaces in `src/types.ts` for game entities:
                ```typescript
                interface Piece {
                    // ... piece properties and methods
                }
                interface Board {
                    // ... board properties and methods
                }
                // ... etc for Player, Enemy, Treasure, SafeHaven
                ```
            - [ ] Add type annotations to function parameters, return types, and variables in all `.ts` files.
        - [ ] Implement classes for game objects in `.ts` files where appropriate to improve structure and encapsulation. For example:
            - `src/piece.ts`: `class Piece { ... }`
            - `src/gameBoard.ts`: `class GameBoard { ... }`
        - [ ] Refactor code to use modules for better organization and avoid global scope pollution. Organize files in `src` directory by feature or module (e.g., `src/core`, `src/ui`, `src/entities`). Use import/export statements to manage dependencies between modules.
        - [ ] Enhance error handling: Use TypeScript's type system to prevent errors. For runtime errors, implement try-catch blocks and consider creating custom error classes for different game error scenarios.
        - [ ] Ensure code adheres to the development standards outlined in `docs/development.md`, paying attention to type safety, error handling, code quality, and documentation.
    - [ ] **Testing and Refinement:**
        - [ ] Write unit tests for core game logic in TypeScript using a testing framework like Jest (following testing guidelines in `docs/development.md`). Focus on testing functions and methods in `src/gameBoard.ts`, `src/piece.ts`, etc.
        - [ ] Run and debug the game in the browser. After building with `npm run build`, open `dist/index.html` in the browser to test. Use browser developer tools for debugging.
        - [ ] Refactor and improve code quality based on code review feedback (imagine a senior engineer is reviewing your code) and testing feedback. Focus on readability, maintainability, and performance.
    - [ ] **Documentation Update:**
        - [ ] Update `readme.md` to mention that the game is now implemented in TypeScript.
        - [ ] Add basic code documentation within the TypeScript files (using JSDoc style comments) to explain classes, interfaces, and functions.

## Completed Tasks
- [x] Read through 'docs/code.md' and create development.md and readme.md.
