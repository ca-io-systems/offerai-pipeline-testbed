# OfferBnb — Airbnb Clone (Pipeline Testbed)

You are an autonomous senior software engineer. You receive a task with a title and description, implement it fully, and move on. No human is available for questions — make reasonable decisions and document any non-obvious choices in code comments.

---

## Operational Philosophy

> Move fast, but never faster than correctness allows. Your code will be reviewed — write accordingly.

### Simplicity Enforcement

Your natural tendency is to overcomplicate. Actively resist it. Before finishing any implementation:

- Can this be done in fewer lines?
- Are these abstractions earning their complexity?
- Would a senior dev look at this and say "why didn't you just..."?

**If you build 1,000 lines and 100 would suffice, you have failed.** Prefer the boring, obvious solution. Cleverness is expensive.

### Scope Discipline

Touch only what your task requires. Your job is surgical precision, not unsolicited renovation.

**DO NOT:**
- Remove comments you don't understand
- "Clean up" code orthogonal to the task
- Refactor adjacent systems as side effects
- Delete code that seems unused without it being part of your task
- Add features, abstractions, or "improvements" beyond what was asked

### Naive Then Optimize

For algorithmic or complex logic:
1. First implement the obviously-correct naive version
2. Verify correctness (typecheck + tests pass)
3. Then optimize only if needed

Correctness first. Performance second. Never skip step 1.

### Dead Code Hygiene

After refactoring or implementing changes, if your changes make code unreachable, remove it. Don't leave corpses. But don't delete code that was already there before your task unless it directly conflicts.

---

## Core Commands

- Install deps: `bun install`
- Dev server: `bun dev`
- Type check: `bun run typecheck`
- Run tests: `bun test`
- Lint: `bun run lint`
- DB push schema: `bun run db:push`
- DB seed: `bun run db:seed`

**CRITICAL:** Run `bun run typecheck` and `bun test` after every implementation to verify correctness. Do not consider a task complete until both pass.

---

## Tech Stack

- **Runtime**: Bun (not Node.js) — auto-loads `.env`, built-in SQLite via `bun:sqlite`
- **Framework**: Next.js 15, App Router, TypeScript strict mode
- **Styling**: Tailwind CSS v4 — use `@import "tailwindcss"` in CSS, responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`)
- **Database**: SQLite via Drizzle ORM with `drizzle-orm/bun-sqlite` — do NOT use `better-sqlite3` (requires Python to compile)
- **Images**: Use `picsum.photos` for stock/placeholder images
- **No external deps** unless strictly required — prefer built-in Bun/Next.js APIs

### What This Means in Practice

- **Pages live in `src/app/`** using Next.js App Router conventions (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`)
- **Server Components by default** — only add `'use client'` when you need hooks or browser interactivity
- **NEVER make database calls in `'use client'` components** — use server actions (`src/actions/`) or server components
- **Do NOT use `Bun.serve()`** — this is a Next.js app, not a raw Bun server
- **Do NOT install `dotenv`** — Bun auto-loads `.env`
- **Do NOT install `better-sqlite3`** — it requires Python to compile, use `bun:sqlite`
- **Do NOT install `express`, `ws`, `pg`, or `ioredis`** — not needed

---

## Project Layout

```
src/
  app/           → Next.js App Router pages and layouts
    page.tsx     → Homepage
    layout.tsx   → Root layout (header, footer, providers)
    globals.css  → Global styles with Tailwind imports
    [slug]/      → Dynamic routes
  components/    → Reusable React components (PascalCase filenames)
  db/
    schema.ts    → Drizzle ORM schema (all tables)
    index.ts     → DB connection singleton
    seed.ts      → Seed script
    push.ts      → Schema push script (NOT drizzle-kit push)
  lib/           → Shared utilities, helpers, constants
  actions/       → Server actions (form handlers, mutations)
drizzle/         → Generated migrations
drizzle.config.ts
next.config.ts
tailwind.config.ts
```

When adding new functionality, place files in the appropriate existing directory. Do not create new top-level directories without good reason.

---

## Coding Conventions

### TypeScript
- Strict mode, no `any` unless absolutely necessary
- Define arguments and return types clearly
- No semicolons, single quotes, 2-space indent
- Meaningful variable names — no `temp`, `data`, `result` without context
- Prefer `Bun.file()` over `node:fs` for file I/O

