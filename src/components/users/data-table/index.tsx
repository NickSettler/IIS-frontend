import { JSX, useEffect, useState } from 'react';
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
import { useMutation, useQuery } from '@tanstack/react-query';
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
} from 'lodash';
import { chipSelectColDef } from '../../data-grid/chip-select';
import { DataGridToolbar } from '../../data-grid/toolbar';
import { Add, Delete } from '@mui/icons-material';
import { useModal } from '../../../utils/hooks/useModal';
import { E_MODALS } from '../../../store/modals';
import { toast } from 'react-hot-toast';

export const UsersDataTable = (): JSX.Element => {
  const { onOpen: openAddUserModal, onClose: closeAddUserModal } = useModal(
    E_MODALS.ADD_NEW_USER,
  );
  const { onOpen: openManageRolesModal, onClose: closeManageRolesModal } =
    useModal(E_MODALS.MANAGE_ROLES);

  const getQuery = useQuery<Array<TApiUserWithRoles>, TApiError>({
    queryKey: ['getUsers'],
    queryFn: UserService.getUsers.bind(UserService),
    staleTime: 0,
  });

  const { data, isLoading, error, refetch, isFetching } = getQuery;

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

  const [rows, setRows] = useState<Array<TApiUserWithRoles>>([]);
  const [rowSelection, setRowSelection] = useState<Array<GridRowId>>([]);

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
    <>
      <DataGrid
        columns={gridColumns}
        rows={rows}
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
    </>
  );
};
