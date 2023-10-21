import {
  GridRowId,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarFilterButton,
} from '@mui/x-data-grid';
import { JSX } from 'react';
import Box from '@mui/material/Box';

type TDataGridToolbarProps = {
  selection: Array<GridRowId>;
  prependButtons?: Array<JSX.Element>;
  appendButtons?: Array<JSX.Element>;
  endButtons?: Array<JSX.Element>;
};

export const DataGridToolbar = ({
  selection,
  prependButtons,
  appendButtons,
  endButtons,
}: TDataGridToolbarProps) => {
  return (
    <GridToolbarContainer>
      {prependButtons}
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      {appendButtons}
      <Box sx={{ flexGrow: 1 }} />
      {!!selection.length && endButtons}
    </GridToolbarContainer>
  );
};
