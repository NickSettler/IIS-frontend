import { JSX, SyntheticEvent, useEffect, useState } from 'react';
import { E_USER_ENTITY_KEYS, TApiUser } from '../../api/user/types';
import { E_CLASS_ENTITY_KEYS, TClass } from '../../api/class/types';
import {
  E_COURSE_ACTIVITY_ENTITY_KEYS,
  TCourseActivity,
} from '../../api/course-activities/types';
import { Autocomplete, Stack, TextField } from '@mui/material';
import { E_SCHEDULE_ITEM_ENTITY_KEYS } from '../../api/schedule/types';
import { map } from 'lodash';
import { AutocompleteValue } from '@mui/base/useAutocomplete/useAutocomplete';
import { useTeachers } from '../../utils/hooks/user/useTeachers';
import { useScheduleFiltersLabeling } from '../../utils/hooks/schedule/useScheduleFiltersLabeling';
import { useClasses } from '../../utils/hooks/class/useClasses';
import { useCourseActivities } from '../../utils/hooks/course-activities/useCourseActivities';
import { useLocation, useNavigate } from 'react-router-dom';

export type TScheduleFilter = {
  [E_SCHEDULE_ITEM_ENTITY_KEYS.TEACHER]: TApiUser[E_USER_ENTITY_KEYS.ID] | null;
  [E_SCHEDULE_ITEM_ENTITY_KEYS.CLASS]: TClass[E_CLASS_ENTITY_KEYS.ID] | null;
  [E_SCHEDULE_ITEM_ENTITY_KEYS.COURSE_ACTIVITY]:
    | TCourseActivity[E_COURSE_ACTIVITY_ENTITY_KEYS.ID]
    | null;
};

export type TScheduleFiltersProps = {
  onChange(filter: TScheduleFilter): void;
};

