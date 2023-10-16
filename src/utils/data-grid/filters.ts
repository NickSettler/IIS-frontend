import { GridValidRowModel } from '@mui/x-data-grid/models/gridRows';
import { GridFilterOperator } from '@mui/x-data-grid';
import {
  differenceWith,
  intersectionWith,
  isEqual,
  isUndefined,
  map,
  property,
} from 'lodash';

export enum E_FILTER_MODE {
  AND = 'and',
  OR = 'or',
}

export const andOrFilterOperator = <
  E extends GridValidRowModel,
  V extends Record<keyof V, string>,
>(
  label: string,
  prop: keyof V,
  mode: E_FILTER_MODE = E_FILTER_MODE.AND,
): GridFilterOperator<E, V> => ({
  label,
  value: label,
  getApplyFilterFn:
    ({ value }) =>
    ({ row, field }) => {
      if (isUndefined(value) || value?.length === 0) return true;

      const rowValues = map(row[field], property(prop));

      if (mode === E_FILTER_MODE.AND)
        return differenceWith(value, rowValues, isEqual).length === 0;

      return intersectionWith(value, rowValues, isEqual).length > 0;
    },
});
