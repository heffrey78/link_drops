/**
 * State Store for the game
 * 
 * This file implements a Redux-like state store with immutable updates.
 * It provides methods for dispatching actions, subscribing to state changes,
 * and getting the current state.
 */

import { GameState } from '../types';
import { rootReducer } from './reducers';

export interface Action {
  type: string;
  payload?: any;
}

export interface GameStateStore {
  dispatch(action: Action): void;
  getState(): GameState;
  subscribe(listener: () => void): () => void;
}

export class Store implements GameStateStore {
  private state: GameState;
  private listeners: (() => void)[] = [];
  private isDispatching: boolean = false;

  constructor(initialState: GameState) {
    this.state = initialState;
  }

  /**
   * Get the current state
   * @returns The current state
   */
  getState(): GameState {
    if (this.isDispatching) {
      throw new Error('You may not call store.getState() while the reducer is executing.');
    }
    return this.state;
  }

  /**
   * Dispatch an action to update the state
   * @param action The action to dispatch
   */
  dispatch(action: Action): void {
    if (this.isDispatching) {
      throw new Error('Reducers may not dispatch actions.');
    }

    try {
      this.isDispatching = true;
      // Apply the action to the state using the reducer
      this.state = rootReducer(this.state, action);
    } finally {
      this.isDispatching = false;
    }

    // Notify all listeners
    this.listeners.forEach(listener => listener());
  }

  /**
   * Subscribe to state changes
   * @param listener A callback function to be called when the state changes
   * @returns A function to unsubscribe the listener
   */
  subscribe(listener: () => void): () => void {
    if (typeof listener !== 'function') {
      throw new Error('Expected the listener to be a function.');
    }

    this.listeners.push(listener);

    // Return a function to unsubscribe
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }
}

// Create and export a singleton store instance
let store: GameStateStore | null = null;

export function createStore(initialState: GameState): GameStateStore {
  if (!store) {
    store = new Store(initialState);
  }
  return store;
}

export function getStore(): GameStateStore {
  if (!store) {
    throw new Error('Store has not been initialized. Call createStore first.');
  }
  return store;
}
