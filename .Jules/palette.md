## 2024-06-10 - Dynamic Confirmation Labels for Destructive Actions
**Learning:** When using a single button for a two-step destructive action (like "Release" -> "Confirm"), users (especially screen reader users) can lose context if the button text doesn't explicitly state the action being confirmed.
**Action:** Pair visual text changes with dynamic `aria-label` updates for destructive actions requiring secondary clicks. Ensure the confirmation text explicitly names the item being affected (e.g., "Confirm release of Pikachu" instead of just "Confirm").
