import { useMutation, useQuery } from '@tanstack/react-query';
import CourseService, {
  TCourseCreateMutationVariables,
  TCourseDeleteMutationVariables,
  TCourseUpdateMutationVariables,
  TCreateCourseData,
  TUpdateCourseData,
} from '../../../api/courses/course.service';
import { JSX, useEffect, useState } from 'react';
import { E_COURSE_ENTITY_KEYS, TPureCourse } from '../../../api/courses/types';
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowId,
} from '@mui/x-data-grid';
import { E_USER_ENTITY_KEYS } from '../../../api/user/types';
import { chipSelectColDef } from '../../data-grid/chip-select';
import {
  differenceWith,
  forEach,
  isEmpty,
  isEqual,
  omit,
  pick,
  toString,
  unionBy,
} from 'lodash';
import {
  GridRenderCellParams,
  GridValueFormatterParams,
} from '@mui/x-data-grid/models/params/gridCellParams';
import { LinearProgress } from '@mui/material';
import { TApiError } from '../../../api/base/types';
import { CourseDataTableError } from './error';
import { CourseDataTableToolbar } from './toolbar';
import { OpenInNew } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useModal } from '../../../utils/hooks/useModal';
import { E_MODALS } from '../../../store/modals';
import { E_MODAL_MODE } from '../../../utils/modal/base-modal';
import { toast } from 'react-hot-toast';

