---
name: supabase-postgres-best-practices
description: Load before changing Supabase or PostgreSQL schemas, migrations, SQL queries, indexes, transactions, functions, database permissions, or Row Level Security policies; also use when investigating slow queries, connection pressure, or cross-user data access.
license: MIT
metadata:
  author: Supabase
  upstream: https://github.com/supabase/agent-skills/tree/main/skills/supabase-postgres-best-practices
  upstream-skill: supabase-postgres-best-practices
  upstream-version: "1.1.1"
  project-adaptation: "1.0"
---

# Supabase and PostgreSQL best practices

Apply this skill before authoring SQL or changing a database contract. Read the
relevant rules from the Supabase upstream skill and official PostgreSQL docs;
the list below is a project-specific safety and review checklist, not a
replacement for the detailed rule set.

## Schema and query design

- Choose data types, constraints and nullability that encode valid states.
- Inspect query plans and representative data before adding indexes or
  optimizing queries. Consider selectivity, write overhead and index size.
- Avoid N+1 access patterns and unbounded result sets. Paginate public or
  potentially large collections.
- Keep transactions short and define the consistency requirements before
  splitting or combining writes.
- Use database migrations for schema, grants, functions and RLS policy changes;
  review both upgrade and rollback/data-preservation implications.

## Security and RLS

- Treat RLS as a row-visibility boundary and SQL grants as the table/function
  access boundary; check both.
- For every exposed table, enumerate the roles and operations that should be
  permitted, then test both positive and negative policy cases.
- Scope policies to the authenticated subject and tenant/owner relationship;
  never rely on client-supplied user identifiers alone.
- Review `SECURITY DEFINER` functions, `search_path`, ownership and grants
  explicitly.
- Never disable RLS or widen grants just to make a frontend request succeed.
- Do not expose full lead/subscriber tables for client-side eligibility checks.

## Performance and operations

- Check query latency, `EXPLAIN (ANALYZE, BUFFERS)` where safe, indexes, locks,
  connection pooling and transaction duration.
- Avoid speculative indexes, unbounded sorts and fetching unused columns.
- Surface database errors and measure the real query after a change.
- Do not run destructive migrations, bulk updates or production data changes
  without explicit authorization and a verified backup/rollback plan.

## Upstream source

Supabase maintains the full ruleset, including critical query, connection and
security/RLS guidance, at
[`supabase/agent-skills`](https://github.com/supabase/agent-skills/tree/main/skills/supabase-postgres-best-practices).
It is MIT-licensed. Consult its individual references before database changes.
