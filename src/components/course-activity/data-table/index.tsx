import { JSX, useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridRowId } from '@mui/x-data-grid';
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
  isUndefined,
  omit,
  toString,
  unionBy,
} from 'lodash';
import { DataGridToolbar } from '../../data-grid/toolbar';
import { Add, Delete } from '@mui/icons-material';
import { useModal } from '../../../utils/hooks/useModal';
import { E_MODALS } from '../../../store/modals';
import { toast } from 'react-hot-toast';
import CourseActivityService, {
  TCourseActivityCreateData,
  TCourseActivityCreateMutationVariables,
  TCourseActivityDeleteMutationVariables,
  TCourseActivityUpdateMutationVariables,
} from '../../../api/course-activities/course-activities.service';
import {
  E_COURSE_ACTIVITY_ENTITY_KEYS,
  TApiCourseActivity,
} from '../../../api/course-activities/types';
import { useNavigate, useParams } from 'react-router-dom';
import { useCourseActivities } from '../../../utils/hooks/useCourseActivities';

export const CourseActivityTable = (): JSX.Element => {
  const { abbr } = useParams<'abbr'>();
  const navigate = useNavigate();

  if (isUndefined(abbr)) navigate('/courses');

  const { onOpen: openAddActivityModal, onClose: closeAddActivityModal } =
    useModal(E_MODALS.ADD_NEW_ACTIVITY);

  const { data, isLoading, error, refetch, isFetching } =
    useCourseActivities(abbr);

  const createMutation = useMutation<
    TApiCourseActivity,
    TApiError,
    TCourseActivityCreateMutationVariables
  >({
    mutationFn: async ({
      data: createData,
    }: TCourseActivityCreateMutationVariables) =>
      CourseActivityService.createCourseActivity(createData),
    onSuccess: async () => {
      await refetch();
      closeAddActivityModal();

      toast.success('New activity created successfully!');
    },
    onError: async () => {
      await refetch();

      toast.error('Failed to create activity');
    },
  });

  const updateMutation = useMutation<
    TApiCourseActivity,
    TApiError,
    TCourseActivityUpdateMutationVariables
  >({
    mutationFn: async ({
      [E_COURSE_ACTIVITY_ENTITY_KEYS.ID]: id,
      data: updateData,
    }: TCourseActivityUpdateMutationVariables) =>
      CourseActivityService.updateCourseActivity(id, updateData),
    onSuccess: async () => {
      await refetch();

      toast.success('Activity updated successfully!');
    },
    onError: async () => {
      await refetch();

      toast.error('Failed to update activity');
    },
  });

  const deleteMutation = useMutation<
    void,
    TApiError,
    TCourseActivityDeleteMutationVariables
  >({
    mutationFn: async ({
      [E_COURSE_ACTIVITY_ENTITY_KEYS.ID]: id,
    }: TCourseActivityDeleteMutationVariables) =>
      CourseActivityService.deleteCourseActivity(id),
    onSuccess: async () => {
      await refetch();

      toast.success('Activity deleted successfully!');
    },
    onError: async () => {
      await refetch();

      toast.error('Failed to delete activity');
    },
  });

  const [rows, setRows] = useState<Array<TApiCourseActivity>>([]);
  const [rowSelection, setRowSelection] = useState<Array<GridRowId>>([]);

  useEffect(() => {
    if (data && !isFetching) setRows(data);
  }, [data, isFetching]);

  const handleRowUpdate = async (
    newRow: TApiCourseActivity,
    oldRow: TApiCourseActivity,
  ) => {
    const diff = differenceWith([oldRow], [newRow], isEqual);
    console.log(newRow);

    if (diff.length === 0) return oldRow;

    setRows((prevRows) =>
      unionBy([newRow], prevRows, E_COURSE_ACTIVITY_ENTITY_KEYS.ID),
    );

    updateMutation.mutate({
      [E_COURSE_ACTIVITY_ENTITY_KEYS.ID]:
        newRow[E_COURSE_ACTIVITY_ENTITY_KEYS.ID],
      data: omit(
        newRow,
        E_COURSE_ACTIVITY_ENTITY_KEYS.ID,
        E_COURSE_ACTIVITY_ENTITY_KEYS.COURSE,
      ),
    });

    return newRow;
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
      hideable: true,
    },
    {
      field: E_COURSE_ACTIVITY_ENTITY_KEYS.FORM,
      headerName: 'Activity',
      editable: true,
      flex: 1,
      hideable: false,
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
            openAddActivityModal({
              onSuccess: handleAddCourseActivitySuccess,
              course: abbr ? abbr : '',
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
        editMode={'row'}
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
        processRowUpdate={handleRowUpdate}
        slots={{
          loadingOverlay: LinearProgress,
          toolbar,
        }}
        hideFooter
      />
    </>
  );
};
