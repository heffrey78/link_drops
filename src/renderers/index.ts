/**
 * Renderers barrel file
 * 
 * This file re-exports all the renderer components for easier imports.
 */

// Export Renderer as a type to avoid runtime errors with interfaces
export type { Renderer } from './Renderer';
export { CanvasRenderer } from './CanvasRenderer';
