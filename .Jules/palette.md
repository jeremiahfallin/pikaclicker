## 2024-05-15 - Clear Two-Step Destructive Action Confirmations
**Learning:** For two-step destructive actions (like releasing an item or Pokémon), relying solely on a secondary click with the same visual text (or no clear text) can be confusing and dangerous. Users need to explicitly know what they are confirming.
**Action:** Always update the visible text (e.g., "Confirm") and add an `aria-label` (e.g., "Confirm release of [Item]") on the confirmation button. This makes the action explicitly clear both visually and accessibly.
