# Project Context

## Purpose
Paperclip is an open-source control plane for AI-agent companies — orchestration infrastructure for autonomous AI workforces with org charts, budgets, governance, and goal alignment. It enables running entire businesses autonomously with teams of AI agents coordinating toward common goals.

**Mission**: Bring your own agents, assign goals, and track your agents' work and costs from one dashboard. Manage business goals, not pull requests.

## Tech Stack
- **Language**: TypeScript (strict mode) across all modules
- **Backend**: Node.js + Express.js (REST API)
- **Frontend**: React + Vite
- **Database**: PostgreSQL (production) / PGlite (embedded dev) with Drizzle ORM
- **Package Manager**: pnpm 9.15+ (workspace monorepo)
- **Node.js**: 20+ required
- **Validation**: Zod for runtime input validation
- **Testing**: Playwright for E2E tests, Jest/Vitest for unit tests

## Project Conventions

### Code Style
- **Imports**: ES modules exclusively; Node builtins → external dependencies → `@paperclipai/*` → relative imports (ordered)
- **Indentation**: 2 spaces (no tabs)
- **Quotes**: Single quotes for strings, backticks for template literals
- **Semicolons**: No semicolons (ASI acceptable)
- **Line length**: Max 120 characters
- **Trailing commas**: Always in arrays/objects/imports
- **Naming**:
  - Files: kebab-case (`agent-permissions.ts`, `create-company.tsx`)
  - Variables/functions: camelCase (`hashToken`, `agentRuntimeState`)
  - Types/classes/components: PascalCase (`AgentConfigSnapshot`, `CreateCompany`)
  - Constants: UPPER_SNAKE_CASE (`CONFIG_REVISION_FIELDS`)
  - Database columns: snake_case (matches schema definitions)
  - React components: PascalCase with `.tsx` extension
  - Booleans: Prefix with `is`, `has`, `should`, `can` (`isUuidLike`, `shouldNotify`)
- **TypeScript**:
  - Explicit function parameter and return types required
  - No `any`, `@ts-ignore`, or `@ts-expect-error` — fix type issues properly
  - Prefer type unions over enums
  - Zod validation for all external inputs (API, adapters)
  - Extract shared types to `packages/shared`
  - Use `import type` for type imports explicitly

### Architecture Patterns
- **Monorepo structure** with packages:
  - `server/`: Express REST API, auth, orchestration services
  - `ui/`: React operator UI
  - `packages/db`: Drizzle schema, migrations, DB clients
  - `packages/shared`: Types, constants, validators, API paths
  - `packages/adapters`: Agent adapters (claude-local, openclaw, etc.)
  - `packages/plugins`: Plugin SDK and examples
  - `cli/`: paperclipai CLI
- **Company-scoped everything**: All domain entities MUST be scoped to a company with `company_id` filtering for multi-tenant isolation
- **Keep contracts synchronized**: Schema → types → API → UI must all be updated together when contracts change
- **Invariants preserved**: Single-assignee tasks, atomic checkout, approval gates, budget hard-stop, activity logging for mutations

### Testing Strategy
- E2E tests with Playwright in `tests/`
- Package-level tests colocated in packages
- Run `pnpm test:run` for full test suite
- All tests must pass before merging

### Git Workflow
- Feature branches from `main`
- Conventional commit messages recommended
- Pull request review required for significant changes
- No `pnpm-lock.yaml` committed (pnpm v10+ behavior)

## Domain Context
Paperclip models an autonomous AI company:
- **Company**: Top-level entity with complete data isolation
- **Org Chart**: Hierarchical role-based structure (CEO → CTO → Engineers → etc.)
- **Goals**: Hierarchical goal tree that traces every task back to mission
- **Agents**: AI workers that can be from any provider (Claude Code, OpenClaw, Codex, etc.)
- **Tasks**: Atomic units of work with atomic checkout semantics
- **Budgets**: Cost tracking per agent/company with automatic throttling
- **Heartbeats**: Scheduled agent execution for recurring work
- **Governance**: Approval gates and audit logging for all changes
- **Plugins**: Extension system for custom functionality

**Key concept**: If an agent can receive a heartbeat, it can be hired. Paperclip doesn't care what model or runtime it uses — it just coordinates.

## Important Constraints
- All database queries must include `company_id` filtering to preserve isolation
- API keys are stored hashed with SHA-256 — never plaintext
- Agent keys have restricted permissions — never grant full board access
- Do not commit `pnpm-lock.yaml`
- Prefer additive doc updates over wholesale replacements
- New plans go in `doc/plans/YYYY-MM-DD-slug.md`
- No semicolons (per code style)
- No `any` types in TypeScript

## External Dependencies
- Postgres (production) or PGlite (dev)
- Node.js 20+ runtime
- Various LLM providers (depending on agent adapters used)
- pnpm for package management
