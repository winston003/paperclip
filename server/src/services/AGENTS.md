# server/src/services/

Business logic layer for Paperclip control plane. Routes delegate to services; services encapsulate domain rules and database operations.

## Overview

57 service files implementing core orchestration: heartbeat scheduling, budget enforcement, task management, agent coordination, cost tracking, and governance workflows.

## Structure

```
services/
├── heartbeat/           # Heartbeat scheduling and execution
│   ├── scheduler.ts     # Periodic heartbeat triggers
│   └── invoke.ts        # Agent invocation via adapters
├── budget/              # Cost control and enforcement
│   ├── policies.ts      # Budget policy management
│   └── enforcement.ts   # Hard-stop auto-pause logic
├── agents/              # Agent lifecycle management
│   ├── permissions.ts   # Permission normalization
│   └── runtime-state.ts # Agent status transitions
├── issues/              # Task/issue orchestration
│   ├── checkout.ts      # Atomic checkout semantics
│   └── comments.ts      # Comment threading
├── costs/               # Cost event processing
├── approvals/           # Governance approval flows
├── activity-log.ts      # Audit trail for mutations
└── documents/           # Document versioning
```

## Where to Look

| Task | Location | Notes |
|------|----------|-------|
| Heartbeat scheduling | `heartbeat/scheduler.ts` | Interval-based triggers, skip conditions |
| Agent invocation | `heartbeat/invoke.ts` | Process/HTTP adapters, timeout handling |
| Budget enforcement | `budget/enforcement.ts` | Hard limit → auto-pause |
| Task checkout | `issues/checkout.ts` | Atomic UPDATE with status check |
| Activity logging | `activity-log.ts` | Called by all mutating services |
| Cost rollups | `costs/` | Agent/task/project/company aggregations |
| Agent permissions | `agents/permissions.ts` | Board vs agent scope |

## Conventions

### Company Scoping
- Every service method receives `companyId` as first parameter or in options
- All DB queries include `where: eq(table.company_id, companyId)`
- No cross-company data access at service layer

### Error Handling
- Use `server/src/errors.js` helpers: `conflict()`, `notFound()`, `unprocessable()`, etc.
- Throw on business rule violations (e.g., checkout conflict, invalid transition)
- Services do NOT catch errors — let them propagate to route handler

### Activity Logging
- Call `logActivity()` for every mutation
- Include actor info, entity type/id, and relevant details
- Details are JSONB; redact sensitive values

### Atomic Operations
- Use transactions for multi-step mutations (e.g., checkout + status change)
- `checkoutIssue()` uses single UPDATE with WHERE conditions — no race conditions

## Anti-Patterns (THIS PROJECT)

- **Never** bypass company_id filtering in queries
- **Never** return raw database errors to clients — wrap in API errors
- **Never** log secrets or tokens in activity details
- **Never** allow agents to modify budgets directly
- **Never** skip activity logging for mutations

## Key Invariants

1. **Single assignee**: Issues have exactly one `assignee_agent_id` when `in_progress`
2. **Atomic checkout**: `checkoutIssue()` returns 409 on conflict, never double-assigns
3. **Budget hard-stop**: Agent auto-pauses when budget exceeded
4. **Approval gates**: Certain actions require board approval before execution
5. **Goal alignment**: Tasks trace to company goals via `goal_id` or project linkage
