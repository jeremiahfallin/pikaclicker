## 2024-10-24 - Accessible Destructive Confirmations
**Learning:** When using secondary clicks or state toggles to confirm destructive actions (like releasing a Pokemon or Item), relying solely on the UI color change or generic text is inaccessible. Screen readers need explicit context of the action being confirmed.
**Action:** Always update the button's `aria-label` and visible text (e.g., 'Confirm release of [Item]') during the confirmation state rather than just showing a generic 'Confirm' or changing the button variant.
