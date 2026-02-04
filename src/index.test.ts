import { expect, test } from "bun:test";

import { greet } from "./index";

test("greet returns the expected greeting", () => {
	expect(greet("World")).toBe("Hello, World!");
});