export const ScheduleFilters = ({
  onChange,
}: TScheduleFiltersProps): JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();

  const { search } = location;
  const searchParams = new URLSearchParams(search);

  const { data: teachersData } = useTeachers();
  const { data: classesData } = useClasses();
  const { data: courseActivitiesData } = useCourseActivities();

  const [filter, setFilter] = useState<TScheduleFilter>({
    [E_SCHEDULE_ITEM_ENTITY_KEYS.TEACHER]: searchParams.get(
      E_SCHEDULE_ITEM_ENTITY_KEYS.TEACHER,
    ),
    [E_SCHEDULE_ITEM_ENTITY_KEYS.CLASS]: searchParams.get(
      E_SCHEDULE_ITEM_ENTITY_KEYS.CLASS,
    ),
    [E_SCHEDULE_ITEM_ENTITY_KEYS.COURSE_ACTIVITY]: searchParams.get(
      E_SCHEDULE_ITEM_ENTITY_KEYS.COURSE_ACTIVITY,
    ),
  });

  const handleChange =
    (field: keyof TScheduleFilter) =>
    (
      _: SyntheticEvent,
      value: AutocompleteValue<
        TScheduleFilter[E_SCHEDULE_ITEM_ENTITY_KEYS.TEACHER],
        false,
        false,
        false
      >,
    ) => {
      setFilter((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

  const { getTeacherLabel, getClassLabel, getCourseActivityLabel } =
    useScheduleFiltersLabeling({
      teachersData,
      classesData,
      courseActivitiesData,
    });

  useEffect(() => {
    const teacher = searchParams.get(E_SCHEDULE_ITEM_ENTITY_KEYS.TEACHER);
    const classID = searchParams.get(E_SCHEDULE_ITEM_ENTITY_KEYS.CLASS);
    const courseActivity = searchParams.get(
      E_SCHEDULE_ITEM_ENTITY_KEYS.COURSE_ACTIVITY,
    );

    setFilter((prev) => ({
      ...prev,
      [E_SCHEDULE_ITEM_ENTITY_KEYS.TEACHER]: teacher,
      [E_SCHEDULE_ITEM_ENTITY_KEYS.CLASS]: classID,
      [E_SCHEDULE_ITEM_ENTITY_KEYS.COURSE_ACTIVITY]: courseActivity,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    onChange(filter);

    const {
      [E_SCHEDULE_ITEM_ENTITY_KEYS.TEACHER]: teacher,
      [E_SCHEDULE_ITEM_ENTITY_KEYS.CLASS]: classID,
      [E_SCHEDULE_ITEM_ENTITY_KEYS.COURSE_ACTIVITY]: courseActivity,
    } = filter;

    const hasTeacherChanged =
      searchParams.get(E_SCHEDULE_ITEM_ENTITY_KEYS.TEACHER) !== teacher;
    const hasClassChanged =
      searchParams.get(E_SCHEDULE_ITEM_ENTITY_KEYS.CLASS) !== classID;
    const hasCourseActivityChanged =
      searchParams.get(E_SCHEDULE_ITEM_ENTITY_KEYS.COURSE_ACTIVITY) !==
      courseActivity;

    if (hasTeacherChanged)
      if (teacher)
        searchParams.set(E_SCHEDULE_ITEM_ENTITY_KEYS.TEACHER, teacher);
      else searchParams.delete(E_SCHEDULE_ITEM_ENTITY_KEYS.TEACHER);

    if (hasClassChanged)
      if (classID) searchParams.set(E_SCHEDULE_ITEM_ENTITY_KEYS.CLASS, classID);
      else searchParams.delete(E_SCHEDULE_ITEM_ENTITY_KEYS.CLASS);

    if (hasCourseActivityChanged)
      if (courseActivity)
        searchParams.set(
          E_SCHEDULE_ITEM_ENTITY_KEYS.COURSE_ACTIVITY,
          courseActivity,
        );
      else searchParams.delete(E_SCHEDULE_ITEM_ENTITY_KEYS.COURSE_ACTIVITY);

    if (hasTeacherChanged || hasClassChanged || hasCourseActivityChanged)
      navigate(
        {
          search: searchParams.toString(),
        },
        {
          replace: true,
        },
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  return (
    <Stack direction={'row'} sx={{ width: '100%', px: 3, py: 1 }} spacing={3}>
      <Autocomplete
        fullWidth
        size={'small'}
        value={filter[E_SCHEDULE_ITEM_ENTITY_KEYS.TEACHER]}
        getOptionLabel={getTeacherLabel}
        renderInput={(params) => (
          <TextField {...params} label={'Teacher'}></TextField>
        )}
        disabled={teachersData?.length === 0}
        onChange={handleChange(E_SCHEDULE_ITEM_ENTITY_KEYS.TEACHER)}
        options={map(teachersData, E_USER_ENTITY_KEYS.ID)}
      />
      <Autocomplete
        fullWidth
        size={'small'}
        value={filter[E_SCHEDULE_ITEM_ENTITY_KEYS.CLASS]}
        getOptionLabel={getClassLabel}
        renderInput={(params) => (
          <TextField {...params} label={'Class'}></TextField>
        )}
        disabled={classesData?.length === 0}
        onChange={handleChange(E_SCHEDULE_ITEM_ENTITY_KEYS.CLASS)}
        options={map(classesData, E_USER_ENTITY_KEYS.ID)}
      />
      <Autocomplete
        fullWidth
        size={'small'}
        value={filter[E_SCHEDULE_ITEM_ENTITY_KEYS.COURSE_ACTIVITY]}
        getOptionLabel={getCourseActivityLabel}
        renderInput={(params) => (
          <TextField {...params} label={'Course Activity'}></TextField>
        )}
        disabled={courseActivitiesData?.length === 0}
        onChange={handleChange(E_SCHEDULE_ITEM_ENTITY_KEYS.COURSE_ACTIVITY)}
        options={map(courseActivitiesData, E_USER_ENTITY_KEYS.ID)}
      />
    </Stack>
  );
};
