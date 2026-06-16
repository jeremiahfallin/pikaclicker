## 2024-06-16 - Explicit Confirmation Text for Destructive Actions
**Learning:** Destructive actions (like releasing a Pokémon) that use a two-step confirmation pattern should not rely solely on color changes (e.g., changing button colorScheme to "red") to indicate state.
**Action:** Always update the button's visible text and `aria-label` to explicitly state the action being confirmed (e.g., "Confirm release of [Item]") to ensure clarity and accessibility for all users.
