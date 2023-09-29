/**
 * 定义抽象语法树的结构
 * program: 源程序
 * statement： 没有返回值的声明
 * expression：表达式
 */

export interface Program extends Stmt {
  kind: 'Program';
  body: Stmt[];
}

export interface Stmt {
  kind: NodeType;
}

export type NodeType =
  | 'Program'
  | 'NumericLiteral'
  | 'Identifier'
  | 'Keyword'
  | 'BinaryExpr';

export interface Expr extends Stmt {}

// 四则运算表达式
export interface BinaryExpr extends Expr {
  kind: 'BinaryExpr';
  left: Expr;
  right: Expr;
  operator: string; // 操作符 + - * /
}

// 标识符表达式
export interface Identifier extends Expr {
  kind: 'Identifier';
  symbol: string;
  expression: BinaryExpr;
}

export interface Keyword extends Expr {
  kind: 'Keyword';
  symbol: string;
  identifier: Identifier;
}

// 字面量表达式
export interface NumericLiteral extends Expr {
  kind: 'NumericLiteral';
  value: number;
}
