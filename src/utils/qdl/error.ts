import { E_ERROR_CODES, TLexicalToken } from './types';

export class LexicalError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LexicalError';
  }
}

export class SyntaxError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SyntaxError';
  }
}

export class FilterError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FilterError';
  }
}

export const DQLError = (code: E_ERROR_CODES, message: string): never => {
  switch (code) {
    case E_ERROR_CODES.LEXICAL_ERROR:
      throw new LexicalError(message);
    case E_ERROR_CODES.SYNTAX_ERROR:
      throw new SyntaxError(message);
    case E_ERROR_CODES.FILTER_ERROR:
      throw new FilterError(message);
    default:
      throw new Error(message);
  }
};

export const DQLUnexpectedSyntaxTokenError = (token: TLexicalToken): never => {
  throw new SyntaxError(
    `Unexpected token: "${token.value}" [${token.type}] at line ${token.line}:${token.column}`,
  );
};
