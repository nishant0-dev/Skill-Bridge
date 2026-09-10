# Skill Market Analyzer

An interactive workforce intelligence dashboard that helps education teams connect district hiring signals to curriculum updates and adaptive skill-readiness assessments.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/skill-market-analyzer/src/App.tsx` — single-page dashboard shell, mock workforce data, curriculum review, and adaptive assessment flows
- `artifacts/skill-market-analyzer/src/index.css` — application theme, typography, motion, and responsive visual utilities
- `artifacts/skill-market-analyzer/.replit-artifact/artifact.toml` — artifact preview and workflow configuration
- `artifacts/api-server` — shared API service scaffold; not required by the current local-data dashboard

## Architecture decisions

- The first release uses realistic local data so the dashboard is useful immediately without requiring third-party feeds or a database.
- The three workspace areas remain in one route and share stateful navigation to keep the signal → curriculum → assessment workflow fast to explore.
- Export is intentionally a plain-text handoff so an approved curriculum delta can be downloaded without introducing a document-generation dependency.

## Product

The dashboard provides district market intelligence, curriculum delta review and approval, a downloadable review package, and a three-step adaptive assessment that raises or lowers difficulty from each answer.

## User preferences

- The user asked to build, debug, and polish the supplied React dashboard.

## Gotchas

- Artifact workflows provide `PORT` and `BASE_PATH`; manual Vite builds need those variables set explicitly.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
