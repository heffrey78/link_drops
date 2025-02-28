/**
 * Layers for the rendering system
 * 
 * This file exports all the layers for the rendering system.
 */

// Export Layer type from AbstractLayer instead of directly from Layer.ts
// This avoids runtime errors since interfaces don't exist at runtime
export type { Layer } from './Layer';
export { AbstractLayer } from './AbstractLayer';
export { BoardLayer } from './BoardLayer';
export { EntityLayer } from './EntityLayer';
export { PieceLayer } from './PieceLayer';
export { AnimationLayer } from './AnimationLayer';
export { UILayer } from './UILayer';
export { LoadingLayer } from './LoadingLayer';
