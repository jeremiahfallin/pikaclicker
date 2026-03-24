## 2024-05-18 - Explicit text required for destructive action confirmations

**Learning:** When using a multi-step confirmation for destructive actions (like releasing a Pokemon), relying solely on color changes (e.g., turning a gray button red) is insufficient for accessibility and clear user intent.
**Action:** Always update the button text (e.g., "Release" -> "Confirm") and the associated `aria-label` to explicitly state the pending destructive action, ensuring all users, including those using screen readers or with color vision deficiencies, understand the requirement to confirm.
