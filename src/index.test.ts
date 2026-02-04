import { expect, test } from "bun:test";

import { greet } from "./index";

test("greet(\"World\") returns \"Hello, World!\"", () => {
  expect(greet("World")).toBe("Hello, World!");
});
