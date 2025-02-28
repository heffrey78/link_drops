/**
 * Action Types for the state management system
 * 
 * This file defines all the action types that can be dispatched to the store.
 * Using string literals with TypeScript ensures type safety across the application.
 */

// Game Phase Actions
export const SWITCH_PHASE = 'SWITCH_PHASE';

// Piece Actions
export const GENERATE_PIECE = 'GENERATE_PIECE';
export const MOVE_PIECE = 'MOVE_PIECE';
export const ROTATE_PIECE = 'ROTATE_PIECE';
export const PLACE_PIECE = 'PLACE_PIECE';

// Board Actions
export const COMPLETE_LINES = 'COMPLETE_LINES';
export const IDENTIFY_HAZARDS = 'IDENTIFY_HAZARDS';

// Player Actions
export const MOVE_PLAYER = 'MOVE_PLAYER';
export const COLLECT_TREASURE = 'COLLECT_TREASURE';
export const ENCOUNTER_ENEMY = 'ENCOUNTER_ENEMY';
export const REACH_SAFE_HAVEN = 'REACH_SAFE_HAVEN';

// Enemy Actions
export const MOVE_ENEMIES = 'MOVE_ENEMIES';

// Score Actions
export const UPDATE_SCORE = 'UPDATE_SCORE';

// Message Actions
export const ADD_MESSAGE = 'ADD_MESSAGE';

// Game Setup Actions
export const INITIALIZE_GAME = 'INITIALIZE_GAME';
export const PREPARE_ADVENTURE = 'PREPARE_ADVENTURE';

// Action Point System (for Phase 1.1)
export const CONSUME_ACTION_POINTS = 'CONSUME_ACTION_POINTS';
export const REGENERATE_ACTION_POINTS = 'REGENERATE_ACTION_POINTS';
export const END_TURN = 'END_TURN';
