import { E_SYNTAX_TREE_TRAVERSE_ORDER, E_TOKEN_TYPE } from './types';

export class TAbstractSyntaxTree {
  private _type: E_TOKEN_TYPE = E_TOKEN_TYPE.NODE;

  private _value?: string;

  private _left?: TAbstractSyntaxTree;

  private _right?: TAbstractSyntaxTree;

  constructor();

  constructor(type: E_TOKEN_TYPE);

  constructor(type: E_TOKEN_TYPE, value: string);

  constructor(
    type: E_TOKEN_TYPE,
    value: string,
    left: TAbstractSyntaxTree,
    right: TAbstractSyntaxTree,
  );

  constructor(
    type?: E_TOKEN_TYPE,
    value?: string,
    left?: TAbstractSyntaxTree,
    right?: TAbstractSyntaxTree,
  ) {
    if (type) this._type = type;
    if (value) this._value = value;
    if (left) this._left = left;
    if (right) this._right = right;
  }

  public get type(): E_TOKEN_TYPE {
    return this._type;
  }

  public get value(): string | undefined {
    return this._value;
  }

  public get left(): TAbstractSyntaxTree | undefined {
    return this._left;
  }

  public get right(): TAbstractSyntaxTree | undefined {
    return this._right;
  }

  public set type(value: E_TOKEN_TYPE) {
    this._type = value;
  }

  public set value(value: string) {
    this._value = value;
  }

  public set left(value: TAbstractSyntaxTree | undefined) {
    this._left = value;
  }

  public set right(value: TAbstractSyntaxTree | undefined) {
    this._right = value;
  }

  public traverseTree(
    func: (node: TAbstractSyntaxTree) => void,
    order: E_SYNTAX_TREE_TRAVERSE_ORDER,
  ) {
    if (order === E_SYNTAX_TREE_TRAVERSE_ORDER.PRE_ORDER) func(this);
    if (this._left) this._left.traverseTree(func, order);
    if (order === E_SYNTAX_TREE_TRAVERSE_ORDER.IN_ORDER) func(this);
    if (this._right) this._right.traverseTree(func, order);
    if (order === E_SYNTAX_TREE_TRAVERSE_ORDER.POST_ORDER) func(this);
  }
}
