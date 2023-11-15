import { ChangeEvent, JSX, useEffect, useMemo, useState } from 'react';
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowId,
} from '@mui/x-data-grid';
import {
  E_ROLE,
  E_ROLE_ENTITY_KEYS,
  E_USER_ENTITY_KEYS,
  TApiUserWithRoles,
} from '../../../api/user/types';
import UserService, {
  TUserCreateData,
  TUserCreateMutationVariables,
  TUserDeleteMutationVariables,
  TUserUpdateMutationVariables,
} from '../../../api/user/user.service';
import { useMutation } from '@tanstack/react-query';
import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import { TApiError } from '../../../api/base/types';
import {
  differenceWith,
  forEach,
  isEqual,
  omit,
  unionBy,
  values,
  toString,
  isEmpty,
  debounce,
} from 'lodash';
import { chipSelectColDef } from '../../data-grid/chip-select';
import { DataGridToolbar } from '../../data-grid/toolbar';
import { Add, Delete } from '@mui/icons-material';
import { useModal } from '../../../utils/hooks/modal/useModal';
import { E_MODALS } from '../../../store/modals';
import { toast } from 'react-hot-toast';
import { useUsers } from '../../../utils/hooks/user/useUsers';
import { useLocation, useNavigate } from 'react-router-dom';
import Scanner from '../../../utils/qdl/scanner';
import Parser from '../../../utils/qdl/parser';
import Executor from '../../../utils/qdl/executor';
import TextField from '@mui/material/TextField';

