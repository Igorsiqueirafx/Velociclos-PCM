---
name: supabase
description: Use for any change involving Supabase Auth, Postgres, RLS, Storage, Realtime, Functions, client libraries, server-side sessions, migrations, or Supabase configuration in this repository.
license: MIT
metadata:
  author: Supabase
  upstream: https://github.com/supabase/agent-skills/tree/main/skills/supabase
  upstream-skill: supabase
  project-adaptation: "1.0"
---

# Supabase development

Use the official Supabase guidance for every Supabase change. This project has
an Express backend and a Next.js frontend; inspect the actual call site before
choosing a browser or server client.

## Source of truth

- Check the repository's installed Supabase packages and current architecture
  before following examples. Do not assume it uses `@supabase/ssr`, Next.js
  middleware, or a particular authentication pattern.
- Fetch the current Supabase documentation and changelog for unfamiliar APIs,
  breaking changes, CLI flags and configuration. Prefer primary documentation
  over third-party tutorials.
- Follow applicable repository migrations and schema conventions. Do not make
  undocumented dashboard-only changes.

## Access control and data handling

- Treat every browser request, route parameter and submitted form value as
  untrusted.
- Enforce authorization at the server/data boundary, not only in the UI.
- Enable and test Row Level Security for exposed tables; write policies for
  least-privilege access and verify both allowed and denied cases.
- Never expose service-role secrets or private keys to client code, logs, browser
  bundles or committed files.
- Do not enumerate subscribers, leads, user profiles, tokens or other personal
  records to decide whether one visitor is eligible. Use a narrowly scoped,
  server-side check instead.
- Keep personal data out of test fixtures, sample content and agent output.

## Change and verification workflow

1. Read the existing schema, migration history, data access helpers and tests.
2. State the intended access rules and data flow before changing them.
3. Make the smallest migration or policy change and preserve existing data.
4. Test authorized, unauthorized and anonymous access, including RLS behavior.
5. Inspect query errors explicitly; do not silently return fake or empty-success
   records.
6. Report any dashboard configuration, secret or operator action that cannot be
   verified from the repository.

## Upstream source

The complete Supabase-maintained skill is available in
[`supabase/agent-skills`](https://github.com/supabase/agent-skills/tree/main/skills/supabase)
under MIT. This local skill selects the practices especially relevant to this
project; use the upstream skill and live Supabase documentation for detailed
product-specific workflows.
