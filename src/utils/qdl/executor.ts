import {
  E_ERROR_CODES,
  E_SYNTAX_TREE_TRAVERSE_ORDER,
  E_TOKEN_TYPE,
} from './types';
import { TAbstractSyntaxTree } from './ast';
import { DQLError } from './error';
import { eq, gt, gte, isEqual, lt, lte, negate } from 'lodash';

export default class Executor {
  private static readonly TYPE_CAST_MAP: {
    [E_TOKEN_TYPE.NUMBER_LITERAL](value: string): number;
    [E_TOKEN_TYPE.BOOLEAN_LITERAL](value: string): boolean;
  } = {
    [E_TOKEN_TYPE.NUMBER_LITERAL]: (value: string) => parseInt(value, 10),
    [E_TOKEN_TYPE.BOOLEAN_LITERAL]: (value: string) => value === 'true',
  };

  private static readonly ARITHMETIC_MAP: Partial<
    Record<E_TOKEN_TYPE, (val1: number, val2: number) => number>
  > = {
    [E_TOKEN_TYPE.PLUS]: (val1, val2) => val1 + val2,
    [E_TOKEN_TYPE.MINUS]: (val1, val2) => val1 - val2,
    [E_TOKEN_TYPE.MULTIPLY]: (val1, val2) => val1 * val2,
    [E_TOKEN_TYPE.DIVIDE]: (val1, val2) => val1 / val2,
    [E_TOKEN_TYPE.INT_DIVIDE]: (val1, val2) => Math.round(val1 / val2),
    [E_TOKEN_TYPE.MODULO]: (val1, val2) => val1 % val2,
    [E_TOKEN_TYPE.POWER]: (val1, val2) => val1 ** val2,
  };

  private static readonly RELATIONAL_MAP: Partial<
    Record<E_TOKEN_TYPE, <T>(val1: T, val2: T) => boolean>
  > = {
    [E_TOKEN_TYPE.EQUAL]: eq,
    [E_TOKEN_TYPE.NOT_EQUAL]: negate(eq),
    [E_TOKEN_TYPE.GREATER_THAN]: gt,
    [E_TOKEN_TYPE.GREATER_THAN_OR_EQUAL]: gte,
    [E_TOKEN_TYPE.LESS_THAN]: lt,
    [E_TOKEN_TYPE.LESS_THAN_OR_EQUAL]: lte,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    [E_TOKEN_TYPE.CONTAINS]: <T extends string>(string1: T, string2: T) =>
      string1.includes(string2),
  };

  private static readonly COMBINE_MAP: Record<
    E_TOKEN_TYPE.AND_OPERATOR | E_TOKEN_TYPE.OR_OPERATOR,
    <T>(arrays: Array<Array<T>>, iteratee?: keyof T) => Array<T>
  > = {
    [E_TOKEN_TYPE.OR_OPERATOR]: (arrays, iteratee) =>
      arrays?.[0].concat(
        arrays?.[1].filter(
          (item) =>
            !arrays?.[0].some((_item) =>
              iteratee
                ? _item[iteratee] === item[iteratee]
                : isEqual(_item, item),
            ),
        ),
      ) || [],
    [E_TOKEN_TYPE.AND_OPERATOR]: (arrays, iteratee) =>
      arrays?.[0].filter(
        (item) =>
          arrays?.[1].some((_item) =>
            iteratee
              ? _item[iteratee] === item[iteratee]
              : isEqual(_item, item),
          ) || false,
      ) || [],
  };

  constructor(private readonly filterTree: TAbstractSyntaxTree) {
    //
  }

  private static typeCast(
    node: TAbstractSyntaxTree & { type: E_TOKEN_TYPE.NUMBER_LITERAL },
  ): number;

  // private static typeCast(
  //   node: TAbstractSyntaxTree & { type: E_TOKEN_TYPE.BOOLEAN_LITERAL },
  // ): boolean;

  private static typeCast(node: TAbstractSyntaxTree): string;

  private static typeCast(
    node: TAbstractSyntaxTree,
  ): boolean | number | string {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return Executor.TYPE_CAST_MAP[node.type]
      ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        Executor.TYPE_CAST_MAP[node.type](node.value)
      : node.value;
  }

  public filter<T>(data: Array<T>): Array<T>;

  public filter<T>(data: Array<T>, key: keyof T): Array<T>;

  public filter<T>(data: Array<T>, key?: keyof T): Array<T> {
    this.filterTree.traverseTree((node) => {
      if (Executor.ARITHMETIC_MAP[node.type]) {
        const operation = Executor.ARITHMETIC_MAP[node.type];

        if (
          node.left?.type !== E_TOKEN_TYPE.NUMBER_LITERAL ||
          node.right?.type !== E_TOKEN_TYPE.NUMBER_LITERAL
        )
          DQLError(E_ERROR_CODES.FILTER_ERROR, 'Invalid filter tree');

        node.value = JSON.stringify(
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          operation(
            Executor.typeCast(node.left!) as unknown as number,
            Executor.typeCast(node.right!) as unknown as number,
          ),
        );
        node.type = E_TOKEN_TYPE.NUMBER_LITERAL;
        node.left = undefined;
        node.right = undefined;
      }

      if (Executor.RELATIONAL_MAP[node.type]) {
        const operation = Executor.RELATIONAL_MAP[node.type];

        node.value = JSON.stringify(
          data.filter((item) =>
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            operation(item[node.left.value], Executor.typeCast(node.right)),
          ),
        );
        node.type = E_TOKEN_TYPE.RESULT;
      }

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (Executor.COMBINE_MAP[node.type]) {
        if (
          node.left?.type !== E_TOKEN_TYPE.RESULT ||
          node.right?.type !== E_TOKEN_TYPE.RESULT
        )
          DQLError(E_ERROR_CODES.FILTER_ERROR, 'Invalid filter tree');

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const operation = Executor.COMBINE_MAP[node.type];

        const lArray = JSON.parse(node.left?.value ?? '');
        const rArray = JSON.parse(node.right?.value ?? '');

        node.value = JSON.stringify(
          operation?.call(null, [lArray, rArray], key),
        );
        node.type = E_TOKEN_TYPE.RESULT;
        node.left = undefined;
        node.right = undefined;
      }
    }, E_SYNTAX_TREE_TRAVERSE_ORDER.POST_ORDER);

    if (this.filterTree.right?.type !== E_TOKEN_TYPE.RESULT) {
      DQLError(E_ERROR_CODES.FILTER_ERROR, 'Invalid filter tree');
    }

    if (this.filterTree.right?.value) {
      return JSON.parse(this.filterTree.right.value);
    }

    return [];
  }
}
