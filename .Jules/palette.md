## 2026-06-01 - Dynamic destructive action confirmations
**Learning:** Relying solely on color change or secondary clicks for destructive UI actions is unclear and inaccessible. Explicit text changes and ARIA labels are required to clearly communicate the action being confirmed.
**Action:** For two-step destructive actions, dynamically update the button text and aria-label to explicitly state the action being confirmed (e.g., 'Confirm release of [Item]') using the exact same state flag that manages the visual confirmation.
