# Agent skills and tools

This repository keeps reusable agent guidance in `.agents/skills/` and
GitHub Copilot custom agents in `.github/agents/`. The checked-in files are
small, project-specific adaptations; they do not install runtime dependencies
or grant agents additional credentials or production access.

## Installed project skills

| Skill | Use for | Maintained upstream |
| --- | --- | --- |
| `vercel-react-best-practices` | React 19 and Next.js 15 frontend work, performance, rendering, data fetching and accessibility | [Vercel Agent Skills](https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices) |
| `supabase` | Supabase clients, Auth, RLS, Storage, migrations and access control | [Supabase Agent Skills](https://github.com/supabase/agent-skills/tree/main/skills/supabase) |
| `supabase-postgres-best-practices` | PostgreSQL schema, SQL, query plans, transactions, grants and RLS | [Supabase Postgres best practices](https://github.com/supabase/agent-skills/tree/main/skills/supabase-postgres-best-practices) |

## Installed project agents

- **Fimathe Content Curator** researches and maintains attributed, current
  Fimathe and partner content, including financial-risk and jurisdiction checks.
- **Production Readiness** focuses reviews on privacy, authorization, data
  integrity, reliability and release verification across the frontend, backend
  and database.

The agents are available in `.github/agents/`. The official GitHub
[`awesome-copilot`](https://github.com/github/awesome-copilot) collection was
reviewed as a source; its broad third-party catalog was not copied wholesale.

## Keeping guidance current

Before a framework, provider or database change, read the matching skill and
check its upstream guidance and the documentation for the versions pinned by
this project. Do not update guidance by blindly copying a newer framework
example into the Next.js 15 codebase.

The `skills` CLI is the upstream open-source option for discovering and
installing compatible Agent Skills from GitHub. It was not added as a project
dependency: the checked-in adaptations need no executable installer at
runtime, and no MCP server, external credential or production permission is
required to use them.
