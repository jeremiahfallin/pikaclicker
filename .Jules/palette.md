## 2026-05-11 - Explicit Confirmation Labels
**Learning:** For destructive actions (like releasing a Pokemon) that require a two-step confirmation via the same button, screen reader users and visual users can be left confused if the button text or aria-label doesn't explicitly state the new required action.
**Action:** When a button toggles to a confirmation state for a destructive action, explicitly update both the visual text (e.g. 'Confirm Release') and the `aria-label` (e.g. 'Confirm release of [Item]') rather than relying solely on a secondary click with no context change.
