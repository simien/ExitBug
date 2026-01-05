## 2024-05-23 - [Missing Content Security Policy]
**Vulnerability:** The application lacks a Content Security Policy (CSP), potentially allowing XSS attacks if a vulnerability were introduced.
**Learning:** Even client-side games should have defense-in-depth. A strict CSP prevents unauthorized scripts from running.
**Prevention:** Add a `meta` tag with `Content-Security-Policy` to `index.html`.
