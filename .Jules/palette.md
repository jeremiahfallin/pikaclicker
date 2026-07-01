## 2024-11-20 - Destructive Action Confirmations
**Learning:** Destructive UI actions requiring a double-click/second-click pattern (like releasing a Pokémon) need explicit visual and screen-reader feedback for the confirmation step. Users may not realize the first click activated a confirmation state.
**Action:** Always update both the visible text (e.g., "Confirm") and `aria-label` (e.g., "Confirm release of [Item]") on secondary-click confirmations to ensure clarity and accessibility, coupling this dynamic logic to the exact same state flag used for the visual text swap.
