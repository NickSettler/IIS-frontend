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

  const [rows, setRows] = useState<Array<TClass>>([]);
  const [rowSelection, setRowSelection] = useState<Array<GridRowId>>([]);

  useEffect(() => {
    if (data && !isFetching) setRows(data);
  }, [data, isFetching]);

  const handleDeleteSelected = () => {
    forEach(rowSelection, (id) => {
      deleteMutation.mutate({
        [E_CLASS_ENTITY_KEYS.ABBR]: toString(id),
      });
    });
  };

  const handleRowSelection = (newSelection: Array<GridRowId>) => {
    setRowSelection(newSelection);
  };

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
    <>
      <DataGrid
        columns={gridColumns}
        rows={rows}
        loading={isLoading}
        checkboxSelection={canDelete}
        getRowId={(row) => row[E_CLASS_ENTITY_KEYS.ABBR]}
        rowSelectionModel={rowSelection}
        onRowSelectionModelChange={handleRowSelection}
        slots={{
          loadingOverlay: LinearProgress,
          toolbar: () => (
            <ClassDataTableToolbar
              rowSelection={rowSelection}
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