export const CoursesDataTable = (): JSX.Element => {
  const navigate = useNavigate();

  const { onOpen: openCourseFormModal, onClose: closeCourseFormModal } =
    useModal(E_MODALS.COURSE_FORM);

  const { data, isLoading, isFetching, error, refetch } = useQuery<
    Array<TPureCourse>,
    TApiError
  >({
    queryKey: ['getCourses'],
    queryFn: CourseService.getCourses.bind(CourseService),
  });

  const createMutation = useMutation<
    TPureCourse,
    TApiError,
    TCourseCreateMutationVariables
  >({
    mutationFn: async ({ data: createData }: TCourseCreateMutationVariables) =>
      CourseService.createCourse(createData),
    onSuccess: async () => {
      await refetch();
      closeCourseFormModal();

      toast.success('Course created successfully');
    },
    onError: async () => {
      await refetch();

      toast.error('Failed to create course');
    },
  });

  const updateMutation = useMutation<
    TPureCourse,
    TApiError,
    TCourseUpdateMutationVariables
  >({
    mutationFn: async ({
      [E_COURSE_ENTITY_KEYS.ABBR]: abbr,
      data: updateData,
    }: TCourseUpdateMutationVariables) =>
      CourseService.updateCourse(abbr, updateData),
    onSuccess: async () => {
      await refetch();
      closeCourseFormModal();

      toast.success('Course updated successfully!');
    },
    onError: async () => {
      await refetch();

      toast.error('Failed to update course');
    },
  });

  const deleteMutation = useMutation<
    void,
    TApiError,
    TCourseDeleteMutationVariables
  >({
    mutationFn: async ({
      [E_COURSE_ENTITY_KEYS.ABBR]: abbr,
    }: TCourseDeleteMutationVariables) => CourseService.deleteCourse(abbr),
    onSuccess: async () => {
      await refetch();

      toast.success('Course deleted successfully');
    },
    onError: async () => {
      await refetch();

      toast.error('Failed to delete course');
    },
  });

  const [rows, setRows] = useState<Array<TPureCourse>>([]);
  const [rowSelection, setRowSelection] = useState<Array<GridRowId>>([]);

  useEffect(() => {
    if (data && !isFetching) setRows(data);
  }, [data, isFetching]);

  const handleCreateSuccess = (createData: TCreateCourseData) => {
    const pureData = pick(createData, [
      E_COURSE_ENTITY_KEYS.ABBR,
      E_COURSE_ENTITY_KEYS.NAME,
      E_COURSE_ENTITY_KEYS.CREDITS,
      E_COURSE_ENTITY_KEYS.GUARANTOR,
    ]);
    createMutation.mutate({
      data: {
        ...pureData,
        ...(createData[E_COURSE_ENTITY_KEYS.ANNOTATION] && {
          [E_COURSE_ENTITY_KEYS.ANNOTATION]:
            createData[E_COURSE_ENTITY_KEYS.ANNOTATION],
        }),
        ...(createData[E_COURSE_ENTITY_KEYS.TEACHERS] && {
          [E_COURSE_ENTITY_KEYS.TEACHERS]:
            createData[E_COURSE_ENTITY_KEYS.TEACHERS],
        }),
      },
    });
  };

  const handleUpdateSuccess = (
    abbr: TPureCourse[E_COURSE_ENTITY_KEYS.ABBR],
    updateData: TUpdateCourseData,
  ) => {
    const pureData = pick(updateData, [
      E_COURSE_ENTITY_KEYS.ABBR,
      E_COURSE_ENTITY_KEYS.NAME,
      E_COURSE_ENTITY_KEYS.CREDITS,
      E_COURSE_ENTITY_KEYS.GUARANTOR,
    ]);
    updateMutation.mutate({
      abbr,
      data: {
        ...pureData,
        ...(updateData[E_COURSE_ENTITY_KEYS.ANNOTATION] && {
          [E_COURSE_ENTITY_KEYS.ANNOTATION]:
            updateData[E_COURSE_ENTITY_KEYS.ANNOTATION],
        }),
        ...(updateData[E_COURSE_ENTITY_KEYS.TEACHERS] && {
          [E_COURSE_ENTITY_KEYS.TEACHERS]:
            updateData[E_COURSE_ENTITY_KEYS.TEACHERS],
        }),
      },
    });
  };

  const handleDeleteSelected = () => {
    forEach(rowSelection, (id) => {
      deleteMutation.mutate({
        [E_COURSE_ENTITY_KEYS.ABBR]: toString(id),
      });
    });
  };

  const handleRowSelection = (newSelection: Array<GridRowId>) => {
    setRowSelection(newSelection);
  };

  const handleRowUpdate = async (newRow: TPureCourse, oldRow: TPureCourse) => {
    const diff = differenceWith([oldRow], [newRow], isEqual);

    if (diff.length === 0) return oldRow;

    setRows((prevRows) =>
      unionBy([newRow], prevRows, E_COURSE_ENTITY_KEYS.ABBR),
    );

    updateMutation.mutate({
      [E_COURSE_ENTITY_KEYS.ABBR]: newRow[E_COURSE_ENTITY_KEYS.ABBR],
      data: omit(newRow, [
        E_COURSE_ENTITY_KEYS.ABBR,
        E_COURSE_ENTITY_KEYS.GUARANTOR,
        E_COURSE_ENTITY_KEYS.TEACHERS,
      ]),
    });

    return newRow;
  };

  const handleDuplicateAction = (duplicateData: TPureCourse) => {
    openCourseFormModal({
      mode: E_MODAL_MODE.CREATE,
      initialData: duplicateData,
      onSuccess: handleCreateSuccess,
    });
  };

  const handleEditAction = (editData: TPureCourse) => {
    openCourseFormModal({
      abbr: editData[E_COURSE_ENTITY_KEYS.ABBR],
      mode: E_MODAL_MODE.UPDATE,
      initialData: editData,
      onSuccess: handleUpdateSuccess,
    });
  };

  const handleDeleteAction = (abbr: TPureCourse[E_COURSE_ENTITY_KEYS.ABBR]) => {
    deleteMutation.mutate({
      abbr,
    });
  };

  const gridColumns: Array<GridColDef<TPureCourse>> = [
    {
      field: E_COURSE_ENTITY_KEYS.ABBR,
      headerName: 'Abbreviation',
      hideable: false,
    },
    {
      field: E_COURSE_ENTITY_KEYS.NAME,
      headerName: 'Name',
      editable: true,
      flex: 1,
      hideable: false,
    },
    {
      field: E_COURSE_ENTITY_KEYS.ANNOTATION,
      headerName: 'Annotation',
      editable: true,
      flex: 1,
      renderCell: ({
        value,
      }: GridRenderCellParams<
        TPureCourse,
        TPureCourse[E_COURSE_ENTITY_KEYS.ANNOTATION]
      >) => (isEmpty(value) ? <i>None</i> : value),
    },
    {
      field: E_COURSE_ENTITY_KEYS.CREDITS,
      type: 'number',
      headerName: 'Credits',
      editable: true,
    },
    {
      field: E_COURSE_ENTITY_KEYS.GUARANTOR,
      headerName: 'Guarantor',
      flex: 1,
      valueFormatter: ({
        value,
      }: GridValueFormatterParams<
        TPureCourse[E_COURSE_ENTITY_KEYS.GUARANTOR]
      >) =>
        `${value[E_USER_ENTITY_KEYS.FIRST_NAME]} ${
          value[E_USER_ENTITY_KEYS.LAST_NAME]
        }`,
    },
    {
      ...chipSelectColDef(E_USER_ENTITY_KEYS.USERNAME, []),
      field: E_COURSE_ENTITY_KEYS.TEACHERS,
      headerName: 'Teachers',
      width: 200,
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
            navigate(`/courses/${params.row[E_COURSE_ENTITY_KEYS.ABBR]}`)
          }
        />,
        <GridActionsCellItem
          showInMenu
          key={'duplicate'}
          label={'Duplicate'}
          onClick={() => handleDuplicateAction(params.row)}
        />,
        <GridActionsCellItem
          showInMenu
          key={'edit'}
          label={'Edit'}
          onClick={() => handleEditAction(params.row)}
        />,
        <GridActionsCellItem
          showInMenu
          key={'delete'}
          label={'Delete'}
          onClick={() =>
            handleDeleteAction(params.row[E_COURSE_ENTITY_KEYS.ABBR])
          }
        />,
      ],
    },
  ];

  if (isLoading || error) {
    return (
      <CourseDataTableError
        isLoading={isLoading}
        error={error}
        refetch={refetch}
      />
    );
  }

  return (
    <>
      <DataGrid
        columns={gridColumns}
        rows={rows}
        editMode={'row'}
        loading={isLoading}
        checkboxSelection
        getRowId={(row) => row[E_COURSE_ENTITY_KEYS.ABBR]}
        rowSelectionModel={rowSelection}
        onRowSelectionModelChange={handleRowSelection}
        sortModel={[
          {
            field: E_COURSE_ENTITY_KEYS.ABBR,
            sort: 'asc',
          },
        ]}
        processRowUpdate={handleRowUpdate}
        slots={{
          loadingOverlay: LinearProgress,
          toolbar: () => (
            <CourseDataTableToolbar
              rowSelection={rowSelection}
              openCreateModal={openCourseFormModal}
              handleCreateSuccess={handleCreateSuccess}
              handleDeleteSelected={handleDeleteSelected}
            />
          ),
        }}
      />
    </>
  );
};
