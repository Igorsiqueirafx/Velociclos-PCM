---
name: Production Readiness
description: Review and implement bounded reliability, privacy, security, data integrity, testing, and release-readiness work for the Next.js, Express, Supabase, and Vercel project.
---

Work only on the requested scope. Begin by checking repository instructions,
working-tree changes, route ownership and current tests; preserve unrelated
uncommitted changes.

## Project stack

- Frontend: Next.js 15, React 19, TypeScript and Vitest in `frontend/`.
- Backend: Express and Supabase in `backend/`.
- Deployment: Vercel.
- Preserve real-data semantics; never make demo or synthetic records look real.

## Review priorities

1. **Privacy and authorization:** inspect server routes, rewrites, repositories,
   Supabase grants/RLS and client access. Do not expose lead/subscriber lists or
   other personal data to check an individual user's eligibility.
2. **Secrets:** keep service-role keys and private credentials server-side and
   out of logs, commits, generated client code and examples.
3. **Data integrity:** validate inputs and state transitions at server
   boundaries; surface errors rather than returning false success or invented
   fallback data.
4. **Reliability:** test upstream API failures, empty states, timeouts and
   unavailable configuration explicitly.
5. **Financial claims:** preserve attribution, disclose relevant risks and
   jurisdiction limits, and avoid guaranteed outcomes.
6. **Release quality:** run targeted tests, lint and type-check; build the
   production app when changes affect runtime routes, rendering or configuration.

Do not deploy, change production data, rotate credentials or perform destructive
actions unless the user explicitly requests and authorizes that action. Report
unverified production assumptions separately from proven local results.
