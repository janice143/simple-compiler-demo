/**
 * 语法分析：将Token流转换为抽象语法树
 *
 */
import {
  Program,
  Stmt,
  Expr,
  BinaryExpr,
  Identifier,
  NumericLiteral,
  Keyword
} from './ast.ts';
import { Token, TokenType } from './lexer.ts';

export function parse(tokens: Token[]): Program {
  return produceAST();

  function produceAST() {
    const program: Program = {
      kind: 'Program',
      body: []
    };
    while (isNotEOF()) {
      program.body.push(parseStmt());
    }
    return program;
  }

  function isNotEOF(): boolean {
    return tokens[0].type !== TokenType.EOF;
  }

  function parseStmt(): Stmt {
    return parseExpr();
  }

  function parseExpr(): Expr {
    if (tryParseTokenType(TokenType.Const)) {
      return parseKeywordExpr();
    } else if (tryParseTokenType(TokenType.Identifier)) {
      return parseIdentifierExpr();
    }
    return parseAdditiveExpr();
  }

  function parseKeywordExpr() {
    const keyword = parsePrimaryExpr() as Keyword;
    keyword.identifier = parseIdentifierExpr();
    return keyword;
  }

  function parseIdentifierExpr(): Identifier {
    const identifierToken = expect(
      TokenType.Identifier,
      'Unexpected token found after the keyword const. Expect identifier'
    );
    expect(
      TokenType.Equals,
      'Unexpected token found after the identifier. Expect equals ='
    );
    return {
      kind: 'Identifier',
      symbol: identifierToken.value,
      expression: parseAdditiveExpr()
    };
  }

  function tryParseTokenType(expected: TokenType) {
    const ok = getCurToken().type === expected;
    return ok;
  }

  function tryParseTokenValue(expected: Token['value']) {
    const ok = getCurToken().value === expected;
    return ok;
  }

  function parseAdditiveExpr(): BinaryExpr {
    let left = parseMultiplicativeExpr();
    while (tryParseTokenValue('+') || tryParseTokenValue('-')) {
      const operator = eatCurToken().value;
      const right = parseMultiplicativeExpr();
      left = {
        kind: 'BinaryExpr',
        left,
        right,
        operator
      } as BinaryExpr;
    }
    return left;
  }

  function parseMultiplicativeExpr(): BinaryExpr {
    let left = parsePrimaryExpr() as Expr;

    while (tryParseTokenValue('/') || tryParseTokenValue('*')) {
      const operator = eatCurToken().value;
      const right = parsePrimaryExpr();
      left = {
        kind: 'BinaryExpr',
        left,
        right,
        operator
      } as BinaryExpr;
    }
    return left as BinaryExpr;
  }

  function parsePrimaryExpr() {
    const type = getCurToken().type;

    switch (type) {
      case TokenType.Const: {
        const value = eatCurToken().value;
        return {
          kind: 'Keyword',
          symbol: value
        } as Keyword;
      }

      case TokenType.Identifier:
        return {
          kind: 'Identifier',
          symbol: eatCurToken().value
        } as Identifier;

      case TokenType.Number:
        return {
          kind: 'NumericLiteral',
          value: parseFloat(eatCurToken().value)
        } as NumericLiteral;

      case TokenType.OpenParen: {
        eatCurToken();
        const value = parseExpr();
        expect(
          TokenType.CloseParen,
          'Unexpected token found inside parenthesised expression. Expected closing parenthesis.'
        );
        return value;
      }
      default:
        console.error('Unexpected token found during parsing!', getCurToken());
        Deno.exit(1);
    }
  }

  function expect(type: TokenType, err: string) {
    const prev = eatCurToken();
    if (!prev || prev.type !== type) {
      console.error('Parser Error:\n', err, prev, ' - Expecting: ', type);
      Deno.exit(1);
    }
    return prev;
  }

  function getCurToken(): Token {
    return tokens[0];
  }

  function eatCurToken(): Token {
    return tokens.shift() as Token;
  }
}
