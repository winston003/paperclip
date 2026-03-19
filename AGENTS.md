<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

# AGENTS.md

**Generated:** 2026-03-19
**Commit:** bbd7fa9
**Branch:** feat/add-chinese-localization

Guidance for human and AI contributors working in this repository.

## 1. Purpose

Paperclip is a control plane for AI-agent companies — orchestration infrastructure for autonomous AI workforces with org charts, budgets, governance, and goal alignment. V1 implementation contract is in `doc/SPEC-implementation.md`.

## 2. Read This First

Before making changes, read in this order:

1. `doc/GOAL.md` — Vision and objectives
2. `doc/PRODUCT.md` — Product boundaries
3. `doc/SPEC-implementation.md` — V1 build contract
4. `doc/DEVELOPING.md` — Dev setup and workflows
5. `doc/DATABASE.md` — Schema and migrations

`doc/SPEC.md` is long-horizon product context.

## 3. Repo Map

```
paperclip/
├── server/           # Express REST API, auth, orchestration
│   └── src/services/ # Business logic (heartbeat, budgets, tasks) [AGENTS.md]
├── ui/               # React + Vite board operator UI
│   └── src/components/ # UI components, forms, context [AGENTS.md]
├── packages/
│   ├── db/           # Drizzle schema, migrations, DB clients
│   │   └── src/schema/ # Table definitions [AGENTS.md]
│   ├── shared/       # Types, constants, validators, API paths
│   ├── adapters/     # Agent adapters (claude-local, openclaw, etc.)
│   └── plugins/      # Plugin SDK and examples
├── cli/              # paperclipai CLI (setup + client commands)
├── skills/           # AI agent skills for Paperclip integration
├── doc/              # Internal docs, specs, plans
├── docs/             # Public docs (website)
└── tests/            # E2E tests (Playwright)
```

## 4. Dev Setup (Auto DB)

Use embedded PGlite in dev by leaving `DATABASE_URL` unset.

```sh
pnpm install
pnpm dev
```

This starts:

- API: `http://localhost:3100`
- UI: `http://localhost:3100` (served by API server in dev middleware mode)

Quick checks:

```sh
curl http://localhost:3100/api/health
curl http://localhost:3100/api/companies
```

Reset local dev DB:

```sh
rm -rf data/pglite
pnpm dev
```

## 5. Core Engineering Rules

1. **Keep changes company-scoped.** Every domain entity should be scoped to a company and company boundaries must be enforced in routes/services.

2. **Keep contracts synchronized.** If you change schema/API behavior, update all impacted layers:
   - `packages/db` schema and exports
   - `packages/shared` types/constants/validators
   - `server` routes/services
   - `ui` API clients and pages

3. **Preserve control-plane invariants.**
   - Single-assignee task model
   - Atomic issue checkout semantics
   - Approval gates for governed actions
   - Budget hard-stop auto-pause behavior
   - Activity logging for mutating actions

4. **Do not replace strategic docs wholesale unless asked.** Prefer additive updates. Keep `doc/SPEC.md` and `doc/SPEC-implementation.md` aligned.

5. **Keep plan docs dated and centralized.** New plan documents belong in `doc/plans/` and should use `YYYY-MM-DD-slug.md` filenames.

## 6. Database Change Workflow

When changing data model:

1. Edit `packages/db/src/schema/*.ts`
2. Ensure new tables are exported from `packages/db/src/schema/index.ts`
3. Generate migration:

```sh
pnpm db:generate
```

4. Validate compile:

```sh
pnpm -r typecheck
```

Notes:
- `packages/db/drizzle.config.ts` reads compiled schema from `dist/schema/*.js`
- `pnpm db:generate` compiles `packages/db` first

## 7. Build, Lint, and Test Commands

### Core Commands
```sh
pnpm install          # Install all dependencies (do NOT commit pnpm-lock.yaml)
pnpm dev              # Full dev mode (API + UI, watch mode with auto-restart)
pnpm dev:server       # Run server only in watch mode
pnpm dev:ui           # Run UI only in watch mode
pnpm build            # Build all packages and applications
pnpm typecheck        # Run TypeScript type checking across all modules
pnpm db:generate      # Generate new Drizzle migration after schema changes
pnpm db:migrate       # Apply database migrations
pnpm paperclipai      # Run Paperclip CLI commands
```

