/*
 * 与 @a2ui/web_core v0.9 expression_parser 行为对齐的精简实现，供 Umi Webpack 4 等旧链路使用。
 * 官方包源码含 static 块等语法，不经 babel 转译 node_modules 时会解析失败。
 * 逻辑来源：node_modules/@a2ui/web_core/src/v0_9/basic_catalog/expressions/expression_parser.js
 * SPDX-License-Identifier: Apache-2.0
 */

const MAX_DEPTH = 10;

class A2uiExpressionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'A2uiExpressionError';
  }
}

class Scanner {
  input: string;

  pos = 0;

  constructor(input: string) {
    this.input = input;
  }

  isAtEnd(): boolean {
    return this.pos >= this.input.length;
  }

  peek(offset = 0): string {
    if (this.pos + offset >= this.input.length) return '\0';
    return this.input[this.pos + offset]!;
  }

  advance(count = 1): string {
    const char = this.input.substring(this.pos, this.pos + count);
    this.pos += count;
    return char;
  }

  match(expected: string): boolean {
    if (this.peek() === expected) {
      this.advance();
      return true;
    }
    return false;
  }

  matches(expected: string): boolean {
    return this.input.startsWith(expected, this.pos);
  }

  matchesString(expected: string): boolean {
    return this.peek() === expected;
  }

  matchesKeyword(keyword: string): boolean {
    if (this.input.startsWith(keyword, this.pos)) {
      const next = this.peek(keyword.length);
      if (!/[a-zA-Z0-9_]/.test(next)) {
        this.advance(keyword.length);
        return true;
      }
    }
    return false;
  }

  skipWhitespace(): void {
    while (!this.isAtEnd() && /\s/.test(this.peek())) {
      this.advance();
    }
  }
}

/** 与官方 ExpressionParser.parse 输出结构一致，用于 v0.9 插值检测 */
export class ExpressionParser {
  parse(input: string, depth = 0): unknown[] {
    if (depth > MAX_DEPTH) {
      throw new A2uiExpressionError('Max recursion depth reached in parse');
    }
    if (!input || !input.includes('${')) {
      return [input];
    }
    const parts: unknown[] = [];
    const scanner = new Scanner(input);
    while (!scanner.isAtEnd()) {
      if (scanner.matches('${')) {
        scanner.advance(2);
        const content = this.extractInterpolationContent(scanner);
        const parsed = this.parseExpression(content, depth + 1);
        if (parsed !== null) {
          parts.push(parsed);
        }
      } else if (scanner.peek() === '\\' && scanner.peek(1) === '$' && scanner.peek(2) === '{') {
        scanner.advance();
        parts.push('${');
        scanner.advance(2);
      } else {
        const start = scanner.pos;
        while (!scanner.isAtEnd()) {
          if (scanner.matches('${')) {
            break;
          }
          if (scanner.peek() === '\\' && scanner.peek(1) === '$' && scanner.peek(2) === '{') {
            break;
          }
          scanner.advance();
        }
        parts.push(scanner.input.substring(start, scanner.pos));
      }
    }
    return parts.filter((p) => p !== null && p !== '');
  }

  extractInterpolationContent(scanner: Scanner): string {
    const start = scanner.pos;
    let braceBalance = 1;
    while (!scanner.isAtEnd() && braceBalance > 0) {
      const char = scanner.advance();
      if (char === '{') {
        braceBalance += 1;
      } else if (char === '}') {
        braceBalance -= 1;
      } else if (char === "'" || char === '"') {
        const quote = char;
        while (!scanner.isAtEnd()) {
          const c = scanner.advance();
          if (c === '\\') {
            scanner.advance();
          } else if (c === quote) {
            break;
          }
        }
      }
    }
    if (braceBalance > 0) {
      throw new A2uiExpressionError("Unclosed interpolation: missing '}'");
    }
    return scanner.input.substring(start, scanner.pos - 1);
  }

