import { JSX } from 'react';
import { GridColDef } from '@mui/x-data-grid';
import { isUndefined } from 'lodash';
import { E_MODALS } from '../../../store/modals';
import {
  E_COURSE_ACTIVITY_ENTITY_KEYS,
  TApiCourseActivity,
} from '../../../api/course-activities/types';
import { useNavigate, useParams } from 'react-router-dom';
import { useCourseActivities } from '../../../utils/hooks/course-activities/useCourseActivities';
import { useCourseActivityMutations } from '../../../utils/hooks/course-activities/useCourseActivityMutations';
import { GenericDataGrid } from '../../data-grid/generic-datagrid';
import { useCourseActivityModalHandlers } from '../../../utils/hooks/course-activities/useCourseActivityModalHandlers';
import { useCourseActivityPermissions } from '../../../utils/hooks/course-activities/useCourseActivityPermissions';

export const CourseActivityTable = (): JSX.Element => {
  const { abbr } = useParams<'abbr'>();
  const navigate = useNavigate();

  if (isUndefined(abbr)) navigate('/courses');

  const useQueryFn = useCourseActivities.bind(this, abbr);

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
  ];

  return (
    <GenericDataGrid
      modalKey={E_MODALS.ADD_NEW_ACTIVITY}
      primaryKey={E_COURSE_ACTIVITY_ENTITY_KEYS.ID}
      columns={gridColumns}
      caption={'Course Activity'}
      actions={['edit', 'delete']}
      queryFunction={useQueryFn}
      modalInitial={{
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        [E_COURSE_ACTIVITY_ENTITY_KEYS.COURSE]: abbr ?? '',
      }}
      permissionsFunction={useCourseActivityPermissions}
      mutationsFunction={useCourseActivityMutations}
      modalHandlersFunction={useCourseActivityModalHandlers}
    />
  );
};
