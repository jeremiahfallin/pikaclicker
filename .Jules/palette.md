## 2024-05-15 - Improve Clarity of Destructive Actions
**Learning:** For destructive actions (like releasing a Pokémon), relying purely on color change (e.g., button turning red) for a secondary confirmation click is inaccessible to screen readers and potentially confusing to visually impaired users.
**Action:** Use explicit text and dynamic `aria-label`s coupled to the confirmation state (e.g., "Confirm release of [Pokemon]") to provide clear, accessible context for destructive UI actions.
