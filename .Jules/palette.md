## 2026-06-26 - Better destructive action confirmation
**Learning:** Destructive actions using a two-click state pattern need to explicitly update their text and ARIA label to communicate the confirmation context, rather than relying solely on color changes (which are not accessible to screen readers).
**Action:** When creating two-step confirmation buttons, dynamically switch the text to 'Confirm' and update the `aria-label` to include the action and subject (e.g., 'Confirm release of Pikachu') using the same state flag.