### Test Execution
```sh
pnpm test:run         # Run all tests (headless)
pnpm test             # Run tests in watch mode

# Run a single test file
pnpm test:run path/to/file.test.ts

# Run tests in a specific package
pnpm --filter @paperclipai/server test:run
pnpm --filter @paperclipai/db test:run

# E2E testing
pnpm test:e2e         # Run all end-to-end tests
pnpm test:e2e:headed  # Run E2E tests in headed mode for debugging
```

### Additional Tooling
```sh
pnpm changeset        # Create a new changeset for versioning
pnpm check:tokens     # Check for forbidden tokens/secrets in code
pnpm db:backup        # Create a backup of the local database
```

## 8. Verification Before Hand-off

Run this full check before claiming done:

```sh
pnpm -r typecheck
pnpm test:run
pnpm build
```

If anything cannot be run, explicitly report what was not run and why.

## 9. Code Style Guidelines

### Imports
- Use ES module syntax (`import`/`export`) exclusively
- Order imports: 1) Node.js builtins, 2) External dependencies, 3) Internal workspace packages (`@paperclipai/*`), 4) Relative imports (parent directories first, then same directory)
- Type imports must use `import type` explicitly
- Avoid wildcard imports except for schema/type collections

```typescript
// Good
import { createHash } from "node:crypto";
import { eq } from "drizzle-orm";
import type { Db } from "@paperclipai/db";
import { agents } from "@paperclipai/db";
import { conflict } from "../errors.js";
import { normalizeAgentPermissions } from "./agent-permissions.js";
```

### Formatting
- 2 spaces for indentation
- Max line length: 120 characters
- Use single quotes for strings (backticks for template literals)
- Add trailing commas in arrays/objects/imports
- No semicolons (ASI is acceptable)
- Prefer `const` over `let`, never use `var`
- Arrow functions preferred for callbacks and short functions

### Naming Conventions
- **Files**: kebab-case (`agent-permissions.ts`, `create-company.tsx`)
- **Variables/functions**: camelCase (`hashToken`, `agentRuntimeState`)
- **Types/Interfaces/Classes**: PascalCase (`AgentConfigSnapshot`, `UpdateAgentOptions`)
- **Constants**: UPPER_SNAKE_CASE (`CONFIG_REVISION_FIELDS`, `REDACTED_EVENT_VALUE`)
- **Database columns**: snake_case (matches schema definitions)
- **React components**: PascalCase with `.tsx` extension
- **Boolean variables/functions**: prefix with `is`, `has`, `should`, `can` (`isUuidLike`, `shouldNotify`)

### TypeScript Practices
- All function parameters and return types must be explicitly typed
- Do NOT use `any`, `@ts-ignore`, or `@ts-expect-error` - fix the type issue properly
- Prefer type unions over enums for state values
- Use Zod for runtime validation of all external inputs (API requests, adapter responses)
- Extract shared types to `packages/shared` to avoid duplication
- Use readonly modifiers for immutable data structures

### Error Handling
- Throw errors for exceptional cases, do not return null/undefined for failures
- Use custom error classes from `server/src/errors.js` for API errors:
  - `conflict()` - 409 Conflict (resource already exists, atomic checkout failure)
  - `notFound()` - 404 Not Found
  - `unprocessable()` - 422 Unprocessable Entity (validation failure)
  - `unauthorized()` - 401 Unauthorized
  - `forbidden()` - 403 Forbidden
  - `badRequest()` - 400 Bad Request
- Always log full error details before returning to client
- Never expose internal stack traces or database details in API responses

### Security Conventions
- All database queries must include company_id filtering for multi-company isolation
- API keys are hashed with SHA-256 at rest - never store plaintext keys
- Sanitize all user input before storing/processing
- Write activity log entries for all mutating operations
- Agent keys have restricted permissions - never grant full board access to agents
- Secrets are never logged or serialized in API responses

## 10. API and Auth Expectations

- Base path: `/api`
- Board access is treated as full-control operator context
- Agent access uses bearer API keys (`agent_api_keys`), hashed at rest
- Agent keys must not access other companies

When adding endpoints:

- apply company access checks
- enforce actor permissions (board vs agent)
- write activity log entries for mutations
- return consistent HTTP errors (`400/401/403/404/409/422/500`)

## 11. UI Expectations

- Keep routes and nav aligned with available API surface
- Use company selection context for company-scoped pages
- Surface failures clearly; do not silently ignore API errors

## 12. Definition of Done

A change is done when all are true:

1. Behavior matches `doc/SPEC-implementation.md`
2. Typecheck, tests, and build pass
3. Contracts are synced across db/shared/server/ui
4. Docs updated when behavior or commands change
