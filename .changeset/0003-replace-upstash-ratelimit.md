---
"cvweb": patch
---

Replace Upstash Redis rate limiting with zero-dependency in-memory sliding window. Removes external Redis dependency while keeping same 5 req/min limits on contact form and login.
