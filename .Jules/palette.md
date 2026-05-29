## 2025-02-23 - Two-Click Release Button State Feedback
**Learning:** The destructive 'Release' action required two clicks without giving intermediate feedback, which could confuse users and lack screen reader context.
**Action:** When a button uses a two-click confirmation pattern, always swap the visible text and `aria-label` on the first click to explicitly state the action being confirmed (e.g., 'Confirm release of [Item]') to ensure clarity and accessibility, directly coupling it to the same state flag.
