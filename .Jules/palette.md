## 2024-05-24 - Bank UI Accessibility and Destructive Action Polish
**Learning:**
- Interactive layout elements in Chakra UI (like `<Center>`) can instantly become keyboard-accessible by adding `as="button"`.
- Relying solely on a color change (like changing button color to red) for destructive actions (e.g., releasing a Pokémon) is insufficient for colorblind users and screen readers. Combining the color change with explicit text modifications (e.g., changing "Release" to "Confirm") significantly reinforces the action's destructive nature.
- Always conditionally apply `_hover` states when the component also uses background coloring for a selected or active state to prevent the hover effect from overwriting the active state indicator.

**Action:**
- Whenever applying an interactive click handler to a non-button structural element in Chakra UI, default to adding `as="button"` and ensure hover/focus states are defined.
- Require all destructive confirm actions to alter both color *and* text for maximum clarity.