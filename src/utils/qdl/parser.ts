import { TAbstractSyntaxTree } from './ast';
import {
  E_ERROR_CODES,
  E_TOKEN_TYPE,
  TLexicalToken,
  TSyntaxTokenAttribute,
} from './types';
import { DQLError, DQLUnexpectedSyntaxTokenError } from './error';
import { clone } from 'lodash';

export default class Parser {
  private readonly _tree: TAbstractSyntaxTree;

  private currentToken!: TLexicalToken;

  constructor(private readonly getTokenFunc: () => TLexicalToken) {
    this._tree = new TAbstractSyntaxTree();
  }

  public get tree(): TAbstractSyntaxTree {
    return this._tree;
  }

  private static lowerToken = (type: E_TOKEN_TYPE): TSyntaxTokenAttribute => ({
    ...(type && { type }),
    isRightAssociative: false,
    isBinary: false,
    isUnary: false,
    precedence: -1,
  });

  // eslint-disable-next-line @typescript-eslint/member-ordering
  private static readonly SYNTAX_TOKEN_ATTRIBUTES: Record<
    E_TOKEN_TYPE,
    TSyntaxTokenAttribute
  > = {
    [E_TOKEN_TYPE.EOF]: Parser.lowerToken(E_TOKEN_TYPE.EOF),
    [E_TOKEN_TYPE.IDENTIFIER]: Parser.lowerToken(E_TOKEN_TYPE.IDENTIFIER),
    [E_TOKEN_TYPE.NUMBER_LITERAL]: Parser.lowerToken(
      E_TOKEN_TYPE.NUMBER_LITERAL,
    ),
    [E_TOKEN_TYPE.STRING_LITERAL]: Parser.lowerToken(
      E_TOKEN_TYPE.STRING_LITERAL,
    ),
    [E_TOKEN_TYPE.BOOLEAN_LITERAL]: Parser.lowerToken(
      E_TOKEN_TYPE.BOOLEAN_LITERAL,
    ),
    [E_TOKEN_TYPE.OPEN_PAREN]: Parser.lowerToken(E_TOKEN_TYPE.OPEN_PAREN),
    [E_TOKEN_TYPE.CLOSE_PAREN]: Parser.lowerToken(E_TOKEN_TYPE.CLOSE_PAREN),
    [E_TOKEN_TYPE.AND_OPERATOR]: {
      type: E_TOKEN_TYPE.AND_OPERATOR,
      isRightAssociative: false,
      isBinary: true,
      isUnary: false,
      precedence: 5,
    },
    [E_TOKEN_TYPE.OR_OPERATOR]: {
      type: E_TOKEN_TYPE.OR_OPERATOR,
      isRightAssociative: false,
      isBinary: true,
      isUnary: false,
      precedence: 4,
    },
    [E_TOKEN_TYPE.EQUAL]: {
      type: E_TOKEN_TYPE.EQUAL,
      isRightAssociative: false,
      isBinary: true,
      isUnary: false,
      precedence: 9,
    },
    [E_TOKEN_TYPE.NOT_EQUAL]: {
      type: E_TOKEN_TYPE.NOT_EQUAL,
      isRightAssociative: false,
      isBinary: true,
      isUnary: false,
      precedence: 9,
    },
    [E_TOKEN_TYPE.GREATER_THAN]: {
      type: E_TOKEN_TYPE.GREATER_THAN,
      isRightAssociative: false,
      isBinary: true,
      isUnary: false,
      precedence: 10,
    },
    [E_TOKEN_TYPE.GREATER_THAN_OR_EQUAL]: {
      type: E_TOKEN_TYPE.GREATER_THAN_OR_EQUAL,
      isRightAssociative: false,
      isBinary: true,
      isUnary: false,
      precedence: 10,
    },
    [E_TOKEN_TYPE.LESS_THAN]: {
      type: E_TOKEN_TYPE.LESS_THAN,
      isRightAssociative: false,
      isBinary: true,
      isUnary: false,
      precedence: 10,
    },
    [E_TOKEN_TYPE.LESS_THAN_OR_EQUAL]: {
      type: E_TOKEN_TYPE.LESS_THAN_OR_EQUAL,
      isRightAssociative: false,
      isBinary: true,
      isUnary: false,
      precedence: 10,
    },
    [E_TOKEN_TYPE.CONTAINS]: {
      type: E_TOKEN_TYPE.CONTAINS,
      isRightAssociative: false,
      isBinary: true,
      isUnary: false,
      precedence: 10,
    },
    [E_TOKEN_TYPE.PLUS]: {
      type: E_TOKEN_TYPE.PLUS,
      isRightAssociative: false,
      isBinary: true,
      isUnary: false,
      precedence: 12,
    },
    [E_TOKEN_TYPE.MINUS]: {
      type: E_TOKEN_TYPE.MINUS,
      isRightAssociative: false,
      isBinary: true,
      isUnary: false,
      precedence: 12,
    },
    [E_TOKEN_TYPE.MULTIPLY]: {
      type: E_TOKEN_TYPE.MULTIPLY,
      isRightAssociative: false,
      isBinary: true,
      isUnary: false,
      precedence: 13,
    },
    [E_TOKEN_TYPE.DIVIDE]: {
      type: E_TOKEN_TYPE.DIVIDE,
      isRightAssociative: false,
      isBinary: true,
      isUnary: false,
      precedence: 13,
    },
    [E_TOKEN_TYPE.INT_DIVIDE]: {
      type: E_TOKEN_TYPE.INT_DIVIDE,
      isRightAssociative: false,
      isBinary: true,
      isUnary: false,
      precedence: 13,
    },
    [E_TOKEN_TYPE.MODULO]: {
      type: E_TOKEN_TYPE.MODULO,
      isRightAssociative: false,
      isBinary: true,
      isUnary: false,
      precedence: 13,
    },
    [E_TOKEN_TYPE.POWER]: {
      type: E_TOKEN_TYPE.POWER,
      isRightAssociative: false,
      isBinary: true,
      isUnary: false,
      precedence: 14,
    },
    [E_TOKEN_TYPE.NODE]: Parser.lowerToken(E_TOKEN_TYPE.NODE),
    [E_TOKEN_TYPE.RESULT]: Parser.lowerToken(E_TOKEN_TYPE.RESULT),
  };

