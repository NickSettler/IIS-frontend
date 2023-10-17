import {
  GridToolbarColumnsButton,
  GridToolbarContainer,
} from '@mui/x-data-grid';
import { JSX } from 'react';
import Box from '@mui/material/Box';

type TDataGridToolbarProps = {
  prependButtons?: Array<JSX.Element>;
  appendButtons?: Array<JSX.Element>;
  endButtons?: Array<JSX.Element>;
};

export const DataGridToolbar = ({
  prependButtons,
  appendButtons,
  endButtons,
}: TDataGridToolbarProps) => {
  return (
    <GridToolbarContainer>
      {prependButtons}
      <GridToolbarColumnsButton />
      {appendButtons}
      <Box sx={{ flexGrow: 1 }} />
      {endButtons}
    </GridToolbarContainer>
  );
};
