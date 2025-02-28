/**
 * Action Creators for the state management system
 * 
 * This file defines functions that create action objects to be dispatched to the store.
 * Using TypeScript ensures type safety for all actions.
 */

import { Position, TerrainType, GamePhase } from '../types';
import { Piece } from '../piece';
import * as ActionTypes from './actionTypes';

// Game Phase Actions
export const switchPhase = (phase: GamePhase) => ({
  type: ActionTypes.SWITCH_PHASE,
  payload: { phase }
});

// Piece Actions
export const generatePiece = (piece: Piece) => ({
  type: ActionTypes.GENERATE_PIECE,
  payload: { piece }
});

export const movePiece = (position: Position) => ({
  type: ActionTypes.MOVE_PIECE,
  payload: { position }
});

export const rotatePiece = () => ({
  type: ActionTypes.ROTATE_PIECE
});

export const placePiece = () => ({
  type: ActionTypes.PLACE_PIECE
});

// Board Actions
export const completeLines = (lines: number[]) => ({
  type: ActionTypes.COMPLETE_LINES,
  payload: { lines }
});

export const identifyHazards = () => ({
  type: ActionTypes.IDENTIFY_HAZARDS
});

// Player Actions
export const movePlayer = (dx: number, dy: number) => ({
  type: ActionTypes.MOVE_PLAYER,
  payload: { dx, dy }
});

export const collectTreasure = (treasureIndex: number, value: number) => ({
  type: ActionTypes.COLLECT_TREASURE,
  payload: { treasureIndex, value }
});

export const encounterEnemy = (enemyIndex: number, penalty: number) => ({
  type: ActionTypes.ENCOUNTER_ENEMY,
  payload: { enemyIndex, penalty }
});

export const reachSafeHaven = (bonus: number) => ({
  type: ActionTypes.REACH_SAFE_HAVEN,
  payload: { bonus }
});

// Enemy Actions
export const moveEnemies = () => ({
  type: ActionTypes.MOVE_ENEMIES
});

// Score Actions
export const updateScore = (points: number) => ({
  type: ActionTypes.UPDATE_SCORE,
  payload: { points }
});

// Message Actions
export const addMessage = (
  text: string, 
  type: 'info' | 'success' | 'warning' | 'danger' = 'info'
) => ({
  type: ActionTypes.ADD_MESSAGE,
  payload: { text, type, timestamp: Date.now() }
});

// Game Setup Actions
export const initializeGame = () => ({
  type: ActionTypes.INITIALIZE_GAME
});

export const prepareAdventure = () => ({
  type: ActionTypes.PREPARE_ADVENTURE
});

// Action Point System (for Phase 1.1)
export const consumeActionPoints = (amount: number, terrainType: TerrainType) => ({
  type: ActionTypes.CONSUME_ACTION_POINTS,
  payload: { amount, terrainType }
});

export const regenerateActionPoints = (amount: number) => ({
  type: ActionTypes.REGENERATE_ACTION_POINTS,
  payload: { amount }
});

export const endTurn = () => ({
  type: ActionTypes.END_TURN
});
