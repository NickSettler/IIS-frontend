import { JSX, useEffect, useState } from 'react';
import {
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { TApiError } from '../../api/base/types';
import { GenericToolbar, TUseGenericPermissions } from './generic-toolbar';
import { E_MODALS } from '../../store/modals';
import { useModal } from '../../utils/hooks/modal/useModal';
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowId,
  GridRowParams,
} from '@mui/x-data-grid';
import { forEach, lowerCase, sortBy, toString } from 'lodash';
import { compare } from '../../utils/object/compare';
import { E_MODAL_MODE } from '../../utils/modal/base-modal';
import { DataTableError } from './error';
import { LinearProgress } from '@mui/material';
import { OpenInNew } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export type TGenericMutationsFunctionParams = {
  refetch(): Promise<unknown>;
  closeFormModal(): void;
};
export type TGenericMutationsFunction<
  Value extends Record<PropertyKey, any>,
  TCreateData extends Record<PropertyKey, any>,
  TUpdateData extends Record<PropertyKey, any>,
  TDeleteData extends Record<PropertyKey, any>,
> = {
  createMutation: UseMutationResult<Value, TApiError, TCreateData>;
  updateMutation: UseMutationResult<Value, TApiError, TUpdateData>;
  deleteMutation: UseMutationResult<void, TApiError, any>;
};

export type TGenericModalHandlersParams<
  Value extends Record<PropertyKey, any>,
  TCreateData extends Record<PropertyKey, any>,
  TUpdateData extends Record<PropertyKey, any>,
> = Pick<
  TGenericMutationsFunction<Value, TCreateData, TUpdateData, any>,
  'createMutation' | 'updateMutation'
>;

export type TGenericModalHandlers<
  Value extends Record<PropertyKey, any>,
  PK extends keyof Value,
  TCreateData extends Record<PropertyKey, any>,
  TUpdateData extends Record<PropertyKey, any>,
> = {
  handleCreateSuccess(createData: TCreateData): void;
  handleUpdateSuccess(id: Value[PK], updateData: TUpdateData): void;
};

export type TGenericDataGridActions =
  | 'delete'
  | 'duplicate'
  | 'edit'
  | 'open-in-tab';

export type TGenericDataGridProps<
  Value extends Record<PropertyKey, any>,
  PK extends keyof Value,
  TCreateData extends Record<PropertyKey, any>,
  TUpdateData extends Record<PropertyKey, any>,
  TDeleteData extends Record<PropertyKey, any>,
> = {
  modalKey: E_MODALS;
  primaryKey: PK;
  columns: Array<GridColDef<Value>>;
  caption: string;
  sortKey?: keyof Value;
  actions?: Array<TGenericDataGridActions>;
  modalInitial?: Partial<Value>;
  queryFunction(
    options?: Omit<
      UseQueryOptions<Array<Value>, TApiError, Array<Value>, Array<string>>,
      'initialData' | 'queryFn' | 'queryKey'
    > & { initialData?(): undefined },
  ): UseQueryResult<Array<Value>, TApiError>;
  permissionsFunction(): TUseGenericPermissions;
  mutationsFunction(
    params: TGenericMutationsFunctionParams,
  ): TGenericMutationsFunction<Value, TCreateData, TUpdateData, TDeleteData>;
  modalHandlersFunction(
    params: TGenericModalHandlersParams<Value, TCreateData, TUpdateData>,
  ): TGenericModalHandlers<Value, PK, any, any>;
};

export const GenericDataGrid = <
  Value extends Record<string, any>,
  PK extends keyof Value,
  TCreateData extends Record<PropertyKey, any>,
  TUpdateData extends Record<PropertyKey, any>,
  TDeleteData extends Record<PropertyKey, any>,
