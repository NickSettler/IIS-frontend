import { JSX } from 'react';
import { DataGridToolbar } from '../../data-grid/toolbar';
import { Button } from '@mui/material';
import { E_MODALS, TDynModalMeta } from '../../../store/modals';
import { Add, Delete } from '@mui/icons-material';
import { GridRowId } from '@mui/x-data-grid';
import { E_MODAL_MODE } from '../../../utils/modal/base-modal';
import { TClassCreateData } from '../../../api/class/class.service';
import { useClassPermissions } from '../../../utils/hooks/class/useClassPermissions';

export type TClassDataTableToolbarProps = {
  rowSelection: Array<GridRowId>;
  handleCreateSuccess(data: TClassCreateData): void;
  openCreateModal(meta: TDynModalMeta<E_MODALS.CLASS_FORM>): void;
  handleDeleteSelected(): void;
};

export const ClassDataTableToolbar = ({
  rowSelection,
  openCreateModal,
  handleCreateSuccess,
  handleDeleteSelected,
}: TClassDataTableToolbarProps): JSX.Element => {
  const { canCreateClass, canDeleteClass } = useClassPermissions();

  return (
    <DataGridToolbar
      selection={rowSelection}
      prependButtons={[
        ...(canCreateClass
          ? [
              <Button
                key={E_MODALS.ADD_NEW_USER}
                size={'small'}
                startIcon={<Add />}
                onClick={() =>
                  openCreateModal({
                    mode: E_MODAL_MODE.CREATE,
                    onSuccess: handleCreateSuccess,
                  })
                }
              >
                Add new class
              </Button>,
            ]
          : []),
      ]}
      endButtons={[
        ...(canDeleteClass
          ? [
              <Button
                key={'delete-selected'}
                size={'small'}
                startIcon={<Delete />}
                onClick={handleDeleteSelected}
              >
                Delete selected
              </Button>,
            ]
          : []),
      ]}
    />
  );
};
