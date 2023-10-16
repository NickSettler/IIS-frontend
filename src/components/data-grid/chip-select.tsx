import {
  GridColDef,
  GridFilterInputMultipleSingleSelectProps,
  GridRenderCellParams,
} from '@mui/x-data-grid';
import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Tooltip,
} from '@mui/material';
import { GridValidRowModel } from '@mui/x-data-grid/models/gridRows';
import { differenceWith, isEqual } from 'lodash';
import { useMemo } from 'react';
import {
  andOrFilterOperator,
  E_FILTER_MODE,
} from '../../utils/data-grid/filters';

export type TChipSelectFilterInputProps<T extends string> =
  GridFilterInputMultipleSingleSelectProps & {
    cellValues: Array<T>;
  };

const ChipSelectFilterInput = <T extends string>({
  item,
  applyValue,
  cellValues,
}: TChipSelectFilterInputProps<T>) => {
  const handleFilterChange = (event: SelectChangeEvent<Array<T>>) => {
    applyValue({ ...item, value: event.target.value });
  };

  const unselectedValues = useMemo(() => {
    const selectedValues = item.value || [];
    return differenceWith(cellValues, selectedValues, isEqual);
  }, [cellValues, item.value]);

  return (
    <FormControl variant='standard'>
      <InputLabel>Value</InputLabel>
      <Select
        multiple={true}
        value={item.value || []}
        onChange={handleFilterChange}
        renderValue={(selected: Array<T>) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map((value: T) => (
              <Chip size={'small'} key={value} label={value} />
            ))}
          </Box>
        )}
      >
        {unselectedValues.map((cellValue: T) => (
          <MenuItem key={cellValue} value={cellValue}>
            {cellValue}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export type TChipSelectCellProps<
  E extends GridValidRowModel,
  V extends Record<PropertyKey, string>,
> = GridRenderCellParams<E, Array<V>> & {
  prop?: keyof V;
};

export const ChipSelectCell = <
  E extends GridValidRowModel,
  V extends Record<keyof V, string>,
>(
  params: TChipSelectCellProps<E, V>,
) => {
  const { value, prop } = params;

  if (value == null || prop == null || !value.length) return null;

  return (
    <Box
      display={'flex'}
      flexWrap={'wrap'}
      alignItems={'top'}
      width={'100%'}
      sx={{ gap: 1 }}
    >
      <Chip label={value[0][prop]} color={'primary'} />
      {value.length > 1 && (
        <Tooltip
          title={value
            .slice(1)
            .map((item) => item[prop])
            .join(', ')}
        >
          <Chip label={`${value.length - 1} more`} color={'primary'} />
        </Tooltip>
      )}
    </Box>
  );
};

export const chipSelectColDef = <
  E extends GridValidRowModel,
  V extends Record<keyof V, string>,
>(
  prop: keyof V,
  cellValues: Array<V[keyof V]>,
): GridColDef<E, V> => ({
  filterable: true,
  sortable: false,
  editable: false,
  groupable: false,
  filterOperators: [
    {
      ...andOrFilterOperator('Is (and)', prop, E_FILTER_MODE.AND),
      InputComponent: (params: GridFilterInputMultipleSingleSelectProps) => (
        <ChipSelectFilterInput
          {...params}
          cellValues={cellValues}
        ></ChipSelectFilterInput>
      ),
    },
    {
      ...andOrFilterOperator('Is (or)', prop, E_FILTER_MODE.OR),
      InputComponent: (params: GridFilterInputMultipleSingleSelectProps) => (
        <ChipSelectFilterInput
          {...params}
          cellValues={cellValues}
        ></ChipSelectFilterInput>
      ),
    },
  ],
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  renderCell: (params: GridRenderCellParams<E, Array<I>>) => (
    <ChipSelectCell {...params} prop={prop} />
  ),
});
