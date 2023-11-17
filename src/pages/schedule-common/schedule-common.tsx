import { JSX, useMemo, useState } from 'react';
import { useScheduleItems } from '../../utils/hooks/schedule/useScheduleItems';
import { ScheduleCalendar } from '../../components/schedule/schedule-calendar';
import { useScheduleItemMutations } from '../../utils/hooks/schedule/useScheduleItemMutations';
import {
  TScheduleItemCreateMutationVariables,
  TScheduleItemDeleteMutationVariables,
  TScheduleItemUpdateMutationVariables,
} from '../../api/schedule/schedule.service';
import { Stack } from '@mui/material';
import {
  ScheduleFilters,
  TScheduleFilter,
} from '../../components/schedule/schedule-filters';
import { E_SCHEDULE_ITEM_ENTITY_KEYS } from '../../api/schedule/types';
import { E_COURSE_ACTIVITY_ENTITY_KEYS } from '../../api/course-activities/types';
import { E_CLASS_ENTITY_KEYS } from '../../api/class/types';
import { E_USER_ENTITY_KEYS } from '../../api/user/types';

export const ScheduleCommon = (): JSX.Element => {
  const { data, refetch } = useScheduleItems();
  const [filter, setFilter] = useState<TScheduleFilter>({
    [E_SCHEDULE_ITEM_ENTITY_KEYS.TEACHER]: null,
    [E_SCHEDULE_ITEM_ENTITY_KEYS.CLASS]: null,
    [E_SCHEDULE_ITEM_ENTITY_KEYS.COURSE_ACTIVITY]: null,
  });

  const handleFilterChange = (_filter: TScheduleFilter) => {
    setFilter(_filter);
  };

  const filteredData = useMemo(() => {
    if (!data) return [];

    const {
      [E_SCHEDULE_ITEM_ENTITY_KEYS.TEACHER]: teacher,
      [E_SCHEDULE_ITEM_ENTITY_KEYS.CLASS]: classID,
      [E_SCHEDULE_ITEM_ENTITY_KEYS.COURSE_ACTIVITY]: courseActivity,
    } = filter;

    return data.filter((item) => {
      if (
        teacher &&
        item[E_SCHEDULE_ITEM_ENTITY_KEYS.TEACHER][E_USER_ENTITY_KEYS.ID] !==
          teacher
      )
        return false;
      if (
        classID &&
        item[E_SCHEDULE_ITEM_ENTITY_KEYS.CLASS][E_CLASS_ENTITY_KEYS.ID] !==
          classID
      )
        return false;
      if (
        courseActivity &&
        item[E_SCHEDULE_ITEM_ENTITY_KEYS.COURSE_ACTIVITY][
          E_COURSE_ACTIVITY_ENTITY_KEYS.ID
        ] !== courseActivity
      )
        return false;

      return true;
    });
  }, [data, filter]);

  return (
    <Stack sx={{ height: '100%' }}>
      <ScheduleFilters onChange={handleFilterChange} />
      <ScheduleCalendar items={filteredData} refetch={refetch} />
    </Stack>
  );
};
