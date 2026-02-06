/**
 * External Store for @odiflo/easy-intl
 *
 * Manages translation data outside of the React tree.
 * Uses a selective update pattern to ensure high performance.
 */

type Listener = () => void;
type TranslationData = Record<string, string>;

class TranslationStore {
  /**
   * The central state mapping component IDs to their translation objects.
   * Map structure: { "src/components/Header": { "welcome": "..." } }
   */
  private state = new Map<string, TranslationData>();
  private listeners = new Set<Listener>();

  /**
   * Subscribes a component to store changes.
   * Returns an unsubscribe function.
   */
  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  /**
   * Returns a snapshot of the translation data for a specific component.
   * Useful for targeted data retrieval.
   */
  getSnapshot = (componentId: string): TranslationData | undefined => {
    return this.state.get(componentId);
  };

  /**
   * Returns the entire state Map.
   * Required for the useT hook to maintain a stable subscription to the store.
   */
  getSnapshotAll = (): Map<string, TranslationData> => {
    return this.state;
  };

  /**
   * Atomic update of component-specific translations.
   * Triggers a re-render for all subscribed components.
   */
  update(componentId: string, data: TranslationData): void {
    const current = this.state.get(componentId);

    // Performance optimization: skip update if data is identical
    if (current && JSON.stringify(current) === JSON.stringify(data)) {
      return;
    }

    this.state.set(componentId, data);
    this.notify();
  }

  /**
   * Batch update multiple components at once.
   * Efficient for initial loading of multiple translation modules.
   */
  updateBatch(batch: Record<string, TranslationData>): void {
    Object.entries(batch).forEach(([id, data]) => {
      this.state.set(id, data);
    });
    this.notify();
  }

  /**
   * Clears all translation data from the store.
   * Typically used during testing or full language switches.
   */
  clear(): void {
    this.state.clear();
    this.notify();
  }

  /**
   * Notifies all React listeners that the store has changed.
   */
  private notify(): void {
    this.listeners.forEach((listener) => listener());
  }
}

// Export a singleton instance to be used across the application
export const intlStore = new TranslationStore();
