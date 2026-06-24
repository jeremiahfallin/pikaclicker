## 2024-05-24 - Dynamic Confirmation Buttons
**Learning:** For destructive actions requiring a two-click confirmation pattern, screen readers and users benefit significantly from having the button text explicitly state the pending action (e.g., "Confirm release of [Item]") rather than relying solely on visual cues like a color change.
**Action:** When implementing secondary-click confirmations, couple the visible text and `aria-label` dynamically to the same state flag that triggers the visual indicator, ensuring the UI clearly describes the required action.
