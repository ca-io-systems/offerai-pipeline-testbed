---
name: pr-creation
description: Prepare changes for a pull request. Use after completing a coding task to stage, commit, and ensure the branch is ready for PR creation. Follow conventional commit format.
---

# Skill: PR Preparation

## Purpose

Stage and commit completed work following project conventions, ensuring the branch is clean and ready for pull request creation.

## Conventions

- **Commit format**: `[agent] <task title>`
- **Branch naming**: `agent/<task-id-prefix>-<slugified-title>`
- **Only commit relevant files**: Never commit generated files, node_modules, or .env

## Required behavior

1. Run `git diff --stat` to review all changes.
2. Verify only task-relevant files are modified.
3. Stage files with `git add` (specific files, not `git add -A`).
4. Commit with the conventional format.
5. Verify the commit with `git log -1 --stat`.

## Safety

- Never commit `.env`, credentials, or secrets.
- Never force-push.
- Never commit to `main`, `master`, or `develop` directly.
- If unexpected files are modified, stop and report.

## Verification

```bash
git status
git log -1 --stat
bun test
```

Complete when the branch has a clean commit with only task-relevant changes.
