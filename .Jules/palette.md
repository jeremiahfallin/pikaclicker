## 2024-05-18 - Two-Step Destructive Action Feedback
**Learning:** Adding dynamic ARIA labels to a two-step confirmation button is critical for accessibility. Screen reader users would otherwise hear "Release" or "Confirm" without context of what object is being removed.
**Action:** When creating two-step "Are you sure?" destructive buttons without a modal, bind the ARIA label to the same `confirming === id` state flag and include the object's identifying name in both the initial and confirming label states (e.g. `Release [Name]` -> `Confirm release of [Name]`).
