import { JSX } from 'react';
import { useTeacherRequirements } from '../../utils/hooks/teacher-requirements/useTeacherRequirements';
import { GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import {
  E_TEACHER_REQUIREMENT_ENTITY_KEYS,
  TTeacherRequirement,
} from '../../api/teacher-requirements/types';
import { useTeacherRequirementMutations } from '../../utils/hooks/teacher-requirements/useTeacherRequirementMutations';
import { useTeacherRequirementModalHandlers } from '../../utils/hooks/teacher-requirements/useTeacherRequirementModalHandlers';
import { useTeacherRequirementPermissions } from '../../utils/hooks/teacher-requirements/useTeacherRequirementPermissions';
import { useModal } from '../../utils/hooks/modal/useModal';
import { E_MODALS } from '../../store/modals';
import { E_MODAL_MODE } from '../../utils/modal/base-modal';
import { GenericDataGrid } from '../data-grid/generic-datagrid';

export const ProfileTeacherRequirements = (): JSX.Element => {
  const { onOpen: openFormModal, onClose: closeFormModal } = useModal(
    E_MODALS.TEACHER_REQUIREMENT_FORM,
  );

  const { refetch } = useTeacherRequirements();

  const { canCreate, canUpdate, canDelete } =
    useTeacherRequirementPermissions();

  const { createMutation, updateMutation, deleteMutation } =
    useTeacherRequirementMutations({
      refetch,
      closeFormModal,
    });

  const { handleCreateSuccess, handleUpdateSuccess } =
    useTeacherRequirementModalHandlers({
      createMutation,
      updateMutation,
    });

  const handleDuplicateAction = (duplicateData: TTeacherRequirement) => {
    openFormModal({
      mode: E_MODAL_MODE.CREATE,
      initialData: duplicateData,
      onSuccess: handleCreateSuccess,
    });
  };

  const handleEditAction = (editData: TTeacherRequirement) => {
    openFormModal({
      mode: E_MODAL_MODE.UPDATE,
      initialData: editData,
      onSuccess: handleUpdateSuccess,
    });
  };

  const handleDeleteAction = (
    id: TTeacherRequirement[E_TEACHER_REQUIREMENT_ENTITY_KEYS.ID],
  ) => {
    deleteMutation.mutate({
      id,
    });
  };

  const gridColumns: Array<GridColDef<TTeacherRequirement>> = [
    {
      field: E_TEACHER_REQUIREMENT_ENTITY_KEYS.START_TIME,
      headerName: 'Start time',
      type: 'dateTime',
      width: 200,
    },
    {
      field: E_TEACHER_REQUIREMENT_ENTITY_KEYS.END_TIME,
      headerName: 'End time',
      type: 'dateTime',
      width: 200,
    },
    {
      field: E_TEACHER_REQUIREMENT_ENTITY_KEYS.MODE,
      headerName: 'Mode',
      flex: 1,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      hideable: false,
      flex: 1,
      align: 'right',
      getActions: (params) => [
        ...(canCreate
          ? [
              <GridActionsCellItem
                showInMenu
                key={'duplicate'}
                label={'Duplicate'}
                onClick={() => handleDuplicateAction(params.row)}
              />,
            ]
          : []),
        ...(canUpdate
          ? [
              <GridActionsCellItem
                showInMenu
                key={'edit'}
                label={'Edit'}
                onClick={() => handleEditAction(params.row)}
              />,
            ]
          : []),
        ...(canDelete
          ? [
              <GridActionsCellItem
                showInMenu
                key={'delete'}
                label={'Delete'}
                onClick={() =>
                  handleDeleteAction(
                    params.row[E_TEACHER_REQUIREMENT_ENTITY_KEYS.ID],
                  )
                }
              />,
            ]
          : []),
      ],
    },
  ];

  return (
    <GenericDataGrid
      modalKey={E_MODALS.TEACHER_REQUIREMENT_FORM}
      primaryKey={E_TEACHER_REQUIREMENT_ENTITY_KEYS.ID}
      columns={gridColumns}
      caption={'Requirement'}
      queryFunction={useTeacherRequirements}
      permissionsFunction={useTeacherRequirementPermissions}
      mutationsFunction={useTeacherRequirementMutations}
      modalHandlersFunction={useTeacherRequirementModalHandlers}
    />
  );
};
