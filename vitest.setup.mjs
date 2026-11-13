import { beforeEach } from "vitest";

// The game store saves to localStorage. Tests run in Node, so give them an
// in-memory stand-in that starts empty for every test.
class MemoryStorage {
  #items = new Map();
  getItem(key) {
    return this.#items.has(key) ? this.#items.get(key) : null;
  }
  setItem(key, value) {
    this.#items.set(key, String(value));
  }
  removeItem(key) {
    this.#items.delete(key);
  }
  clear() {
    this.#items.clear();
  }
}

globalThis.localStorage = new MemoryStorage();

beforeEach(() => {
  globalThis.localStorage.clear();
});
