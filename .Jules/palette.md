## 2024-05-05 - Explicit Confirmation for Destructive Actions
**Learning:** For destructive UI actions (like releasing a Pokemon), relying purely on secondary clicks without visual cues is a poor UX.
**Action:** Always update the visible text and `aria-label` of the confirmation button to explicitly state the action being confirmed (e.g., 'Confirm release of [Item]') to ensure clarity and accessibility.
