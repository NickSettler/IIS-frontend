import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Box, Chip, Tooltip } from '@mui/material';
import { GridValidRowModel } from '@mui/x-data-grid/models/gridRows';

export type TChipSelectCellProps<
  E extends GridValidRowModel,
  K extends PropertyKey,
  V extends Record<K, string>,
> = GridRenderCellParams<E, Array<V>> & {
  prop?: K;
};

export const ChipSelectCell = <
  E extends GridValidRowModel,
  K extends PropertyKey,
  V extends Record<K, string>,
>(
  params: TChipSelectCellProps<E, K, V>,
) => {
  const { value, prop, cellMode } = params;

  if (value == null || prop == null) return null;

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

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const chipSelectColDef: GridColDef = {
  resizable: true,
  filterable: false,
  sortable: false,
  editable: false,
  groupable: false,
  renderCell: (params) => <ChipSelectCell {...params} />,
};
