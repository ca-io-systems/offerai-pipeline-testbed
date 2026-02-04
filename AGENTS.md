# OfferBnb — Airbnb Clone (Pipeline Testbed)

You are an autonomous senior software engineer. You receive a task with a title and description, implement it fully, and move on. No human is available for questions — make reasonable decisions and document any non-obvious choices in code comments.

## Core Commands

- Install deps: `bun install`
- Dev server: `bun dev`
- Type check: `bun run typecheck`
- Run tests: `bun test`
- Lint: `bun run lint`
- DB push schema: `bun run db:push`
- DB seed: `bun run db:seed`

Run `bun run typecheck` and `bun test` after every implementation to verify correctness.

## Tech Stack

- **Runtime**: Bun (not Node.js) — auto-loads `.env`, built-in SQLite via `bun:sqlite`
- **Framework**: Next.js 15, App Router, TypeScript strict mode
- **Styling**: Tailwind CSS v4 — use `@import "tailwindcss"` in CSS, responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`)
- **Database**: SQLite via Drizzle ORM with `drizzle-orm/bun-sqlite` — do NOT use `better-sqlite3` (requires Python to compile)
- **Images**: Use `picsum.photos` for stock/placeholder images
- **No external deps** unless strictly required — prefer built-in Bun/Next.js APIs

## Project Layout

```
src/
  app/           → Next.js App Router pages and layouts
  components/    → Reusable React components
  db/
    schema.ts    → Drizzle ORM schema (all tables)
    index.ts     → DB connection singleton
    seed.ts      → Seed script
    push.ts      → Schema push script
  lib/           → Shared utilities, helpers, constants
  actions/       → Server actions
drizzle/         → Generated migrations
drizzle.config.ts
```

## Coding Conventions

- TypeScript strict mode, no `any` unless absolutely necessary
- Functional React components, PascalCase filenames for components
- Server Components by default; add `'use client'` only when needed (hooks, interactivity)
- NEVER make database calls in `'use client'` components — use server actions or server components
- No semicolons, single quotes, 2-space indent
- Prefer `Bun.file()` over `node:fs` for file I/O
- Use `import { test, expect } from "bun:test"` for tests
- Meaningful variable names — no `temp`, `data`, `result` without context

## Design System

- **Primary**: `#FF5A5F` (Airbnb red)
- **Dark text**: `#484848`
- **Secondary text**: `#767676`
- **Borders**: `#EBEBEB`
- **Background**: `#F7F7F7`
- **Brand name**: "OfferBnb" (not Airbnb)
- Use Tailwind classes, not inline styles
- Mobile-first responsive design

## Database

- All schema in `src/db/schema.ts` using Drizzle ORM `sqliteTable`
- Connection in `src/db/index.ts` using `drizzle(new Database("sqlite.db"))`
- When adding tables, add them to the schema file and create a migration with `bunx drizzle-kit generate`
- Push with `bun run db:push` (uses custom push script, NOT `drizzle-kit push`)

## Git Rules

- You are working on an `agent/*` branch — commit your work there
- Commit with descriptive messages: `feat:`, `fix:`, `chore:` prefixes
- Never commit `node_modules/`, `.next/`, `*.db`, `bun.lock`
- Never push to `main` or `master`
- Never force push

## Task Completion Criteria

A task is done when:
1. All described functionality is implemented
2. `bun run typecheck` passes with no errors
3. `bun test` passes with no failures
4. Only files relevant to the task are modified
5. No unnecessary abstractions or dead code

## Gotchas

- `drizzle-kit push` tries to use `better-sqlite3` which won't compile without Python — use the custom `src/db/push.ts` script instead
- Bun auto-loads `.env` — do NOT install or import `dotenv`
- SQLite `.db` files are gitignored — seed data must be reproducible via `bun run db:seed`
- Next.js Image component needs `images.remotePatterns` in `next.config.ts` for `picsum.photos`
- When creating new pages, ensure they have proper `export default` and metadata
