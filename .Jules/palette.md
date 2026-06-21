
## 2024-05-24 - Explicit Destructive Actions
**Learning:** For destructive UI actions (like releasing an item or Pokémon), relying solely on a secondary click with unchanged text is ambiguous and lacks context for screen readers. The `aria-label` and visual text should be updated dynamically to explicitly state the action being confirmed.
**Action:** Always update the visible text and `aria-label` of the confirmation button to explicitly state the action being confirmed (e.g., 'Confirm release of [Item]') rather than just a secondary click. Couple this dynamic logic to the exact same state flag used for the visual text swap.
