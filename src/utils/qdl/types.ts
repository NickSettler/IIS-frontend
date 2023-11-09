export const enum E_ERROR_CODES {
  LEXICAL_ERROR = 1,
  SYNTAX_ERROR = 2,
  FILTER_ERROR = 3,
}

export const enum E_SYNTAX_TREE_TRAVERSE_ORDER {
  PRE_ORDER = 'PRE_ORDER',
  IN_ORDER = 'IN_ORDER',
  POST_ORDER = 'POST_ORDER',
}

export const enum E_TOKEN_TYPE {
  // Common tokens
  IDENTIFIER = 'IDENTIFIER',
  NUMBER_LITERAL = 'NUMBER_LITERAL',
  STRING_LITERAL = 'STRING_LITERAL',
  BOOLEAN_LITERAL = 'BOOLEAN_LITERAL',
  AND_OPERATOR = 'AND_OPERATOR',
  OR_OPERATOR = 'OR_OPERATOR',
  PLUS = 'PLUS',
  MINUS = 'MINUS',
  MULTIPLY = 'MULTIPLY',
  DIVIDE = 'DIVIDE',
  INT_DIVIDE = 'INT_DIVIDE',
  MODULO = 'MODULO',
  POWER = 'POWER',
  EQUAL = 'EQUAL',
  NOT_EQUAL = 'NOT_EQUAL',
  GREATER_THAN = 'GREATER_THAN',
  GREATER_THAN_OR_EQUAL = 'GREATER_THAN_OR_EQUAL',
  LESS_THAN = 'LESS_THAN',
  LESS_THAN_OR_EQUAL = 'LESS_THAN_OR_EQUAL',
  CONTAINS = 'CONTAINS',

  // Lexical tokens
  EOF = 'EOF',
  OPEN_PAREN = 'OPEN_PAREN',
  CLOSE_PAREN = 'CLOSE_PAREN',

  // Syntax tokens
  NODE = 'NODE',

  // Filter tokens
  RESULT = 'RESULT',
}

export const enum E_LEXER_STATE {
  START = 'START',
  NUMBER_LITERAL = 'NUMBER_LITERAL',
  STRING_LITERAL = 'STRING_LITERAL',
  KEYWORD_STATE = 'KEYWORD_STATE',
  IDENTIFIER_STATE = 'IDENTIFIER_STATE',
  OPERATOR_STATE = 'OPERATOR_STATE',
}

export type TLexicalToken = {
  type: E_TOKEN_TYPE;
  value: string;
  line: number;
  column: number;
  width: number;
};
export type TSyntaxTokenAttribute = {
  type: E_TOKEN_TYPE;
  isRightAssociative: boolean;
  isBinary: boolean;
  isUnary: boolean;
  precedence: number;
};
