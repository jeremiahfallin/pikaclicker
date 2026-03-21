
## 2026-03-21 - Interactive Layout Wrappers in Chakra UI
**Learning:** The application frequently uses Chakra UI layout components like `<Center>` or `<Box>` as clickable elements without making them semantic buttons. This completely breaks keyboard navigation and screen reader support.
**Action:** When adding interactivity to Chakra layout components, always use the `as="button"` prop combined with `aria-pressed` and `aria-label` to ensure they are fully accessible and focusable.
