---
name: testing
description: Write or update tests for this codebase. Use when the task requires adding unit tests, integration tests, or test coverage improvements. Tests use bun:test.
---

# Skill: Testing

## Purpose

Write or update tests using Bun's built-in test runner to verify code behavior and ensure acceptance criteria are met.

## Conventions

- **Test framework**: `bun:test`
- **Import pattern**: `import { test, expect, describe, beforeEach, afterEach } from "bun:test"`
- **File naming**: `*.test.ts` co-located with source or in `__tests__/` directory
- **Run tests**: `bun test`

## Required behavior

1. Write tests that directly verify the acceptance criteria.
2. Cover the happy path and at least one edge case.
3. Keep tests focused — one assertion per test when possible.
4. Use descriptive test names that explain the expected behavior.
5. Do NOT mock unless the dependency is external (network, filesystem).

## Test structure

```typescript
import { test, expect, describe } from "bun:test";

describe("feature name", () => {
  test("should do the expected thing", () => {
    const result = myFunction("input");
    expect(result).toBe("expected output");
  });

  test("should handle edge case", () => {
    expect(() => myFunction("")).toThrow();
  });
});
```

## Verification

```bash
bun test
```

Complete when all tests pass and cover the acceptance criteria.
