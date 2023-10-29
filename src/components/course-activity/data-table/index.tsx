import { JSX, useEffect, useState } from 'react';
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowId,
} from '@mui/x-data-grid';
import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import { forEach, isUndefined, omit, toString } from 'lodash';
import { DataGridToolbar } from '../../data-grid/toolbar';
import { Add, Delete } from '@mui/icons-material';
import { useModal } from '../../../utils/hooks/useModal';
import { E_MODALS } from '../../../store/modals';
import {
  TCourseActivityCreateData,
  TCourseActivityUpdateData,
} from '../../../api/course-activities/course-activities.service';
import {
  E_COURSE_ACTIVITY_ENTITY_KEYS,
  TApiCourseActivity,
} from '../../../api/course-activities/types';
import { useNavigate, useParams } from 'react-router-dom';
import { useCourseActivities } from '../../../utils/hooks/useCourseActivities';
import { useCourseActivityMutations } from '../../../utils/hooks/useCourseActivityMutations';
import { E_MODAL_MODE } from '../../../utils/modal/base-modal';

export const CourseActivityTable = (): JSX.Element => {
  const { abbr } = useParams<'abbr'>();
  const navigate = useNavigate();

  if (isUndefined(abbr)) navigate('/courses');

  const { onOpen: openFormModal, onClose: closeFormModal } = useModal(
    E_MODALS.ADD_NEW_ACTIVITY,
  );

  const { data, isLoading, error, refetch, isFetching } =
    useCourseActivities(abbr);

  const { createMutation, updateMutation, deleteMutation } =
    useCourseActivityMutations({
      refetch,
      closeFormModal,
    });

  const [rows, setRows] = useState<Array<TApiCourseActivity>>([]);
  const [rowSelection, setRowSelection] = useState<Array<GridRowId>>([]);

  useEffect(() => {
    if (data && !isFetching) setRows(data);
  }, [data, isFetching]);

  const handleUpdate = (
    id: TApiCourseActivity[E_COURSE_ACTIVITY_ENTITY_KEYS.ID],
    updateData: TCourseActivityUpdateData,
  ) => {
    updateMutation.mutate({
      [E_COURSE_ACTIVITY_ENTITY_KEYS.ID]: id,
      data: omit(
        updateData,
        E_COURSE_ACTIVITY_ENTITY_KEYS.ID,
        E_COURSE_ACTIVITY_ENTITY_KEYS.COURSE,
      ),
    });
  };

  const handleRowSelection = (newSelection: Array<GridRowId>) => {
    setRowSelection(newSelection);
  };

  const handleDeleteSelected = () => {
    forEach(rowSelection, (id) => {
      deleteMutation.mutate({
        [E_COURSE_ACTIVITY_ENTITY_KEYS.ID]: toString(id),
      });
    });
  };

  const gridColumns: Array<GridColDef<TApiCourseActivity>> = [
    {
      field: E_COURSE_ACTIVITY_ENTITY_KEYS.ID,
      headerName: 'ID',
      flex: 1,
      hideable: true,
    },
    {
      field: E_COURSE_ACTIVITY_ENTITY_KEYS.FORM,
      headerName: 'Activity',
      hideable: false,
    },
    {
      field: 'actions',
      type: 'actions',
      hideable: false,
      getActions: (params) => [
        <GridActionsCellItem
          key={'edit'}
          label={'Edit'}
          showInMenu
          onClick={() =>
            openFormModal({
              mode: E_MODAL_MODE.UPDATE,
              data: params.row,
              id: params.row[E_COURSE_ACTIVITY_ENTITY_KEYS.ID],
              onSuccess: handleUpdate,
              course: abbr ?? '',
            })
          }
        />,
        <GridActionsCellItem
          key={'delete'}
          label={'Delete'}
          showInMenu
          onClick={() =>
            deleteMutation.mutate({
              [E_COURSE_ACTIVITY_ENTITY_KEYS.ID]:
                params.row[E_COURSE_ACTIVITY_ENTITY_KEYS.ID],
            })
          }
        />,
      ],
    },
  ];

  const handleAddCourseActivitySuccess = (
    createData: TCourseActivityCreateData,
  ) => {
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
          key={E_MODALS.ADD_NEW_ACTIVITY}
          size={'small'}
          startIcon={<Add />}
          onClick={() =>
            openFormModal({
              mode: E_MODAL_MODE.CREATE,
              onSuccess: handleAddCourseActivitySuccess,
              course: abbr ?? '',
            })
          }
        >
          Add new activity
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
        loading={isLoading}
        checkboxSelection
        disableColumnSelector
        rowSelectionModel={rowSelection}
        onRowSelectionModelChange={handleRowSelection}
        sortModel={[
          {
            field: E_COURSE_ACTIVITY_ENTITY_KEYS.ID,
            sort: 'asc',
          },
        ]}
        slots={{
          loadingOverlay: LinearProgress,
          toolbar,
        }}
        hideFooter
      />
    </>
  );
};
