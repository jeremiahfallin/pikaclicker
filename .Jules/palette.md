## 2024-05-24 - Confirm Destructive Actions
**Learning:** Destructive actions like releasing a Pokemon need clear, dynamic confirmation states in both visual text and screen reader labels.
**Action:** For all destructive actions relying on secondary clicks, explicitly update the button text and `aria-label` to "Confirm [action]" coupled to the exact state flag.