  public processQuery(): TAbstractSyntaxTree {
    this.currentToken = this.getTokenFunc();

    const tree = new TAbstractSyntaxTree();
    // const e = new TAbstractSyntaxTree();

    switch (this.currentToken.type) {
      case E_TOKEN_TYPE.IDENTIFIER:
      case E_TOKEN_TYPE.NUMBER_LITERAL:
      case E_TOKEN_TYPE.OPEN_PAREN:
        tree.type = E_TOKEN_TYPE.NODE;
        tree.right = this.processExpression(0);
        break;
      default:
        DQLUnexpectedSyntaxTokenError(this.currentToken);
    }

    return tree;
  }

  private expectToken(tokenType: E_TOKEN_TYPE) {
    if (this.currentToken.type !== tokenType) {
      DQLError(
        E_ERROR_CODES.SYNTAX_ERROR,
        `Expecting ${tokenType}, got ${this.currentToken.value}`,
      );
    }
  }

  private processExpression(precedence: number): TAbstractSyntaxTree {
    let x = new TAbstractSyntaxTree();
    let node = new TAbstractSyntaxTree();

    switch (this.currentToken.type) {
      case E_TOKEN_TYPE.OPEN_PAREN:
        x = this.parenthesizedExpression();
        break;
      case E_TOKEN_TYPE.IDENTIFIER:
      case E_TOKEN_TYPE.NUMBER_LITERAL:
      case E_TOKEN_TYPE.STRING_LITERAL:
        x.type = this.currentToken.type;
        x.value = this.currentToken.value;
        this.currentToken = this.getTokenFunc();
        break;
      default:
        throw new SyntaxError(
          `Expected expression on line ${this.currentToken.line}:${this.currentToken.column}, got "${this.currentToken.value}"`,
        );
    }

    while (
      Parser.SYNTAX_TOKEN_ATTRIBUTES[this.currentToken.type].isBinary &&
      Parser.SYNTAX_TOKEN_ATTRIBUTES[this.currentToken.type].precedence >=
        precedence
    ) {
      const { type } = this.currentToken;

      this.currentToken = this.getTokenFunc();

      let q = Parser.SYNTAX_TOKEN_ATTRIBUTES[type].precedence;
      if (!Parser.SYNTAX_TOKEN_ATTRIBUTES[type].isRightAssociative) q++;

      node = this.processExpression(q);
      const xt = clone(x);
      x = new TAbstractSyntaxTree();
      x.type = Parser.SYNTAX_TOKEN_ATTRIBUTES[type].type;
      x.left = xt;
      x.right = clone(node);
    }

    return x;
  }

  private parenthesizedExpression(): TAbstractSyntaxTree {
    this.expectToken(E_TOKEN_TYPE.OPEN_PAREN);
    this.currentToken = this.getTokenFunc();
    const tree = this.processExpression(0);
    this.expectToken(E_TOKEN_TYPE.CLOSE_PAREN);
    this.currentToken = this.getTokenFunc();
    return tree;
  }
}
