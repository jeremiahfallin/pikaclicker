## 2023-10-24 - Two-Step Destructive Action Clarity
**Learning:** For destructive actions (like releasing a Pokémon), relying solely on a second click without visual and accessible text changes (e.g., changing "Release" to "Confirm") leads to ambiguity, especially for screen reader users who might just hear "Release" again or a generic "Confirm".
**Action:** Always update the visible text and `aria-label` of the confirmation button to explicitly state the action being confirmed (e.g., "Confirm release of [Item]").
