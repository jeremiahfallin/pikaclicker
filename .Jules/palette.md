## 2024-05-18 - Explicit Destructive Actions
**Learning:** For destructive UI actions (like releasing an item or Pokémon), users and screen reader users can be easily confused if the confirmation relies solely on a secondary click (e.g. clicking "Release" again when it turns red) without context.
**Action:** Always update the visible text and `aria-label` of the confirmation button to explicitly state the action being confirmed (e.g., 'Confirm release of [Item]') to ensure clarity and accessibility.
