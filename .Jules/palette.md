## 2024-05-09 - Explicit Destructive Action Confirmations
**Learning:** Relying solely on color changes (e.g. gray to red) or a secondary click without explicit text changes is an inaccessible pattern for destructive actions like releasing an item. Screen readers and users need clear, updated text.
**Action:** For destructive actions requiring confirmation, always update the visible text and `aria-label` of the confirmation button to explicitly state the action being confirmed (e.g., 'Confirm release of [Item]') rather than just changing the color.
