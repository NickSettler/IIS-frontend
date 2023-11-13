import { JSX } from 'react';
import { E_COURSE_ENTITY_KEYS, TCourse } from '../../../api/course/types';
import { GridColDef } from '@mui/x-data-grid';
import { E_USER_ENTITY_KEYS } from '../../../api/user/types';
import { chipSelectColDef } from '../../data-grid/chip-select';
import { isEmpty } from 'lodash';
import {
  GridRenderCellParams,
  GridValueFormatterParams,
} from '@mui/x-data-grid/models/params/gridCellParams';
import { E_MODALS } from '../../../store/modals';
import { useCourseMutations } from '../../../utils/hooks/course/useCourseMutations';
import { useCourseModalHandlers } from '../../../utils/hooks/course/useCourseModalHandlers';
import { useCoursePermissions } from '../../../utils/hooks/course/useCoursePermissions';
import { GenericDataGrid } from '../../data-grid/generic-datagrid';
import { useCourses } from '../../../utils/hooks/course/useCourses';

export const CoursesDataTable = (): JSX.Element => {
  const gridColumns: Array<GridColDef<TCourse>> = [
    {
      field: E_COURSE_ENTITY_KEYS.ID,
      headerName: 'ID',
      hideable: true,
    },
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
        TCourse,
        TCourse[E_COURSE_ENTITY_KEYS.ANNOTATION]
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
      }: GridValueFormatterParams<TCourse[E_COURSE_ENTITY_KEYS.GUARANTOR]>) =>
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
  ];

  return (
    <GenericDataGrid
      modalKey={E_MODALS.COURSE_FORM}
      primaryKey={E_COURSE_ENTITY_KEYS.ID}
      columns={gridColumns}
      actions={['open-in-tab', 'duplicate', 'edit', 'delete']}
      caption={'Course'}
      queryFunction={useCourses}
      permissionsFunction={useCoursePermissions}
      mutationsFunction={useCourseMutations}
      modalHandlersFunction={useCourseModalHandlers}
    />
  );
};
