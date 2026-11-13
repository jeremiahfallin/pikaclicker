// Tells the battle screen about each hit as it happens, so it can show the
// damage and shake the Pokémon that was hit. Hits are moments, not game
// state: nothing here is saved.

const listeners = new Set();

/**
 * @typedef {Object} Hit
 * @property {"player"|"enemy"} target - Whose Pokémon was hit.
 * @property {number} damage - The damage the attack did.
 * @property {boolean} critical - Whether it was a critical hit.
 * @property {"click"|"turn"} source - A click, or a turn on the battle clock.
 */

/**
 * Calls `listener` with each hit until the returned function is called.
 * @param {(hit: Hit) => void} listener
 * @returns {() => void} Stops listening.
 */
export function onHit(listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** @param {Hit} hit */
export function reportHit(hit) {
  listeners.forEach((listener) => listener(hit));
}
