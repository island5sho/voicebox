/**
 * Voicebox - A text-to-speech utility library
 * Main entry point
 */

import { TTSEngine, TTSOptions, TTSResult } from './types';
import { EngineRegistry } from './registry';

export { TTSEngine, TTSOptions, TTSResult } from './types';
export { EngineRegistry } from './registry';

/**
 * Main Voicebox class providing a unified interface for text-to-speech engines.
 */
export class Voicebox {
  private registry: EngineRegistry;
  private activeEngine: TTSEngine | null = null;

  constructor() {
    this.registry = new EngineRegistry();
  }

  /**
   * Register a TTS engine with the given name.
   * @param name - Unique identifier for the engine
   * @param engine - The TTS engine implementation
   */
  registerEngine(name: string, engine: TTSEngine): void {
    this.registry.register(name, engine);
  }

  /**
   * Set the active TTS engine by name.
   * @param name - Name of a previously registered engine
   */
  useEngine(name: string): void {
    const engine = this.registry.get(name);
    if (!engine) {
      throw new Error(`Engine "${name}" is not registered.`);
    }
    this.activeEngine = engine;
  }

  /**
   * Speak the given text using the active engine.
   * @param text - Text to synthesize
   * @param options - Optional TTS configuration
   * @returns A promise resolving to the TTS result
   */
  async speak(text: string, options?: TTSOptions): Promise<TTSResult> {
    if (!this.activeEngine) {
      throw new Error('No active TTS engine. Call useEngine() first.');
    }
    // Trim whitespace from input text to avoid silent failures or unexpected pauses
    const sanitized = text.trim();
    if (!sanitized) {
      throw new Error('speak() called with empty or whitespace-only text.');
    }
    return this.activeEngine.synthesize(sanitized, options ?? {});
  }

  /**
   * List all registered engine names.
   */
  listEngines(): string[] {
    return this.registry.list();
  }

  /**
   * Check whether an engine is registered under the given name.
   * @param name - Engine name to check
   */
  hasEngine(name: string): boolean {
    return this.registry.has(name);
  }
}

// Convenience singleton export
export const voicebox = new Voicebox();
export default voicebox;
