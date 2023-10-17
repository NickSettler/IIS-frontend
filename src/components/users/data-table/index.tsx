import { JSX, useCallback, useEffect, useMemo, useState } from 'react';
import { DataGrid, GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import {
  E_ROLE,
  E_ROLE_ENTITY_KEYS,
  E_USER_ENTITY_KEYS,
  TApiUserWithRoles,
  TUserWithRoles,
} from '../../../api/user/types';
import UserService, {
  TUserAssignRoleMutationVariables,
  TUserCreateData,
  TUserCreateMutationVariables,
  TUserUpdateMutationVariables,
} from '../../../api/user/user.service';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Card, CardContent, LinearProgress } from '@mui/material';
import { TApiError } from '../../../api/base/types';
import { differenceWith, isEqual, omit, unionBy, values } from 'lodash';
import { chipSelectColDef } from '../../data-grid/chip-select';
import { AssignRoleModal } from '../assign-role-modal';
import { DataGridToolbar } from '../../data-grid/toolbar';
import { Add } from '@mui/icons-material';
import { useModal } from '../../../utils/hooks/useModal';
import { E_MODALS } from '../../../store/modals';

export const UsersDataTable = (): JSX.Element => {
  const { onOpen: openAddUserModal, onClose: closeAddUserModal } = useModal(
    E_MODALS.ADD_NEW_USER,
  );

  const { data, isLoading, error, refetch } = useQuery<
    Array<TApiUserWithRoles>,
    TApiError
  >({
    queryKey: ['getUsers'],
    queryFn: UserService.getUsers.bind(UserService),
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
    onSuccess: async () => refetch(),
  });

  const assignRoleMutation = useMutation<
    TApiUserWithRoles,
    TApiError,
    TUserAssignRoleMutationVariables
  >({
    mutationFn: async ({
      [E_USER_ENTITY_KEYS.ID]: id,
      role,
    }: TUserAssignRoleMutationVariables) => UserService.assignRole(id, role),
    onSuccess: async () => refetch(),
  });

  const [rows, setRows] = useState<Array<TApiUserWithRoles>>([]);
  const [assignRoleModalOpen, setAssignRoleModalOpen] = useState(false);
  const [assignRoleModalUserId, setAssignRoleModalUserId] = useState<
    TUserWithRoles[E_USER_ENTITY_KEYS.ID] | null
  >(null);

  useEffect(() => {
    if (data) setRows(data);
  }, [data]);

  const handleRowUpdate = (
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

  const handleAssignRoleClick = useCallback(
    (userId: TUserWithRoles[E_USER_ENTITY_KEYS.ID]) => () => {
      setAssignRoleModalUserId(userId);
      setAssignRoleModalOpen(true);
    },
    [],
  );

  const handleAssignRoleModalClose = () => {
    setAssignRoleModalOpen(false);
    setAssignRoleModalUserId(null);
  };

  const handleAssignRoleModalSuccess = (id: string, role: E_ROLE) => {
    assignRoleMutation.mutate({
      [E_USER_ENTITY_KEYS.ID]: id,
      role,
    });

    setAssignRoleModalOpen(false);
    setAssignRoleModalUserId(null);
  };

  const gridColumns = useMemo<Array<GridColDef<TApiUserWithRoles>>>(
    () => [
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
            key={'assign-role'}
            label={'Assign role'}
            showInMenu={true}
            onClick={handleAssignRoleClick(params.row[E_USER_ENTITY_KEYS.ID])}
          />,
        ],
      },
    ],
    [handleAssignRoleClick],
  );

  const handleAddUserSuccess = (createData: TUserCreateData) => {
    createMutation.mutate({
      data: createData,
    });
  };

  if (error) {
    return (
      <Card>
        <CardContent>Error: {error?.message ?? 'Unknown error'}</CardContent>
      </Card>
    );
  }

  const toolbar = () => (
    <DataGridToolbar
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
    />
  );

  return (
    <>
      <DataGrid
        columns={gridColumns}
        rows={rows}
        editMode={'row'}
        loading={isLoading}
        checkboxSelection={true}
        sortModel={[
          {
            field: E_USER_ENTITY_KEYS.ID,
            sort: 'asc',
          },
        ]}
        processRowUpdate={handleRowUpdate}
        slots={{
          loadingOverlay: LinearProgress,
          toolbar,
        }}
      ></DataGrid>
      <AssignRoleModal
        isOpen={assignRoleModalOpen}
        userId={assignRoleModalUserId}
        onSuccess={handleAssignRoleModalSuccess}
        onClose={handleAssignRoleModalClose}
      />
    </>
  );
};
