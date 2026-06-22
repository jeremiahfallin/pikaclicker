## 2024-06-22 - Destructive Action Confirmation
**Learning:** For destructive actions like releasing a Pokemon, relying solely on a secondary click with only a color change is unclear. Screen reader users and visual users need explicit context about what action they are confirming.
**Action:** Update the visible text and aria-label of confirmation buttons to explicitly state the action being confirmed (e.g. 'Confirm release of [Item]') using the same state flag that triggers the confirmation mode.
