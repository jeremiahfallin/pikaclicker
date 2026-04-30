## 2024-05-18 - Bank Pokemon Release Button Accessibility
**Learning:** For destructive UI actions (like releasing an item or Pokémon) that use a two-step confirmation flow, relying solely on a secondary click (changing color scheme) is insufficient for accessibility. Screen reader users may not know the button state changed.
**Action:** Always update the visible text and `aria-label` of the confirmation button to explicitly state the action being confirmed (e.g., 'Confirm release of [Item]') to ensure clarity and accessibility.