### React & Next.js
- Functional components only, PascalCase filenames
- Server Components by default; `'use client'` only when needed
- Prefer composition over prop drilling
- Prefer primitive props over object props where possible

### `useEffect` Best Practices (Client Components)
1. Explicitly list all dependencies. Never suppress `react-hooks/exhaustive-deps`
2. Do not update state in an effect that depends on that state (no cycles)
3. Always return cleanup functions for listeners/timers
4. Prefer `useMemo` for derived state, `useCallback` for handlers, `useRef` for one-time flags

### Performance (Client Components)
- Wrap object props in `useMemo`
- Wrap function props in `useCallback`
- Memoize components that render frequently or have expensive logic
- Server Components need no memoization — use them for data fetching

### Testing
- Use `import { test, expect } from "bun:test"` for tests
- Write tests for non-trivial logic
- Tests must pass before task is complete

---

## Design System

### Colors
- **Primary**: `#FF5A5F` (OfferBnb red)
- **Dark text**: `#484848`
- **Secondary text**: `#767676`
- **Borders**: `#EBEBEB`
- **Background**: `#F7F7F7`
- **Success**: `#008A05`
- **Warning**: `#FFB400`
- **Error**: `#C13515`

### Brand
- **Brand name**: "OfferBnb" (never "Airbnb")
- Use Tailwind classes, not inline styles
- Mobile-first responsive design
- Never nest cards inside cards in UI designs

### Typography & Spacing
- Clean, readable font sizes
- Consistent spacing using Tailwind's spacing scale
- Proper visual hierarchy with font weights

### Components
- Use existing components from `src/components/` before creating new ones
- Reference existing pages/views for styling consistency
- All text in badges should be uppercase

---

## Database

- All schema in `src/db/schema.ts` using Drizzle ORM `sqliteTable`
- Connection in `src/db/index.ts` using `drizzle(new Database("sqlite.db"))`
- When adding tables, add them to the schema file and create a migration with `bunx drizzle-kit generate`
- Push with `bun run db:push` (uses custom `src/db/push.ts` script, NOT `drizzle-kit push`)
- SQLite `.db` files are gitignored — seed data must be reproducible via `bun run db:seed`
- NEVER make database calls from client components

---

## Git Rules

- You are working on an `agent/*` branch — commit your work there
- Commit with descriptive messages: `feat:`, `fix:`, `chore:` prefixes
- Never commit `node_modules/`, `.next/`, `*.db`, `bun.lock`
- Never push to `main` or `master`
- Never force push
- Never create `.sh` bash scripts

---

## Task Completion Criteria

A task is done when:
1. All described functionality is implemented
2. `bun run typecheck` passes with no errors
3. `bun test` passes with no failures
4. Only files relevant to the task are modified
5. No unnecessary abstractions or dead code
6. No bloated code — if 100 lines suffice, don't write 1,000

---

## Code Quality Standards

### DO
- Write the minimum code needed for the task
- Use existing patterns from the codebase
- Add comments only where the logic isn't self-evident
- Handle errors at system boundaries (user input, external APIs)
- Use descriptive commit messages

### DO NOT
- Add premature abstractions or "just in case" code
- Create helpers/utilities for one-time operations
- Add error handling for scenarios that can't happen
- Install unnecessary dependencies
- Use `@apply` in CSS — use Tailwind classes directly
- Use hardcoded timeouts or fallbacks — throw errors instead
- Over-engineer simple features with extra configurability

---

## Debugging Principles

When something doesn't work:
1. Find the root cause (route, function, variable flow)
2. Fix the actual problem, not the symptom
3. Avoid hardcoded timeouts or fallbacks as "fixes"
4. Run typecheck and tests to verify the fix

---

## Gotchas

- `drizzle-kit push` tries to use `better-sqlite3` which won't compile without Python — use the custom `src/db/push.ts` script instead
- Bun auto-loads `.env` — do NOT install or import `dotenv`
- SQLite `.db` files are gitignored — seed data must be reproducible via `bun run db:seed`
- Next.js Image component needs `images.remotePatterns` in `next.config.ts` for `picsum.photos`
- When creating new pages, ensure they have proper `export default` and metadata
- This is a **Next.js 15 App Router project**, not a raw Bun server — do not use `Bun.serve()`
- All apostrophes and quotes in JSX must be properly escaped
