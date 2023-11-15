import { JSX } from 'react';
import {
  GridActionsCellItem,
  GridActionsColDef,
  GridColDef,
} from '@mui/x-data-grid';
import { isUndefined } from 'lodash';
import { E_MODALS } from '../../../store/modals';
import {
  E_COURSE_ACTIVITY_ENTITY_KEYS,
  TCourseActivity,
} from '../../../api/course-activities/types';
import { useNavigate, useParams } from 'react-router-dom';
import { useCourseActivities } from '../../../utils/hooks/course-activities/useCourseActivities';
import { useCourseActivityMutations } from '../../../utils/hooks/course-activities/useCourseActivityMutations';
import { GenericDataGrid } from '../../data-grid/generic-datagrid';
import { useCourseActivityModalHandlers } from '../../../utils/hooks/course-activities/useCourseActivityModalHandlers';
import { useCourseActivityPermissions } from '../../../utils/hooks/course-activities/useCourseActivityPermissions';
import { Tooltip } from '@mui/material';
import { Event } from '@mui/icons-material';
import { E_SCHEDULE_ITEM_ENTITY_KEYS } from '../../../api/schedule/types';

export const CourseActivityTable = (): JSX.Element => {
  const { id } = useParams<'id'>();
  const navigate = useNavigate();

  if (isUndefined(id)) navigate('/courses');

  const useQueryFn = useCourseActivities.bind(this, id);

  const gridColumns: Array<GridColDef<TCourseActivity>> = [
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
      field: E_COURSE_ACTIVITY_ENTITY_KEYS.REQUIREMENTS,
      headerName: 'Requirements',
      hideable: false,
    },
  ];

  const customActions: GridActionsColDef<TCourseActivity> = {
    field: 'actions',
    type: 'actions',
    headerName: 'Actions',
    getActions: (params) => [
      <Tooltip title={'Open schedule'} key={'open-schedule'}>
        <GridActionsCellItem
          label={'Open schedule'}
          icon={<Event />}
          onClick={() =>
            navigate(
              `/schedule?${E_SCHEDULE_ITEM_ENTITY_KEYS.COURSE_ACTIVITY}=${params.id}`,
            )
          }
        />
      </Tooltip>,
    ],
  };

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
        [E_COURSE_ACTIVITY_ENTITY_KEYS.COURSE]: id ?? '',
      }}
      customActions={customActions}
      permissionsFunction={useCourseActivityPermissions}
      mutationsFunction={useCourseActivityMutations}
      modalHandlersFunction={useCourseActivityModalHandlers}
    />
  );
};
