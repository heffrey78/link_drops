/**
 * Reducers for the state management system
 * 
 * This file defines the reducers that handle state updates based on dispatched actions.
 * Each reducer is a pure function that takes the current state and an action, and returns a new state.
 */

import { GameState, TerrainType } from '../types';
import { Action } from './store';
import * as ActionTypes from './actionTypes';
import { GameBoard } from '../gameBoard';

/**
 * Root reducer that combines all reducers
 * @param state Current state
 * @param action Action to apply
 * @returns New state
 */
export function rootReducer(state: GameState, action: Action): GameState {
  try {
    // Apply each reducer in sequence
    let newState = { ...state };
    
    newState = gamePhaseReducer(newState, action);
    newState = pieceReducer(newState, action);
    newState = boardReducer(newState, action);
    newState = playerReducer(newState, action);
    newState = enemyReducer(newState, action);
    newState = scoreReducer(newState, action);
    newState = messageReducer(newState, action);
    newState = actionPointsReducer(newState, action);
    
    return newState;
  } catch (error) {
    // Proper error handling
    if (error instanceof Error) {
      console.error(`Error in reducer: ${error.message}`);
      // In a real app, we might want to dispatch an error action here
    }
    // Return the unchanged state on error
    return state;
  }
}

/**
 * Reducer for game phase actions
 */
function gamePhaseReducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case ActionTypes.SWITCH_PHASE:
      return {
        ...state,
        phase: action.payload.phase
      };
    case ActionTypes.INITIALIZE_GAME:
      return {
        ...state,
        phase: 'BUILDING',
        score: 0,
        linesCompleted: 0,
        hazardsCount: 0,
        enemies: [],
        treasures: [],
        actionPoints: state.maxActionPoints,
        messages: []
      };
    default:
      return state;
  }
}

/**
 * Reducer for piece actions
 */
function pieceReducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case ActionTypes.GENERATE_PIECE:
      return {
        ...state,
        currentPiece: action.payload.piece,
        currentPiecePosition: {
          x: action.payload.piece.position.x,
          y: action.payload.piece.position.y
        }
      };
    case ActionTypes.MOVE_PIECE:
      return {
        ...state,
        currentPiecePosition: action.payload.position
      };
    case ActionTypes.ROTATE_PIECE:
      if (!state.currentPiece) return state;
      
      // Create a deep copy of the current piece to avoid mutating state
      const rotatedPiece = { ...state.currentPiece };
      rotatedPiece.shape = rotatedPiece.shape.map((row: number[]) => [...row]);
      
      // Rotate the piece (this logic should match the Piece class rotate method)
      const rotated: number[][] = [];
      for (let i = 0; i < rotatedPiece.shape[0].length; i++) {
        const row: number[] = [];
        for (let j = rotatedPiece.shape.length - 1; j >= 0; j--) {
          row.push(rotatedPiece.shape[j][i]);
        }
        rotated.push(row);
      }
      rotatedPiece.shape = rotated;
      
      return {
        ...state,
        currentPiece: rotatedPiece
      };
    default:
      return state;
  }
}

/**
 * Reducer for board actions
 */
function boardReducer(state: GameState, action: Action): GameState {
  // Note: This reducer doesn't modify the board directly since it's not part of the state
  // Instead, it updates state properties related to the board
  switch (action.type) {
    case ActionTypes.COMPLETE_LINES:
      return {
        ...state,
        linesCompleted: state.linesCompleted + action.payload.lines.length
      };
    case ActionTypes.IDENTIFY_HAZARDS:
      // This would be called after the board.identifyHazards() method
      // We just update the hazardsCount here
      return state; // The actual count would be updated elsewhere
    default:
      return state;
  }
}

/**
 * Reducer for player actions
 */
function playerReducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case ActionTypes.MOVE_PLAYER:
      const { dx, dy } = action.payload;
      return {
        ...state,
        playerPosition: {
          x: state.playerPosition.x + dx,
          y: state.playerPosition.y + dy
        }
      };
    case ActionTypes.COLLECT_TREASURE:
      const { treasureIndex, value } = action.payload;
      const newTreasures = [...state.treasures];
      newTreasures.splice(treasureIndex, 1);
      
      return {
        ...state,
        treasures: newTreasures,
        score: state.score + value
      };
    case ActionTypes.ENCOUNTER_ENEMY:
      return {
        ...state,
        score: Math.max(0, state.score - action.payload.penalty)
      };
    case ActionTypes.REACH_SAFE_HAVEN:
      return {
        ...state,
        score: state.score + action.payload.bonus
      };
    default:
      return state;
  }
}

/**
 * Reducer for enemy actions
 */
function enemyReducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case ActionTypes.MOVE_ENEMIES:
      // This would be a complex operation that depends on the board state
      // For now, we'll just return the state unchanged
      return state;
    default:
      return state;
  }
}

/**
 * Reducer for score actions
 */
function scoreReducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case ActionTypes.UPDATE_SCORE:
      return {
        ...state,
        score: state.score + action.payload.points
      };
    default:
      return state;
  }
}

/**
 * Reducer for message actions
 */
function messageReducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case ActionTypes.ADD_MESSAGE:
      const newMessages = [
        ...state.messages,
        {
          text: action.payload.text,
          type: action.payload.type,
          timestamp: action.payload.timestamp
        }
      ];
      
      // Keep only the last 20 messages
      if (newMessages.length > 20) {
        newMessages.shift();
      }
      
      return {
        ...state,
        messages: newMessages
      };
    default:
      return state;
  }
}

/**
 * Reducer for action points system
 */
function actionPointsReducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case ActionTypes.CONSUME_ACTION_POINTS:
      const { amount, terrainType } = action.payload;
      // Calculate actual AP cost based on terrain
      let apCost = amount;
      
      // Apply terrain-specific modifiers
      switch (terrainType) {
        case TerrainType.PATH:
          apCost = 1;
          break;
        case TerrainType.FOREST:
          apCost = 2;
          break;
        case TerrainType.MOUNTAIN:
          apCost = 3;
          break;
        case TerrainType.WATER:
          apCost = 4;
          break;
        default:
          apCost = 1;
      }
      
      return {
        ...state,
        actionPoints: Math.max(0, state.actionPoints - apCost)
      };
    case ActionTypes.REGENERATE_ACTION_POINTS:
      return {
        ...state,
        actionPoints: Math.min(
          state.maxActionPoints,
          state.actionPoints + action.payload.amount
        )
      };
    case ActionTypes.END_TURN:
      return {
        ...state,
        actionPoints: state.maxActionPoints
      };
    default:
      return state;
  }
}
