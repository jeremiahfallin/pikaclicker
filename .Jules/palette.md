
## 2024-04-04 - Button State Feedback
**Learning:** In two-step confirmation patterns (like the release button in Bank), color changes (gray to red) are insufficient for accessibility. Text and aria-label must update to reflect the new state ('Release' -> 'Confirm').
**Action:** Always update both visual text and screen reader labels when a button's primary action changes to a confirmation step.