  parseExpression(expr: string, depth = 0): unknown {
    const trimmed = expr.trim();
    if (!trimmed) return '';
    const scanner = new Scanner(trimmed);
    const result = this.parseExpressionInternal(scanner, depth);
    if (!scanner.isAtEnd()) {
      throw new A2uiExpressionError(
        `Unexpected characters at end of expression: '${scanner.input.substring(scanner.pos)}'`,
      );
    }
    return result;
  }

  parseExpressionInternal(scanner: Scanner, depth: number): unknown {
    scanner.skipWhitespace();
    if (scanner.isAtEnd()) return '';
    if (scanner.matches('${')) {
      scanner.advance(2);
      const content = this.extractInterpolationContent(scanner);
      return this.parseExpression(content, depth + 1);
    }
    if (scanner.matchesString("'") || scanner.matchesString('"')) {
      return this.parseStringLiteral(scanner);
    }
    if (this.isDigit(scanner.peek())) {
      return this.parseNumberLiteral(scanner);
    }
    if (scanner.matchesKeyword('true')) return true;
    if (scanner.matchesKeyword('false')) return false;
    if (scanner.matchesKeyword('null')) return '';
    const token = this.scanPathOrIdentifier(scanner);
    scanner.skipWhitespace();
    if (scanner.peek() === '(') {
      return this.parseFunctionCall(token, scanner, depth);
    }
    if (!token) {
      return '';
    }
    return { path: token };
  }

  scanPathOrIdentifier(scanner: Scanner): string {
    const start = scanner.pos;
    while (!scanner.isAtEnd()) {
      const c = scanner.peek();
      if (this.isAlnum(c) || c === '/' || c === '.' || c === '_' || c === '-') {
        scanner.advance();
      } else {
        break;
      }
    }
    return scanner.input.substring(start, scanner.pos);
  }

  parseFunctionCall(funcName: string, scanner: Scanner, depth: number): Record<string, unknown> {
    scanner.match('(');
    scanner.skipWhitespace();
    const args: Record<string, unknown> = {};
    while (!scanner.isAtEnd() && scanner.peek() !== ')') {
      const argName = this.scanIdentifier(scanner);
      scanner.skipWhitespace();
      if (!scanner.match(':')) {
        throw new A2uiExpressionError(`Expected ':' after argument name '${argName}' in function '${funcName}'`);
      }
      scanner.skipWhitespace();
      args[argName] = this.parseExpressionInternal(scanner, depth);
      scanner.skipWhitespace();
      if (scanner.peek() === ',') {
        scanner.advance();
        scanner.skipWhitespace();
      }
    }
    if (!scanner.match(')')) {
      throw new A2uiExpressionError(`Expected ')' after function arguments for '${funcName}'`);
    }
    return { call: funcName, args, returnType: 'any' };
  }

  scanIdentifier(scanner: Scanner): string {
    const start = scanner.pos;
    while (!scanner.isAtEnd() && (this.isAlnum(scanner.peek()) || scanner.peek() === '_')) {
      scanner.advance();
    }
    return scanner.input.substring(start, scanner.pos);
  }

  parseStringLiteral(scanner: Scanner): string {
    const quote = scanner.advance();
    let result = '';
    while (!scanner.isAtEnd()) {
      const c = scanner.advance();
      if (c === '\\') {
        const next = scanner.advance();
        if (next === 'n') result += '\n';
        else if (next === 't') result += '\t';
        else if (next === 'r') result += '\r';
        else result += next;
      } else if (c === quote) {
        break;
      } else {
        result += c;
      }
    }
    return result;
  }

  parseNumberLiteral(scanner: Scanner): number {
    const start = scanner.pos;
    while (!scanner.isAtEnd() && (this.isDigit(scanner.peek()) || scanner.peek() === '.')) {
      scanner.advance();
    }
    return Number(scanner.input.substring(start, scanner.pos));
  }

  isAlnum(c: string): boolean {
    return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || (c >= '0' && c <= '9');
  }

  isDigit(c: string): boolean {
    return c >= '0' && c <= '9';
  }
}
