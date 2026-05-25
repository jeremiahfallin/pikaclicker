## 2026-05-25 - Destructive UI Actions Clarification
**Learning:** For destructive actions (like releasing an item or Pokémon), relying solely on a secondary click for confirmation can be confusing if the button text doesn't change to indicate the new state.
**Action:** Always update the visible text and `aria-label` of the confirmation button to explicitly state the action being confirmed (e.g., 'Confirm release of [Item]') to ensure clarity and accessibility.