export const UsersDataTable = (): JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();

  const urlSearchParams = new URLSearchParams(location.search);

  const { onOpen: openAddUserModal, onClose: closeAddUserModal } = useModal(
    E_MODALS.ADD_NEW_USER,
  );
  const { onOpen: openManageRolesModal, onClose: closeManageRolesModal } =
    useModal(E_MODALS.MANAGE_ROLES);

  const { data, isLoading, error, refetch, isFetching } = useUsers({
    staleTime: 0,
  });

  const createMutation = useMutation<
    TApiUserWithRoles,
    TApiError,
    TUserCreateMutationVariables
  >({
    mutationFn: async ({ data: createData }: TUserCreateMutationVariables) =>
      UserService.createUser(createData),
    onSuccess: async () => {
      await refetch();
      closeAddUserModal();

      toast.success('User created successfully!');
    },
    onError: async () => {
      await refetch();

      toast.error('Failed to create user');
    },
  });

  const updateMutation = useMutation<
    TApiUserWithRoles,
    TApiError,
    TUserUpdateMutationVariables
  >({
    mutationFn: async ({
      [E_USER_ENTITY_KEYS.ID]: id,
      data: updateData,
    }: TUserUpdateMutationVariables) => UserService.updateUser(id, updateData),
    onSuccess: async () => {
      await refetch();

      toast.success('User updated successfully!');
    },
    onError: async () => {
      await refetch();

      toast.error('Failed to update user');
    },
  });

  const deleteMutation = useMutation<
    void,
    TApiError,
    TUserDeleteMutationVariables
  >({
    mutationFn: async ({
      [E_USER_ENTITY_KEYS.ID]: id,
    }: TUserDeleteMutationVariables) => UserService.deleteUser(id),
    onSuccess: async () => {
      await refetch();

      toast.success('User deleted successfully!');
    },
    onError: async () => {
      await refetch();

      toast.error('Failed to delete user');
    },
  });

  // eslint-disable-next-line react/hook-use-state
  const [DQLQuery, setDQLQuery] = useState<string>(
    urlSearchParams.get('q') ?? '',
  );
  // eslint-disable-next-line react/hook-use-state
  const [DQLQueryError, setDQLQueryError] = useState<string>('');
  const [rows, setRows] = useState<Array<TApiUserWithRoles>>([]);
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
    if (data && !isFetching) setRows(data);
  }, [data, isFetching]);

  const handleRowUpdate = async (
    newRow: TApiUserWithRoles,
    oldRow: TApiUserWithRoles,
  ) => {
    const diff = differenceWith([oldRow], [newRow], isEqual);

    if (diff.length === 0) return oldRow;

    setRows((prevRows) => unionBy([newRow], prevRows, E_USER_ENTITY_KEYS.ID));

    updateMutation.mutate({
      [E_USER_ENTITY_KEYS.ID]: newRow[E_USER_ENTITY_KEYS.ID],
      data: omit(newRow, E_USER_ENTITY_KEYS.ID, E_USER_ENTITY_KEYS.ROLES),
    });

    return newRow;
  };

  const handleRowSelection = (newSelection: Array<GridRowId>) => {
    setRowSelection(newSelection);
  };

  const handleDeleteSelected = () => {
    forEach(rowSelection, (id) => {
      deleteMutation.mutate({
        [E_USER_ENTITY_KEYS.ID]: toString(id),
      });
    });
  };

  const handleManageRolesModalSuccess = (id: string, roles: Array<E_ROLE>) => {
    updateMutation.mutate(
      {
        [E_USER_ENTITY_KEYS.ID]: id,
        data: {
          [E_USER_ENTITY_KEYS.ROLES]: roles,
        },
      },
      {
        onSuccess: async () => {
          await refetch();

          closeManageRolesModal();
        },
      },
    );
  };

  const gridColumns: Array<GridColDef<TApiUserWithRoles>> = [
    {
      field: E_USER_ENTITY_KEYS.ID,
      headerName: 'ID',
      hideable: false,
    },
    {
      field: E_USER_ENTITY_KEYS.USERNAME,
      headerName: 'Username',
      editable: true,
      flex: 1,
      hideable: false,
    },
    {
      field: E_USER_ENTITY_KEYS.FIRST_NAME,
      headerName: 'First name',
      editable: true,
      flex: 1,
    },
    {
      field: E_USER_ENTITY_KEYS.LAST_NAME,
      headerName: 'Last name',
      editable: true,
      flex: 1,
    },
    {
      ...chipSelectColDef(E_ROLE_ENTITY_KEYS.NAME, values(E_ROLE)),
      field: E_USER_ENTITY_KEYS.ROLES,
      headerName: 'Roles',
      width: 200,
    },
    {
      field: 'actions',
      type: 'actions',
      hideable: false,
      getActions: (params) => [
        <GridActionsCellItem
          key={'manage-roles'}
          label={'Manage roles'}
          showInMenu
          onClick={() =>
            openManageRolesModal({
              userID: params.row[E_USER_ENTITY_KEYS.ID],
              onSuccess: handleManageRolesModalSuccess,
            })
          }
        />,
        <GridActionsCellItem
          key={'edit'}
          label={'Edit'}
          showInMenu
          onClick={() =>
            toast('To edit user, double click on the row', {
              position: 'top-right',
            })
          }
        />,
        <GridActionsCellItem
          key={'delete'}
          label={'Delete'}
          showInMenu
          onClick={() =>
            deleteMutation.mutate({
              [E_USER_ENTITY_KEYS.ID]: params.row[E_USER_ENTITY_KEYS.ID],
            })
          }
        />,
      ],
    },
  ];

  const handleAddUserSuccess = (createData: TUserCreateData) => {
    createMutation.mutate({
      data: createData,
    });
  };

  if (isLoading || error) {
    return (
      <Card>
        <CardContent>
          <Stack
            justifyContent={'space-between'}
            alignItems={'center'}
            direction={'row'}
          >
            {isLoading && <CircularProgress />}
            {error && (
              <>
                <Typography variant={'h6'}>
                  Error: {error?.message ?? 'Unknown error'}
                </Typography>
                <Button size={'small'} onClick={async () => refetch()}>
                  Retry
                </Button>
              </>
            )}
          </Stack>
        </CardContent>
      </Card>
    );
  }

  const toolbar = () => (
    <DataGridToolbar
      selection={rowSelection}
      prependButtons={[
        <Button
          key={E_MODALS.ADD_NEW_USER}
          size={'small'}
          startIcon={<Add />}
          onClick={() => openAddUserModal({ onSuccess: handleAddUserSuccess })}
        >
          Add new user
        </Button>,
      ]}
      endButtons={[
        <Button
          key={'delete-selected'}
          size={'small'}
          startIcon={<Delete />}
          onClick={handleDeleteSelected}
        >
          Delete selected
        </Button>,
      ]}
    />
  );

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
        editMode={'row'}
        loading={isLoading}
        checkboxSelection
        rowSelectionModel={rowSelection}
        onRowSelectionModelChange={handleRowSelection}
        sortModel={[
          {
            field: E_USER_ENTITY_KEYS.USERNAME,
            sort: 'asc',
          },
        ]}
        processRowUpdate={handleRowUpdate}
        slots={{
          loadingOverlay: LinearProgress,
          toolbar,
        }}
      />
    </Stack>
  );
};
