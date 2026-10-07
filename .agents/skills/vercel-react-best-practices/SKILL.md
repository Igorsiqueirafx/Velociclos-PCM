---
name: vercel-react-best-practices
description: Apply Vercel's React and Next.js performance guidance when building, reviewing, or refactoring this project's React 19 and Next.js 15 frontend. Prioritize data-fetching waterfalls, bundle size, server rendering, client fetching, rerenders, and accessible media handling; verify recommendations against the installed Next.js version.
license: MIT
metadata:
  author: Vercel
  upstream: https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices
  upstream-skill: vercel-react-best-practices
  project-adaptation: "1.0"
---

# React and Next.js performance

Use this skill for frontend changes in `frontend/`. The project currently uses
Next.js 15, React 19, TypeScript, Tailwind CSS, and Vite/Vitest for tests.

## Before changing code

1. Read the component, its callers, the route and the relevant tests.
2. Check `frontend/package.json` and the lockfile for actual installed APIs.
3. For framework behavior, consult versioned Next.js 15 documentation. Do not
   copy examples that only work in Next.js 16 or a later React release.
4. Preserve existing visual patterns, accessibility and reduced-motion behavior.

## Review priorities

- Remove avoidable sequential awaits between independent operations; use
  `Promise.all` when failure and dependency semantics permit.
- Keep server-only data and dependencies out of client component bundles.
- Defer heavy, optional client features until they are needed.
- Avoid duplicate client fetches; use existing server routes and data helpers.
- Prevent effects from mirroring values that can be derived during render.
- Check rerender scope before adding memoization; do not memoize trivial work.
- Give media intrinsic dimensions, useful alt text and deliberate loading hints.
- Retain visible focus, keyboard interaction, semantic controls and
  `prefers-reduced-motion` support.

## Data and safety

- Authenticate and authorize every private server action and route independently.
- Never solve browser access by exposing service-role keys, credentials or private
  subscriber records.
- Avoid presenting fallback/demo records as live or official data.
- Keep errors observable using the repository's logger and user-facing error
  states. Do not hide failed requests behind success-shaped data.

## Verification

Run the narrowest relevant test first. For frontend changes, use the repository
lint and type-check commands, targeted Vitest tests, and a production build when
the change affects routing, rendering or bundling.

## Upstream source

Vercel publishes a broader collection of React and Next.js optimization rules in
[`vercel-labs/agent-skills`](https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices),
licensed under MIT. This project skill is a focused adaptation for the
repository's installed versions; consult upstream and current Next.js 15 docs
when a task needs deeper rule examples.
