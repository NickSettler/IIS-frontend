import { JSX, useCallback, useEffect, useMemo, useState } from 'react';
import { DataGrid, GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import {
  E_ROLE,
  E_ROLE_ENTITY_KEYS,
  E_USER_ENTITY_KEYS,
  TUserWithRoles,
} from '../../../api/user/types';
import UserService, {
  TUserAssignRoleMutationVariables,
  TUserUpdateMutationVariables,
} from '../../../api/user/user.service';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Card, CardContent, LinearProgress } from '@mui/material';
import { TApiError } from '../../../api/base/types';
import { differenceWith, isEqual, omit, unionBy, values } from 'lodash';
import { chipSelectColDef } from '../../data-grid/chip-select';
import { AssignRoleModal } from '../assign-role-modal';

export const UsersDataTable = (): JSX.Element => {
  const { data, isLoading, error, refetch } = useQuery<
    Array<TUserWithRoles>,
    TApiError
  >({
    queryKey: ['getUsers'],
    queryFn: UserService.getUsers.bind(UserService),
  });

  const updateMutation = useMutation<
    TUserWithRoles,
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
    TUserWithRoles,
    TApiError,
    TUserAssignRoleMutationVariables
  >({
    mutationFn: async ({
      [E_USER_ENTITY_KEYS.ID]: id,
      role,
    }: TUserAssignRoleMutationVariables) => UserService.assignRole(id, role),
    onSuccess: async () => refetch(),
  });

  const [rows, setRows] = useState<Array<TUserWithRoles>>([]);
  const [assignRoleModalOpen, setAssignRoleModalOpen] = useState(false);
  const [assignRoleModalUserId, setAssignRoleModalUserId] = useState<
    TUserWithRoles[E_USER_ENTITY_KEYS.ID] | null
  >(null);

  useEffect(() => {
    if (data) setRows(data);
  }, [data]);

  const handleRowUpdate = (newRow: TUserWithRoles, oldRow: TUserWithRoles) => {
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

  const gridColumns = useMemo<Array<GridColDef<TUserWithRoles>>>(
    () => [
      {
        field: E_USER_ENTITY_KEYS.ID,
        headerName: 'ID',
      },
      {
        field: E_USER_ENTITY_KEYS.USERNAME,
        headerName: 'Username',
        editable: true,
        flex: 1,
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

  if (error) {
    return (
      <Card>
        <CardContent>Error: {error?.message ?? 'Unknown error'}</CardContent>
      </Card>
    );
  }

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
