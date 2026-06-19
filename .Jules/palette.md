## 2024-06-19 - Accessibility on confirmation buttons
**Learning:** Destructive actions with inline confirmation (e.g., clicking to confirm after initial click) need dynamic `aria-label`s to explain the secondary state clearly.
**Action:** Always check confirmation buttons to ensure they dynamically update `aria-label`s based on their internal confirmation state to support screen readers.
