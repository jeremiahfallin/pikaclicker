## 2026-06-08 - Explicit Release Confirmation
**Learning:** Destructive actions like releasing a Pokémon should not happen in a single click, especially when there are many items in a virtualized list. A multi-step confirmation tied dynamically to the selected item's state prevents accidental data loss and improves clarity.
**Action:** Update the button's text and `aria-label` during the confirm step to explicitly state the action and target (e.g., 'Confirm release of [Pokémon name]') for clear visual and screen-reader feedback.
