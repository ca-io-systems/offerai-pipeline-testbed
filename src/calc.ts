type Token = { type: "number"; value: number } | { type: "operator"; value: string } | { type: "paren"; value: string };

function tokenize(expr: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < expr.length) {
    const char = expr[i];
    if (/\s/.test(char)) {
      i++;
      continue;
    }
    if (/\d/.test(char) || (char === "." && i + 1 < expr.length && /\d/.test(expr[i + 1]))) {
      let numStr = "";
      while (i < expr.length && (/\d/.test(expr[i]) || expr[i] === ".")) {
        numStr += expr[i];
        i++;
      }
      tokens.push({ type: "number", value: parseFloat(numStr) });
      continue;
    }
    if (char === "+" || char === "-" || char === "/") {
      tokens.push({ type: "operator", value: char });
      i++;
      continue;
    }
    if (char === "(" || char === ")") {
      tokens.push({ type: "paren", value: char });
      i++;
      continue;
    }
    if (char === "*") {
      if (i + 1 < expr.length && expr[i + 1] === "*") {
        tokens.push({ type: "operator", value: "**" });
        i += 2;
      } else {
        tokens.push({ type: "operator", value: "*" });
        i++;
      }
      continue;
    }
    throw new Error(`Unexpected character: ${char}`);
  }
  return tokens;
}

function getPrecedence(op: string): number {
  switch (op) {
    case "+":
    case "-":
      return 1;
    case "*":
    case "/":
      return 2;
    case "**":
      return 3;
    default:
      return 0;
  }
}

function isRightAssociative(op: string): boolean {
  return op === "**";
}

function toPostfix(tokens: Token[]): Token[] {
  const output: Token[] = [];
  const operators: Token[] = [];

  for (const token of tokens) {
    if (token.type === "number") {
      output.push(token);
    } else if (token.type === "operator") {
      while (operators.length > 0) {
        const top = operators[operators.length - 1];
        if (top.type === "paren") break;
        if (top.type === "operator") {
          const topPrec = getPrecedence(top.value);
          const currPrec = getPrecedence(token.value);
          if (topPrec > currPrec || (topPrec === currPrec && !isRightAssociative(token.value))) {
            output.push(operators.pop()!);
          } else {
            break;
          }
        }
      }
      operators.push(token);
    } else if (token.type === "paren") {
      if (token.value === "(") {
        operators.push(token);
      } else {
        while (operators.length > 0) {
          const top = operators.pop()!;
          if (top.type === "paren" && top.value === "(") {
            break;
          }
          output.push(top);
        }
      }
    }
  }

  while (operators.length > 0) {
    output.push(operators.pop()!);
  }

  return output;
}

function evaluatePostfix(tokens: Token[]): number {
  const stack: number[] = [];

  for (const token of tokens) {
    if (token.type === "number") {
      stack.push(token.value);
    } else if (token.type === "operator") {
      const b = stack.pop()!;
      const a = stack.pop()!;
      let result: number;
      switch (token.value) {
        case "+":
          result = a + b;
          break;
        case "-":
          result = a - b;
          break;
        case "*":
          result = a * b;
          break;
        case "/":
          if (b === 0) {
            throw new Error("Division by zero");
          }
          result = a / b;
          break;
        case "**":
          result = Math.pow(a, b);
          break;
        default:
          throw new Error(`Unknown operator: ${token.value}`);
      }
      stack.push(result);
    }
  }

  return stack[0];
}

export function evaluate(expr: string): number {
  const tokens = tokenize(expr);
  const postfix = toPostfix(tokens);
  return evaluatePostfix(postfix);
}

const conversionFactors: Record<string, Record<string, (v: number) => number>> = {
  km: {
    miles: (v) => v * 0.621371,
  },
  miles: {
    km: (v) => v * 1.60934,
  },
  kg: {
    lbs: (v) => v * 2.20462,
  },
  lbs: {
    kg: (v) => v * 0.453592,
  },
  C: {
    F: (v) => v * (9 / 5) + 32,
  },
  F: {
    C: (v) => (v - 32) * (5 / 9),
  },
  liters: {
    gallons: (v) => v * 0.264172,
  },
  gallons: {
    liters: (v) => v * 3.78541,
  },
};

export function convert(value: number, from: string, to: string): number {
  if (from === to) return value;
  const fromConversions = conversionFactors[from];
  if (!fromConversions || !fromConversions[to]) {
    throw new Error(`Cannot convert from ${from} to ${to}`);
  }
  return fromConversions[to](value);
}

interface HistoryEntry {
  expr: string;
  result: number;
  timestamp: Date;
}

export class CalcHistory {
  private entries: HistoryEntry[] = [];
  private maxEntries = 50;

  add(expr: string, result: number): void {
    this.entries.push({ expr, result, timestamp: new Date() });
    if (this.entries.length > this.maxEntries) {
      this.entries.shift();
    }
  }

  list(): HistoryEntry[] {
    return [...this.entries];
  }

  clear(): void {
    this.entries = [];
  }
}
