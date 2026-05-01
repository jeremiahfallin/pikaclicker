## 2024-05-01 - Destructive Actions Confirmation
**Learning:** For destructive UI actions like releasing an item or Pokémon, relying solely on a secondary click (e.g. turning the button red) without changing the visible text or aria-label can be confusing and inaccessible. Users need explicit confirmation of the action they are about to take.
**Action:** Always update the visible text and `aria-label` of the confirmation button to explicitly state the action being confirmed (e.g., 'Confirm release of [Item]') to ensure clarity and accessibility.
