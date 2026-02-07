---
"cvweb": minor
---

Add analytics dashboard and health check widget to admin panel.

- Health check widget on admin dashboard showing DB, Resend, reCAPTCHA status
- Security event tracking: failed logins, rate limit hits, reCAPTCHA failures
- Page view tracking with privacy-friendly IP hashing and bot filtering
- Analytics dashboard at /admin/analytics with line/bar charts (Recharts)
- Traffic overview: daily views, unique visitors, top pages, referrers, browsers, devices
- Security overview: events over time, top IPs, recent events table
- 90-day data retention with manual purge
