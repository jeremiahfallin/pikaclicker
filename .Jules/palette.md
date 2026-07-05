## 2025-02-12 - Explicit Confirmation for Destructive Action
**Learning:** For destructive UI actions (like releasing an item or Pokémon), relying solely on a secondary click with only a color change is insufficient for accessibility and clear UX.
**Action:** Always update the visible text and `aria-label` of the confirmation button to explicitly state the action being confirmed (e.g., "Confirm release of [Item]") to ensure clarity and accessibility, rather than relying solely on a secondary click. Couple this dynamic logic to the exact same state flag used for the visual text swap.
