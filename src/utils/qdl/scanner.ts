import {
  E_ERROR_CODES,
  E_LEXER_STATE,
  E_TOKEN_TYPE,
  TLexicalToken,
} from './types';
import { DQLError } from './error';

export default class Scanner {
  private static readonly LEXER_KEYWORDS_MAP: Record<string, E_TOKEN_TYPE> = {
    and: E_TOKEN_TYPE.AND_OPERATOR,
    or: E_TOKEN_TYPE.OR_OPERATOR,
    true: E_TOKEN_TYPE.BOOLEAN_LITERAL,
    false: E_TOKEN_TYPE.BOOLEAN_LITERAL,
  };

  private static readonly LEXER_OPERATORS_MAP: Record<string, E_TOKEN_TYPE> = {
    '+': E_TOKEN_TYPE.PLUS,
    '-': E_TOKEN_TYPE.MINUS,
    '*': E_TOKEN_TYPE.MULTIPLY,
    '/': E_TOKEN_TYPE.DIVIDE,
    '//': E_TOKEN_TYPE.INT_DIVIDE,
    '%': E_TOKEN_TYPE.MODULO,
    '**': E_TOKEN_TYPE.POWER,
    '^': E_TOKEN_TYPE.POWER,
    '==': E_TOKEN_TYPE.EQUAL,
    '!=': E_TOKEN_TYPE.NOT_EQUAL,
    '>': E_TOKEN_TYPE.GREATER_THAN,
    '>=': E_TOKEN_TYPE.GREATER_THAN_OR_EQUAL,
    '<': E_TOKEN_TYPE.LESS_THAN,
    '<=': E_TOKEN_TYPE.LESS_THAN_OR_EQUAL,
    '~': E_TOKEN_TYPE.CONTAINS,
  };

  private _currentIndex = 0;

  private _state: E_LEXER_STATE = E_LEXER_STATE.START;

  constructor(private readonly input: string) {}

  public getNextToken(): TLexicalToken {
    let currentChar = this.input[this._currentIndex];
    const token: TLexicalToken = {
      type: E_TOKEN_TYPE.EOF,
      value: '',
      line: 0,
      column: 0,
      width: 0,
    };

    while (currentChar !== undefined) {
      currentChar = this.input[this._currentIndex];
      this._currentIndex++;

      switch (this._state) {
        case E_LEXER_STATE.START:
          switch (currentChar) {
            case ' ':
            case '\t':
            case '\n':
            case '\r':
              break;
            case '\0':
              token.type = E_TOKEN_TYPE.EOF;
              return token;
            case '(':
            case ')':
              token.type =
                currentChar === '('
                  ? E_TOKEN_TYPE.OPEN_PAREN
                  : E_TOKEN_TYPE.CLOSE_PAREN;
              token.value = currentChar;
              return token;
            case '+':
            case '-':
            case '*':
            case '/':
            case '^':
            case '!':
            case '<':
            case '>':
            case '=':
            case '~':
              this._state = E_LEXER_STATE.OPERATOR_STATE;
              token.value = currentChar;
              break;
            case '$':
            case '_':
              this._state = E_LEXER_STATE.IDENTIFIER_STATE;
              token.value = currentChar;
              break;
            case '"':
            // eslint-disable-next-line quotes
            case "'":
              this._state = E_LEXER_STATE.STRING_LITERAL;
              token.value = currentChar;
              break;
            default:
              if (currentChar?.match(/[a-zA-Z]/)) {
                this._state = E_LEXER_STATE.KEYWORD_STATE;
                token.value = currentChar;
                break;
              }

              if (currentChar?.match(/\d/)) {
                this._state = E_LEXER_STATE.NUMBER_LITERAL;
                token.value = currentChar;
                break;
              }
          }
          break;
        case E_LEXER_STATE.NUMBER_LITERAL:
          if (currentChar?.match(/\d/)) {
            token.value += currentChar;
            break;
          } else {
            this._state = E_LEXER_STATE.START;
            this._currentIndex--;
            token.type = E_TOKEN_TYPE.NUMBER_LITERAL;
            return token;
          }
        case E_LEXER_STATE.STRING_LITERAL:
          token.value += currentChar;

          if (currentChar === token.value[0]) {
            this._state = E_LEXER_STATE.START;
            token.type = E_TOKEN_TYPE.STRING_LITERAL;
            token.value = token.value.slice(1, -1);
            return token;
          }
          break;
        case E_LEXER_STATE.KEYWORD_STATE:
          if (currentChar?.match(/[a-zA-Z]/)) {
            token.value += currentChar;
          } else {
            const lowerCaseTokenValue = token.value.toLowerCase();

            const tokenType = Scanner.LEXER_KEYWORDS_MAP[lowerCaseTokenValue];

            if (tokenType !== undefined) {
              this._state = E_LEXER_STATE.START;
              token.type = tokenType;
            } else {
              this._state = E_LEXER_STATE.IDENTIFIER_STATE;
            }

            this._currentIndex--;
            if (tokenType !== undefined) return token;
          }
          break;
        case E_LEXER_STATE.IDENTIFIER_STATE:
          if (currentChar?.match(/[a-zA-Z\d_$]/)) {
            token.value += currentChar;
            break;
          } else {
            this._state = E_LEXER_STATE.START;
            this._currentIndex--;
            token.type = E_TOKEN_TYPE.IDENTIFIER;
            return token;
          }
        case E_LEXER_STATE.OPERATOR_STATE:
          if (currentChar?.match(/[+-/*!=<>]/)) {
            token.value += currentChar;
          } else {
            this._state = E_LEXER_STATE.START;
            this._currentIndex--;

            const tokenType = Scanner.LEXER_OPERATORS_MAP[token.value];
            if (tokenType !== undefined) {
              token.type = tokenType;
            } else {
              DQLError(
                E_ERROR_CODES.LEXICAL_ERROR,
                `Unexpected token: ${token.value}`,
              );
            }

            return token;
          }
          break;
        default:
          break;
      }
    }

    return token;
  }
}
