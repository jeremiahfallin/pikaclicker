## 2024-06-20 - Explicit Actions in Destructive Confirmations
**Learning:** For destructive actions (like releasing a Pokémon), relying purely on secondary clicks without visual changes can be confusing, and missing an `aria-label` reduces clarity for screen reader users during state changes.
**Action:** When a destructive button enters a confirmation state (e.g. asking for a second click), immediately update the visible text (e.g., from "Release" to "Confirm release") and explicitly set the `aria-label` (e.g., "Confirm release of [Item]") using the exact same state flag.
