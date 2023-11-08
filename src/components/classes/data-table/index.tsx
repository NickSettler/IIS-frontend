import { JSX, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useModal } from '../../../utils/hooks/modal/useModal';
import { E_MODALS } from '../../../store/modals';
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowId,
} from '@mui/x-data-grid';
import { LinearProgress } from '@mui/material';
import { useClassPermissions } from '../../../utils/hooks/class/useClassPermissions';
import { useQuery } from '@tanstack/react-query';
import { TApiError } from '../../../api/base/types';
import ClassService from '../../../api/class/class.service';
import { E_CLASS_ENTITY_KEYS, TClass } from '../../../api/class/types';
import { useClassMutations } from '../../../utils/hooks/class/useClassMutations';
import { useClassModalHandlers } from '../../../utils/hooks/class/useClassModalHandlers';
import { forEach, toString } from 'lodash';
import { ClassDataTableToolbar } from './toolbar';
import { E_MODAL_MODE } from '../../../utils/modal/base-modal';
import { OpenInNew } from '@mui/icons-material';
import { DataTableError } from '../../data-grid/error';
import { GenericDataGrid } from '../../data-grid/generic-datagrid';

export const ClassesDataTable = (): JSX.Element => {
  const navigate = useNavigate();

  const { onOpen: openFormModal, onClose: closeFormModal } = useModal(
    E_MODALS.CLASS_FORM,
  );

  const useQueryFn = () =>
    useQuery<Array<TClass>, TApiError>({
      queryKey: ['getClasses'],
      queryFn: ClassService.getClasses.bind(ClassService),
    });

  const { data, isLoading, isFetching, error, refetch } = useQueryFn();

  const { canCreate, canUpdate, canDelete } = useClassPermissions();

  const { createMutation, updateMutation, deleteMutation } = useClassMutations({
    refetch,
    closeFormModal,
  });

  const { handleCreateSuccess, handleUpdateSuccess } = useClassModalHandlers({
    createMutation,
    updateMutation,
  });

  const handleDuplicateAction = (duplicateData: TClass) => {
    openFormModal({
      mode: E_MODAL_MODE.CREATE,
      initialData: duplicateData,
      onSuccess: handleCreateSuccess,
    });
  };

  const handleEditAction = (editData: TClass) => {
    openFormModal({
      abbr: editData[E_CLASS_ENTITY_KEYS.ABBR],
      mode: E_MODAL_MODE.UPDATE,
      initialData: editData,
      onSuccess: handleUpdateSuccess,
    });
  };

  const handleDeleteAction = (abbr: TClass[E_CLASS_ENTITY_KEYS.ABBR]) => {
    deleteMutation.mutate({
      abbr,
    });
  };

  const gridColumns: Array<GridColDef<TClass>> = [
    {
      field: E_CLASS_ENTITY_KEYS.ABBR,
      headerName: 'Abbreviation',
      hideable: false,
    },
    {
      field: E_CLASS_ENTITY_KEYS.CAPACITY,
      headerName: 'Capacity',
      type: 'number',
      flex: 1,
      hideable: false,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      hideable: false,
      flex: 1,
      align: 'right',
      getActions: (params) => [
        <GridActionsCellItem
          key={'open-details'}
          label={'Open details'}
          icon={<OpenInNew />}
          onClick={() =>
            navigate(`/classes/${params.row[E_CLASS_ENTITY_KEYS.ABBR]}`)
          }
        />,
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
                  handleDeleteAction(params.row[E_CLASS_ENTITY_KEYS.ABBR])
                }
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
    <GenericDataGrid
      modalKey={E_MODALS.CLASS_FORM}
      primaryKey={E_CLASS_ENTITY_KEYS.ABBR}
      columns={gridColumns}
      caption={'Class'}
      queryFunction={useQueryFn}
      permissionsFunction={useClassPermissions}
      mutationsFunction={useClassMutations}
      modalHandlersFunction={useClassModalHandlers}
    />
  );
};