>({
  modalKey,
  primaryKey,
  columns,
  caption,
  sortKey,
  actions,
  modalInitial,
  queryFunction: useQueryFunction,
  permissionsFunction: usePermissionsFunction,
  mutationsFunction: useMutationsFunction,
  modalHandlersFunction: useModalHandlersFunction,
}: TGenericDataGridProps<
  Value,
  PK,
  TCreateData,
  TUpdateData,
  TDeleteData
>): JSX.Element => {
  const navigate = useNavigate();

  const { onOpen: openFormModal, onClose: closeFormModal } = useModal(modalKey);

  const { data, isLoading, error, refetch } = useQueryFunction();

  const { canCreate, canUpdate, canDelete } = usePermissionsFunction();

  const { createMutation, updateMutation, deleteMutation } =
    useMutationsFunction({
      refetch,
      closeFormModal,
    });

  const { handleCreateSuccess, handleUpdateSuccess } = useModalHandlersFunction(
    {
      createMutation,
      updateMutation,
    },
  );

  const [rows, setRows] = useState<Array<Value>>([]);
  const [rowSelection, setRowSelection] = useState<Array<GridRowId>>([]);

  useEffect(() => {
    const sortedData = sortBy(data, sortKey ?? primaryKey);
    const sortedRows = sortBy(rows, sortKey ?? primaryKey);

    if (data && !compare(sortedData, sortedRows)) {
      setRows(sortedData);
    }
  }, [data, primaryKey, rows, sortKey]);

  const handleRowSelection = (newSelection: Array<GridRowId>) => {
    setRowSelection(newSelection);
  };

  const handleDeleteSelected = () => {
    forEach(rowSelection, (id) => {
      deleteMutation.mutate({
        [primaryKey]: toString(id),
      });
    });
  };

  const handleOpenInTabAction = (id: Value[PK]) => {
    navigate(id, {
      relative: 'route',
    });
  };

  const handleDuplicateAction = (duplicateData: Value) => {
    openFormModal({
      mode: E_MODAL_MODE.CREATE,
      initialData: {
        ...(modalInitial ?? {}),
        ...duplicateData,
      },
      onSuccess: handleCreateSuccess,
    });
  };

  const handleEditAction = (editData: Value) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    openFormModal({
      mode: E_MODAL_MODE.UPDATE,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      initialData: {
        ...(modalInitial ?? {}),
        ...editData,
      },
      onSuccess: handleUpdateSuccess,
    });
  };

  const handleDeleteAction = (id: Value[PK]) => {
    deleteMutation.mutate({
      [primaryKey]: id,
    });
  };

  const gridColumns: Array<GridColDef<Value>> = [
    ...columns,
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      hideable: false,
      flex: 1,
      align: 'right',
      getActions: (params: GridRowParams<Value>) => [
        ...(actions?.includes('open-in-tab')
          ? [
              <GridActionsCellItem
                key={'open-details'}
                label={'Open details'}
                icon={<OpenInNew />}
                onClick={() => handleOpenInTabAction(params.row[primaryKey])}
              />,
            ]
          : []),
        ...(canCreate && actions?.includes('duplicate')
          ? [
              <GridActionsCellItem
                showInMenu
                key={'duplicate'}
                label={'Duplicate'}
                onClick={() => handleDuplicateAction(params.row)}
              />,
            ]
          : []),
        ...(canUpdate && actions?.includes('edit')
          ? [
              <GridActionsCellItem
                showInMenu
                key={'edit'}
                label={'Edit'}
                onClick={() => handleEditAction(params.row)}
              />,
            ]
          : []),
        ...(canDelete && actions?.includes('delete')
          ? [
              <GridActionsCellItem
                showInMenu
                key={'delete'}
                label={'Delete'}
                onClick={() => handleDeleteAction(params.row[primaryKey])}
              />,
            ]
          : []),
      ],
    },
  ];

  if (isLoading || error) {
    return (
      <DataTableError isLoading={isLoading} error={error} refetch={refetch} />
    );
  }

  return (
    <>
      <DataGrid
        columns={gridColumns}
        rows={rows}
        loading={isLoading}
        checkboxSelection={canDelete}
        getRowId={(row) => row[primaryKey]}
        rowSelectionModel={rowSelection}
        onRowSelectionModelChange={handleRowSelection}
        {...(actions?.includes('open-in-tab') && {
          onRowDoubleClick: (params) =>
            handleOpenInTabAction(params.row[primaryKey]),
        })}
        slots={{
          loadingOverlay: LinearProgress,
          toolbar: () => (
            <GenericToolbar
              modalKey={modalKey}
              createCaption={`Add new ${lowerCase(caption)}`}
              rowSelection={rowSelection}
              modalInitial={modalInitial}
              permissionsFunc={usePermissionsFunction}
              openCreateModal={openFormModal}
              handleCreateSuccess={handleCreateSuccess}
              handleDeleteSelected={handleDeleteSelected}
            />
          ),
        }}
      />
    </>
  );
};
