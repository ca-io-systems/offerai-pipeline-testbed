---
name: coding-task
description: Implement a coding task from the OfferAI pipeline. Use when given a task with a title, description, and acceptance criteria that requires code changes. Follow the conventions of this TypeScript/Bun codebase.
---

# Skill: Coding Task Implementation

## Purpose

Implement a coding task from the OfferAI Agent Pipeline, following codebase conventions and ensuring all acceptance criteria are met.

## When to use this skill

- You receive a task with a title, description, and acceptance criteria.
- The task requires creating or modifying TypeScript source files.
- The changes should be minimal and focused on the task requirements.

## Conventions

- **Runtime**: Bun (not Node.js)
- **Language**: TypeScript (strict mode)
- **Testing**: `bun:test` — use `import { test, expect } from "bun:test"`
- **No dotenv**: Bun auto-loads `.env`
- **Minimal changes**: Only edit files directly related to the task
- **No unnecessary comments or docs**: Code should be self-documenting

## Required behavior

1. Read the existing code to understand the codebase structure.
2. Implement the minimum changes needed to satisfy all acceptance criteria.
3. Ensure type safety — no `any` types unless absolutely necessary.
4. Do NOT add extra features, refactors, or improvements beyond the task scope.
5. Do NOT modify unrelated files.

## Verification

After implementation, run:

```bash
bun run typecheck
bun test
```

The task is complete when:
- All acceptance criteria are met.
- `bun run typecheck` passes with no errors.
- `bun test` passes with no failures.
- Only files relevant to the task are modified.

## Safety

- Never delete existing code unless explicitly asked.
- Never modify package.json unless the task requires new dependencies.
- If a task is ambiguous, implement the simplest reasonable interpretation.
