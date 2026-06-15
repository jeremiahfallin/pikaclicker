## 2024-03-20 - Destructive Action Confirmation UX
**Learning:** Two-step destructive actions (like releasing an item or Pokemon) can be confusing and inaccessible if only the color changes. Screen readers and users might not realize the second click is a final confirmation.
**Action:** Always update both the visible text and the `aria-label` to explicitly state the action being confirmed (e.g. 'Confirm release of [Item]') during the confirmation step, rather than relying solely on secondary click mechanics.
