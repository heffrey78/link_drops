/**
 * State Management System
 * 
 * This file exports all the components of the state management system.
 */

// Export action types
export * from './actionTypes';

// Export action creators
export * from './actions';

// Export store
export { 
  Action, 
  GameStateStore, 
  createStore, 
  getStore 
} from './store';

// Export event system
export { 
  default as eventEmitter, 
  EventEmitter, 
  EventCallback, 
  GameEvents 
} from './events';

// Export reducers (for testing)
export { rootReducer } from './reducers';
