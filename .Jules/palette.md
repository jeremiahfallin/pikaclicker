## 2024-05-10 - Explicit Confirmation for Destructive Actions
**Learning:** For destructive UI actions (like releasing an item or Pokémon), relying solely on a secondary click for confirmation without updating the button's context can be confusing and inaccessible.
**Action:** Always update the visible text and `aria-label` of the confirmation button to explicitly state the action being confirmed (e.g., 'Confirm release of [Item]') to ensure clarity and accessibility.
