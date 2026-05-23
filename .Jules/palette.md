## 2024-05-23 - Explicit destructive action confirmation
**Learning:** Relying solely on color changes (like switching to red) for a confirmation step is insufficient for accessibility and clarity. Destructive actions need explicit visual text and context-aware ARIA labels.
**Action:** Always update the visible text (e.g., 'Confirm release') and `aria-label` (e.g., 'Confirm release of [Item]') for destructive UI actions to explicitly state the action being confirmed.
