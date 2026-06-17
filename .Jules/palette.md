## 2026-06-17 - Explicit Confirmations for Destructive Actions
**Learning:** Relying solely on a color change or secondary click for destructive actions (like releasing a Pokémon) is insufficient for accessibility and clarity. Screen reader users and visual users alike benefit from explicit text confirming the action.
**Action:** For two-step destructive actions, dynamically update the visible text and aria-label of the confirmation button to explicitly state the action being confirmed (e.g., 'Confirm release of [Item]') using the same state flag that manages the visual swap.
