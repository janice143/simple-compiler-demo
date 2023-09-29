// 词法分析：仅支持四则运算，例如 const x = 5 + (7 - 4)
// 将源代码转换成token流: [BOF, const, x, =, 5, +, (, 7, -, 4, ), EOF]

export enum TokenType {
  Const,
  Identifier,
  Equals,
  Semicolon,
  BinaryOperator,
  Number,
  OpenParen,
  CloseParen,
  EOF
}

export interface Token {
  value: string;
  type: TokenType;
}

const KEYWORDS: Record<string, TokenType> = {
  const: TokenType.Const
};

function token({ value, type }: Token) {
  return { value, type };
}

export function tokenize(s: string): Token[] {
  const tokens = new Array<Token>();
  let pos = 0;
  let value = '';
  let type = TokenType.EOF;

  function scan() {
    // 去掉空白字符
    scanForward((c) => /[ \t\b\n]/.test(c));

    const start = pos;
    if (pos === s.length) {
      type = TokenType.EOF;
      pos++;
    }
    // 判断数字字面量
    else if (/[0-9]/.test(s.charAt(pos))) {
      scanForward((c) => /[0-9]/.test(c));
      type = TokenType.Number;
    }
    // 判断标识符和关键字
    else if (/[_a-zA-Z]/.test(s.charAt(pos))) {
      scanForward((c) => /[_a-zA-Z]/.test(c));
      const value = s.slice(start, pos);
      type =
        value in KEYWORDS
          ? KEYWORDS[value as keyof typeof KEYWORDS]
          : TokenType.Identifier;
    }
    // 判断运算符和其他符号：+，-，*，/，=，；
    else {
      switch (s.charAt(pos)) {
        case '=':
          type = TokenType.Equals;
          break;
        case ';':
          type = TokenType.Semicolon;
          break;
        case '(':
          type = TokenType.OpenParen;
          break;
        case ')':
          type = TokenType.CloseParen;
          break;
        case '+':
          type = TokenType.BinaryOperator;
          break;
        case '-':
          type = TokenType.BinaryOperator;
          break;
        case '*':
          type = TokenType.BinaryOperator;
          break;
        case '/':
          type = TokenType.BinaryOperator;
          break;
        default:
          break;
      }
      pos++;
    }
    value = s.slice(start, pos);
    tokens.push(token({ value, type }));
  }

  function scanForward(pred: (x: string) => boolean) {
    while (pos < s.length && pred(s.charAt(pos))) pos++;
  }

  while (pos <= s.length) {
    scan();
  }
  return tokens;
}
