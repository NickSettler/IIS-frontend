import { useQuery } from '@tanstack/react-query';
import CourseService from '../../../api/course/course.service';
import { JSX, useEffect, useState } from 'react';
import { E_COURSE_ENTITY_KEYS, TPureCourse } from '../../../api/course/types';
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowId,
} from '@mui/x-data-grid';
import { E_USER_ENTITY_KEYS } from '../../../api/user/types';
import { chipSelectColDef } from '../../data-grid/chip-select';
import { forEach, isEmpty, toString } from 'lodash';
import {
  GridRenderCellParams,
  GridValueFormatterParams,
} from '@mui/x-data-grid/models/params/gridCellParams';
import { LinearProgress } from '@mui/material';
import { TApiError } from '../../../api/base/types';
import { DataTableError } from '../../data-grid/error';
import { CourseDataTableToolbar } from './toolbar';
import { OpenInNew } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useModal } from '../../../utils/hooks/modal/useModal';
import { E_MODALS } from '../../../store/modals';
import { E_MODAL_MODE } from '../../../utils/modal/base-modal';
import { useCourseMutations } from '../../../utils/hooks/course/useCourseMutations';
import { useCourseModalHandlers } from '../../../utils/hooks/course/useCourseModalHandlers';
import { useCoursePermissions } from '../../../utils/hooks/course/useCoursePermissions';

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

  const { canCreateCourse, canUpdateCourse, canDeleteCourse } =
    useCoursePermissions();

  const { createMutation, updateMutation, deleteMutation } = useCourseMutations(
    {
      refetch,
      closeCourseFormModal,
    },
  );

  const { handleCreateSuccess, handleUpdateSuccess } = useCourseModalHandlers({
    createMutation,
    updateMutation,
  });

  const [rows, setRows] = useState<Array<TPureCourse>>([]);
  const [rowSelection, setRowSelection] = useState<Array<GridRowId>>([]);

  useEffect(() => {
    if (data && !isFetching) setRows(data);
  }, [data, isFetching]);

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
      flex: 1,
      hideable: false,
    },
    {
      field: E_COURSE_ENTITY_KEYS.ANNOTATION,
      headerName: 'Annotation',
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
        ...(canCreateCourse
          ? [
              <GridActionsCellItem
                showInMenu
                key={'duplicate'}
                label={'Duplicate'}
                onClick={() => handleDuplicateAction(params.row)}
              />,
            ]
          : []),
        ...(canUpdateCourse
          ? [
              <GridActionsCellItem
                showInMenu
                key={'edit'}
                label={'Edit'}
                onClick={() => handleEditAction(params.row)}
              />,
            ]
          : []),
        ...(canDeleteCourse
          ? [
              <GridActionsCellItem
                showInMenu
                key={'delete'}
                label={'Delete'}
                onClick={() =>
                  handleDeleteAction(params.row[E_COURSE_ENTITY_KEYS.ABBR])
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
        checkboxSelection={canDeleteCourse}
        getRowId={(row) => row[E_COURSE_ENTITY_KEYS.ABBR]}
        rowSelectionModel={rowSelection}
        onRowSelectionModelChange={handleRowSelection}
        sortModel={[
          {
            field: E_COURSE_ENTITY_KEYS.ABBR,
            sort: 'asc',
          },
        ]}
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
