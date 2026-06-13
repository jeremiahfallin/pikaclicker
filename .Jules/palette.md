## 2024-06-13 - Explicit Confirmation for Destructive Actions
**Learning:** Secondary-click confirmations (like the Release button in the Bank) fail accessibility and general UX when the button text remains unchanged, as users (and screen readers) are given no context that a confirmation is pending.
**Action:** Always dynamically couple the visible text and `aria-label` to the exact state flag (e.g., `uuid === release`) used to color-code or verify the confirmation, changing it to explicitly state the action being confirmed (e.g., "Confirm release").
