## 2024-05-18 - Bank Release Confirmation Button
**Learning:** Reusing the same button for both initial action and confirmation can be visually confusing without explicit text changes.
**Action:** Always update the button text to explicitly state the action being confirmed, coupling it directly to the state flag. Avoid redundant `aria-label`s if the visible text clearly describes the action, as screen readers will read the text automatically.
