import { test, expect } from "bun:test";
import { evaluate, convert, CalcHistory } from "./calc";

test("basic addition", () => {
  expect(evaluate("2 + 3")).toBe(5);
});

test("basic subtraction", () => {
  expect(evaluate("10 - 4")).toBe(6);
});

test("basic multiplication", () => {
  expect(evaluate("6 * 7")).toBe(42);
});

test("basic division", () => {
  expect(evaluate("20 / 4")).toBe(5);
});

test("operator precedence", () => {
  expect(evaluate("2 + 3 * 4")).toBe(14);
  expect(evaluate("10 - 2 * 3")).toBe(4);
});

test("parentheses", () => {
  expect(evaluate("(2 + 3) * 4")).toBe(20);
  expect(evaluate("2 * (3 + 4)")).toBe(14);
});

test("division by zero throws", () => {
  expect(() => evaluate("5 / 0")).toThrow("Division by zero");
});

test("exponents", () => {
  expect(evaluate("2 ** 3")).toBe(8);
  expect(evaluate("3 ** 2")).toBe(9);
  expect(evaluate("2 ** 3 ** 2")).toBe(512);
});

test("convert km to miles", () => {
  expect(convert(1, "km", "miles")).toBeCloseTo(0.621371, 5);
});

test("convert miles to km", () => {
  expect(convert(1, "miles", "km")).toBeCloseTo(1.60934, 5);
});

test("convert kg to lbs", () => {
  expect(convert(1, "kg", "lbs")).toBeCloseTo(2.20462, 5);
});

test("convert lbs to kg", () => {
  expect(convert(1, "lbs", "kg")).toBeCloseTo(0.453592, 5);
});

test("convert C to F", () => {
  expect(convert(0, "C", "F")).toBe(32);
  expect(convert(100, "C", "F")).toBe(212);
});

test("convert F to C", () => {
  expect(convert(32, "F", "C")).toBe(0);
  expect(convert(212, "F", "C")).toBeCloseTo(100, 5);
});

test("convert liters to gallons", () => {
  expect(convert(1, "liters", "gallons")).toBeCloseTo(0.264172, 5);
});

test("convert gallons to liters", () => {
  expect(convert(1, "gallons", "liters")).toBeCloseTo(3.78541, 5);
});

test("CalcHistory add and list", () => {
  const history = new CalcHistory();
  history.add("2 + 2", 4);
  history.add("3 * 3", 9);
  const entries = history.list();
  expect(entries.length).toBe(2);
  expect(entries[0].expr).toBe("2 + 2");
  expect(entries[0].result).toBe(4);
  expect(entries[1].expr).toBe("3 * 3");
  expect(entries[1].result).toBe(9);
});

test("CalcHistory clear", () => {
  const history = new CalcHistory();
  history.add("1 + 1", 2);
  history.add("2 + 2", 4);
  expect(history.list().length).toBe(2);
  history.clear();
  expect(history.list().length).toBe(0);
});

test("CalcHistory limits to 50 entries", () => {
  const history = new CalcHistory();
  for (let i = 0; i < 60; i++) {
    history.add(`${i} + 1`, i + 1);
  }
  const entries = history.list();
  expect(entries.length).toBe(50);
  expect(entries[0].expr).toBe("10 + 1");
  expect(entries[49].expr).toBe("59 + 1");
});
