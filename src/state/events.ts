/**
 * Event System for cross-component communication
 * 
 * This file implements a simple event system that allows components to subscribe to
 * and publish events without direct dependencies on each other.
 */

export type EventCallback = (...args: any[]) => void;

export class EventEmitter {
  private events: Map<string, EventCallback[]> = new Map();

  /**
   * Subscribe to an event
   * @param event The event name
   * @param callback The callback function to be called when the event is emitted
   * @returns A function to unsubscribe from the event
   */
  on(event: string, callback: EventCallback): () => void {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }

    const callbacks = this.events.get(event)!;
    callbacks.push(callback);

    // Return a function to unsubscribe
    return () => {
      const index = callbacks.indexOf(callback);
      if (index !== -1) {
        callbacks.splice(index, 1);
      }
    };
  }

  /**
   * Subscribe to an event and unsubscribe after the first emission
   * @param event The event name
   * @param callback The callback function to be called when the event is emitted
   * @returns A function to unsubscribe from the event
   */
  once(event: string, callback: EventCallback): () => void {
    const unsubscribe = this.on(event, (...args: any[]) => {
      unsubscribe();
      callback(...args);
    });
    return unsubscribe;
  }

  /**
   * Emit an event
   * @param event The event name
   * @param args The arguments to pass to the callback functions
   */
  emit(event: string, ...args: any[]): void {
    if (!this.events.has(event)) {
      return;
    }

    const callbacks = this.events.get(event)!;
    callbacks.forEach(callback => {
      try {
        callback(...args);
      } catch (error) {
        console.error(`Error in event callback for ${event}:`, error);
      }
    });
  }

  /**
   * Unsubscribe from all events with the given name
   * @param event The event name
   */
  off(event: string): void {
    this.events.delete(event);
  }

  /**
   * Unsubscribe from all events
   */
  clear(): void {
    this.events.clear();
  }
}

// Create and export a singleton event emitter instance
const eventEmitter = new EventEmitter();
export default eventEmitter;

// Define common event names as constants
export const GameEvents = {
  // Game state events
  GAME_INITIALIZED: 'game:initialized',
  GAME_OVER: 'game:over',
  PHASE_CHANGED: 'game:phaseChanged',
  
  // Piece events
  PIECE_GENERATED: 'piece:generated',
  PIECE_MOVED: 'piece:moved',
  PIECE_ROTATED: 'piece:rotated',
  PIECE_PLACED: 'piece:placed',
  
  // Board events
  LINES_COMPLETED: 'board:linesCompleted',
  HAZARDS_IDENTIFIED: 'board:hazardsIdentified',
  
  // Player events
  PLAYER_MOVED: 'player:moved',
  TREASURE_COLLECTED: 'player:treasureCollected',
  ENEMY_ENCOUNTERED: 'player:enemyEncountered',
  SAFE_HAVEN_REACHED: 'player:safeHavenReached',
  
  // Enemy events
  ENEMIES_MOVED: 'enemies:moved',
  
  // Score events
  SCORE_UPDATED: 'score:updated',
  
  // Message events
  MESSAGE_ADDED: 'message:added',
  
  // Action Points events
  AP_CONSUMED: 'ap:consumed',
  AP_REGENERATED: 'ap:regenerated',
  TURN_ENDED: 'ap:turnEnded',
  
  // Rendering events
  RENDER_REQUIRED: 'render:required',
  ANIMATION_STARTED: 'animation:started',
  ANIMATION_COMPLETED: 'animation:completed'
};
