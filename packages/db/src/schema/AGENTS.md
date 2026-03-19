# packages/db/src/schema/

Drizzle ORM schema definitions for Paperclip control plane. 54 table files implementing multi-company isolation with hierarchical relationships.

## Overview

All business entities are company-scoped via `company_id` foreign keys. Schema supports agent orchestration, task management, budget enforcement, goal alignment, and full audit logging.

## Structure

```
schema/
├── index.ts            # Re-exports all tables and relations
├── companies.ts        # Root entity: id, name, status, budget
├── agents.ts           # Agent definitions with reports_to hierarchy
├── goals.ts            # Goal hierarchy (company → team → agent → task)
├── projects.ts         # Projects linked to goals and lead agents
├── issues.ts           # Tasks with complex relationships
├── heartbeat_runs.ts   # Agent execution tracking
├── cost_events.ts      # Token/cost tracking per agent/task
├── approvals.ts        # Governance approval requests
├── activity_log.ts     # Audit trail for all mutations
├── documents.ts        # Versioned documents attached to issues
├── assets.ts           # File attachments (local_disk, s3)
├── company_secrets.ts  # Secret metadata with encrypted versions
├── auth.ts             # Global auth tables (users, sessions)
└── instance_settings.ts # Global instance config (not company-scoped)
```

## Where to Look

| Task | Location | Notes |
|------|----------|-------|
| Add new table | Create `new-entity.ts`, export from `index.ts` | Include company_id for business entities |
| Company entity | `companies.ts` | Root of all company-scoped data |
| Agent hierarchy | `agents.ts` | `reports_to` self-reference, status, permissions |
| Task model | `issues.ts` | Status, assignee, goal linkage, workspaces |
| Cost tracking | `cost_events.ts` | Provider, model, tokens, cost_cents |
| Audit trail | `activity_log.ts` | actor_type, action, entity_type, details |
| Secrets | `company_secrets.ts` + `company_secret_versions.ts` | Encrypted at rest |
| Auth tables | `auth.ts` | users, sessions, accounts — NOT company-scoped |

## Conventions

### Naming
- **Tables**: Plural nouns (`agents`, `issues`, `cost_events`)
- **Columns**: snake_case (`company_id`, `created_at`, `budget_monthly_cents`)
- **Primary keys**: Always `id` as UUID
- **Foreign keys**: `{referenced_table}_id` (e.g., `agent_id`, `project_id`)
- **Timestamps**: `created_at`, `updated_at` as `timestamptz`

### Company Scoping
- **Rule**: All business entities include `company_id` as not-null FK to `companies.id`
- **Enforcement**: FK constraints prevent cross-company references
- **Exceptions**: Auth tables (`users`, `sessions`) and `instance_settings` are global

### Indexes
- Include `company_id` for scoped queries: `index('agents_company_status_idx').on(agents.company_id, agents.status)`
- Unique constraints for natural keys: `uniqueKey('company_secrets_name_uk').on(company_secrets.company_id, company_secrets.name)`

### Enums
- Use `pgEnum()` for status/type fields: `agentStatus = pgEnum('agent_status', ['active', 'paused', ...])`
- Mirror in `packages/shared/src/constants.ts` for TypeScript union types

## Anti-Patterns (THIS PROJECT)

- **Never** create a business table without `company_id`
- **Never** use raw SQL for migrations — use Drizzle migration system
- **Never** add columns without updating `packages/shared` types
- **Never** forget to export new tables from `index.ts`
- **Never** use `any` in schema definitions — use proper types

## Key Relationships

```
companies (1) ──── (N) agents ──── (N) issues
    │                  │               │
    │                  └── reports_to (self-ref)
    │
    └──── (N) goals ──── (N) projects ──── (N) issues
              │
              └── parent_id (self-ref for hierarchy)

agents (1) ──── (N) heartbeat_runs
       │
       └──── (N) cost_events ──── rollup to company

issues (1) ──── (N) documents
       │
       └──── (N) attachments ──── assets

companies (1) ──── (N) approvals
       │
       └──── (N) activity_log
```

## Migration Workflow

1. Edit schema files in `schema/`
2. Export new tables from `schema/index.ts`
3. Run `pnpm db:generate` (compiles TypeScript, generates SQL)
4. Run `pnpm db:migrate` to apply
5. Update `packages/shared` types to match
