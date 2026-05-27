## 2024-05-27 - Dynamic Confirmation Buttons
**Learning:** For destructive actions like releasing a Pokemon, changing the button color to red isn't enough for accessibility. The `aria-label` and visible text must dynamically change to explicitly announce the confirmation action (e.g., "Confirm release of Bulbasaur") to ensure screen readers provide accurate context before the final click.
**Action:** When implementing two-step destructive actions, always couple dynamic `aria-label` and visible text changes to the same state flag used for visual/color changes.
