import { JSX } from 'react';
import { E_COURSE_ENTITY_KEYS, TPureCourse } from '../../../api/course/types';
import { GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import { E_USER_ENTITY_KEYS } from '../../../api/user/types';
import { chipSelectColDef } from '../../data-grid/chip-select';
import { isEmpty } from 'lodash';
import {
  GridRenderCellParams,
  GridValueFormatterParams,
} from '@mui/x-data-grid/models/params/gridCellParams';
import { OpenInNew } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useModal } from '../../../utils/hooks/modal/useModal';
import { E_MODALS } from '../../../store/modals';
import { E_MODAL_MODE } from '../../../utils/modal/base-modal';
import { useCourseMutations } from '../../../utils/hooks/course/useCourseMutations';
import { useCourseModalHandlers } from '../../../utils/hooks/course/useCourseModalHandlers';
import { useCoursePermissions } from '../../../utils/hooks/course/useCoursePermissions';
import { GenericDataGrid } from '../../data-grid/generic-datagrid';
import { useCourses } from '../../../utils/hooks/course/useCourses';

export const CoursesDataTable = (): JSX.Element => {
  const navigate = useNavigate();

  const { onOpen: openCourseFormModal, onClose: closeFormModal } = useModal(
    E_MODALS.COURSE_FORM,
  );

  const { refetch } = useCourses();

  const { canCreate, canUpdate, canDelete } = useCoursePermissions();

  const { createMutation, updateMutation, deleteMutation } = useCourseMutations(
    {
      refetch,
      closeFormModal,
    },
  );

  const { handleCreateSuccess, handleUpdateSuccess } = useCourseModalHandlers({
    createMutation,
    updateMutation,
  });

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
                  handleDeleteAction(params.row[E_COURSE_ENTITY_KEYS.ABBR])
                }
              />,
            ]
          : []),
      ],
    },
  ];

  return (
    <GenericDataGrid
      modalKey={E_MODALS.COURSE_FORM}
      primaryKey={E_COURSE_ENTITY_KEYS.ABBR}
      columns={gridColumns}
      caption={'Course'}
      queryFunction={useCourses}
      permissionsFunction={useCoursePermissions}
      mutationsFunction={useCourseMutations}
      modalHandlersFunction={useCourseModalHandlers}
    />
  );
};
