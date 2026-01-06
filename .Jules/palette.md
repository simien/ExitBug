## 2026-01-05 - Status Indicators and Mobile Accessibility
**Learning:** Visual status indicators (like HP bars or Alertness meters) often rely on text that is hidden on mobile screens or icons that lack semantic meaning.
**Action:** Wrap status indicators in a container with `role="status"` and provide a dynamic `aria-label` that explicitly states the value and context (e.g., "Health: 50 out of 100"). This ensures users on all devices (and screen readers) get the same information, even if visual text is hidden.
