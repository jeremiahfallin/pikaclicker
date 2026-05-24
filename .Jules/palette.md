## 2024-05-24 - Destructive Action Confirmation Text
**Learning:** For destructive UI actions (like releasing a Pokemon), relying solely on a secondary click without visual feedback is insufficient and prone to errors.
**Action:** Always explicitly update the visible text and `aria-label` of the confirmation button to state the action being confirmed (e.g. 'Confirm release of [Item]') to ensure clarity and accessibility.
