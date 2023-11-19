import { ChangeEvent, JSX, useEffect, useMemo, useState } from 'react';
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
  GridActionsColDef,
  GridColDef,
  GridRowId,
  GridRowParams,
} from '@mui/x-data-grid';
import {
  debounce,
  forEach,
  isEmpty,
  lowerCase,
  sortBy,
  toString,
} from 'lodash';
import { compare } from '../../utils/object/compare';
import { E_MODAL_MODE } from '../../utils/modal/base-modal';
import { DataTableError } from './error';
import { LinearProgress, Stack } from '@mui/material';
import { OpenInNew } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Scanner from '../../utils/qdl/scanner';
import Parser from '../../utils/qdl/parser';
import Executor from '../../utils/qdl/executor';
import { NoRowsOverlay } from './no-rows-overlay';

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
  customActions?: GridActionsColDef<Value>;
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
  customActions,
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
  const location = useLocation();
  const navigate = useNavigate();

  const urlSearchParams = new URLSearchParams(location.search);

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

  // eslint-disable-next-line react/hook-use-state
  const [DQLQuery, setDQLQuery] = useState<string>(
    urlSearchParams.get('q') ?? '',
  );
  // eslint-disable-next-line react/hook-use-state
  const [DQLQueryError, setDQLQueryError] = useState<string>('');
  const [rows, setRows] = useState<Array<Value>>([]);
  const [rowSelection, setRowSelection] = useState<Array<GridRowId>>([]);

  const filteredRows = useMemo(() => {
    if (isEmpty(DQLQuery)) {
      setDQLQueryError('');
      return rows;
    }

    try {
      const lexer = new Scanner(DQLQuery);
      const scanner = new Parser(lexer.getNextToken.bind(lexer));
      const tree = scanner.processQuery();
      const executor = new Executor(tree);

      const result = executor.filter(rows);

      setDQLQueryError('');

      return result;
    } catch (e) {
      if (e instanceof Error) {
        setDQLQueryError(e.message);
      }

      return rows;
    }
  }, [DQLQuery, rows]);

  const updateURLFunc = (query: string) => {
    urlSearchParams.set('q', query);
    navigate(`?${urlSearchParams.toString()}`, {
      replace: true,
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateURL = useMemo(() => debounce(updateURLFunc, 1000), []);

  const handleQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDQLQuery(e.target.value);
    updateURL(e.target.value);
  };

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
        ...(customActions?.getActions(params) ?? []),
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
    <Stack spacing={2}>
      <TextField
        size={'small'}
        placeholder={'name == "username"'}
        label={'Query'}
        value={DQLQuery}
        error={!isEmpty(DQLQueryError)}
        helperText={DQLQueryError}
        onChange={handleQueryChange}
      />
      <DataGrid
        columns={gridColumns}
        rows={filteredRows}
        loading={isLoading}
        checkboxSelection={canDelete}
        getRowId={(row) => row[primaryKey]}
        rowSelectionModel={rowSelection}
        onRowSelectionModelChange={handleRowSelection}
        {...(actions?.includes('open-in-tab') && {
          onRowDoubleClick: (params) =>
            handleOpenInTabAction(params.row[primaryKey]),
        })}
        sx={{ '--DataGrid-overlayHeight': '300px' }}
        slots={{
          noRowsOverlay: NoRowsOverlay,
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
    </Stack>
  );
};
