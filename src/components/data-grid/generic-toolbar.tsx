import { JSX } from 'react';
import { GridRowId } from '@mui/x-data-grid';
import { E_MODALS, TDynModalMeta } from '../../store/modals';
import { DataGridToolbar } from './toolbar';
import { Button } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { E_MODAL_MODE } from '../../utils/modal/base-modal';

export type TUseGenericPermissions = {
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
};

export type TGenericDataTableToolbarProps<T extends E_MODALS> = {
  modalKey: T;
  createCaption: string;
  rowSelection: Array<GridRowId>;
  modalInitial?: any;
  permissionsFunc(): TUseGenericPermissions;
  handleCreateSuccess(data: Parameters<TDynModalMeta<T>['onSuccess']>[0]): void;
  openCreateModal(meta: TDynModalMeta<T>): void;
  handleDeleteSelected(): void;
};

export const GenericToolbar = ({
  modalKey,
  createCaption,
  rowSelection,
  modalInitial,
  permissionsFunc,
  openCreateModal,
  handleCreateSuccess,
  handleDeleteSelected,
}: TGenericDataTableToolbarProps<any>): JSX.Element => {
  const { canCreate, canDelete } = permissionsFunc();

  return (
    <DataGridToolbar
      selection={rowSelection}
      prependButtons={[
        ...(canCreate
          ? [
              <Button
                key={modalKey}
                size={'small'}
                startIcon={<Add />}
                onClick={() =>
                  openCreateModal({
                    mode: E_MODAL_MODE.CREATE,
                    onSuccess: handleCreateSuccess,
                    ...(modalInitial && { initialData: modalInitial }),
                  })
                }
              >
                {createCaption}
              </Button>,
            ]
          : []),
      ]}
      endButtons={[
        ...(canDelete
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
