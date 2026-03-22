# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What is Paperclip

Paperclip is an open-source orchestration platform for autonomous AI companies. It coordinates teams of AI agents (Claude Code, Codex, Cursor, OpenClaw, etc.) with human governance, budget controls, and task management. If an agent is an employee, Paperclip is the company.

## Build & Development

```sh
pnpm install          # install deps
pnpm dev              # start API server + UI in watch mode (http://localhost:3100)
pnpm dev:once         # single run without file watching
pnpm dev:server       # server only
pnpm dev:ui           # UI only
pnpm build            # build all packages
pnpm typecheck        # TypeScript type checking across all packages
```

## Testing

```sh
pnpm test             # vitest in watch mode
pnpm test:run         # run all tests once (CI mode)
pnpm test:e2e         # Playwright E2E tests
pnpm test:e2e:headed  # E2E tests with browser UI
```

Vitest is configured with projects: `packages/db`, `packages/adapters/opencode-local`, `server`, `ui`, `cli`. Tests live in `__tests__/` directories with `.test.ts` extensions.

To run tests for a specific project: `pnpm test -- --project server`

## Database

- **Dev**: Leave `DATABASE_URL` unset. Embedded PostgreSQL auto-starts, data at `~/.paperclip/instances/default/db`
- **External**: Set `DATABASE_URL` to use an external PostgreSQL
- ORM: Drizzle ORM. Schema in `packages/db/src/schema/`
- `pnpm db:generate` — generate migrations
- `pnpm db:migrate` — apply migrations
- Reset dev DB: `rm -rf ~/.paperclip/instances/default/db && pnpm dev`

## Monorepo Structure (pnpm workspaces)

- `packages/shared` — shared types, Zod validators, constants
- `packages/db` — Drizzle schema, migrations, database clients
- `packages/adapter-utils` — utilities for agent adapters
- `packages/adapters/` — agent adapter implementations (claude-local, codex-local, cursor-local, gemini-local, openclaw-gateway, opencode-local, pi-local)
- `packages/plugins/sdk` — plugin SDK
- `server/` — Express 5 API server
- `ui/` — React 19 + Vite 6 + Tailwind 4 frontend
- `cli/` — CLI tool (commander + clack/prompts)

TypeScript project references are configured in root `tsconfig.json`. All packages use ESM (`"type": "module"`).

## Server Architecture

**Framework**: Express 5 with middleware chain: JSON parsing → HTTP logging (pino) → actor/auth → board mutation guard → private hostname validation → error handler.

**Key directories** in `server/src/`:
- `routes/` — RESTful endpoints (companies, agents, issues, goals, approvals, projects, plugins, etc.)
- `services/` — business logic (heartbeat orchestration, budgets, costs, plugin management, etc.)
- `middleware/` — auth, logging, error handling
- `realtime/` — WebSocket live events (`live-events-ws.ts`)
- `storage/` — pluggable storage (local disk or S3)
- `auth/` — better-auth integration + agent JWT auth

**Authentication**: Dual system — session-based (better-auth cookies) for humans, HS256 JWT for agents. Local trusted mode skips auth.

**Deployment modes**: `local_trusted` (dev default, no auth), `authenticated/private`, `authenticated/public`. See `doc/DEPLOYMENT-MODES.md`.

## UI Architecture

React 19 with react-router-dom 7, @tanstack/react-query for server state, @dnd-kit for drag-and-drop, @mdxeditor for rich text, lucide-react icons.

## Lockfile Policy

Do NOT commit `pnpm-lock.yaml` in PRs. GitHub Actions manages the lockfile on master.

## PR Guidelines

- Include a "thinking path" at the top of PR messages explaining context from project level down to the fix
- Small, focused PRs merge fastest
- Larger changes: discuss in Discord #dev first
- Include before/after screenshots for visible changes
- All automated checks must pass (including Greptile comments)

## Key Documentation

- `doc/DEVELOPING.md` — local dev setup and all deployment/config details
- `doc/DEPLOYMENT-MODES.md` — deployment mode specs
- `doc/DATABASE.md` — database configuration
- `doc/DOCKER.md` — Docker setup
- `doc/CLI.md` — CLI command reference
- `doc/SPEC.md` — product spec
- `CONTRIBUTING.md` — PR contribution guidelines
