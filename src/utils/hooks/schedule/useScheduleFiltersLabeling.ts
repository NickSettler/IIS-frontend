import { E_SCHEDULE_ITEM_ENTITY_KEYS } from '../../../api/schedule/types';
import { find } from 'lodash';
import { E_USER_ENTITY_KEYS, TApiUserWithRoles } from '../../../api/user/types';
import { TScheduleFilter } from '../../../components/schedule/schedule-filters';
import { E_CLASS_ENTITY_KEYS, TClass } from '../../../api/class/types';
import {
  E_COURSE_ACTIVITY_ENTITY_KEYS,
  TCourseActivity,
} from '../../../api/course-activities/types';
import { E_COURSE_ENTITY_KEYS } from '../../../api/course/types';

export type TUseScheduleFiltersLabeling = {
  getTeacherLabel(
    option: TScheduleFilter[E_SCHEDULE_ITEM_ENTITY_KEYS.TEACHER],
  ): string;
  getClassLabel(
    option: TScheduleFilter[E_SCHEDULE_ITEM_ENTITY_KEYS.CLASS],
  ): string;
  getCourseActivityLabel(
    option: TScheduleFilter[E_SCHEDULE_ITEM_ENTITY_KEYS.COURSE_ACTIVITY],
  ): string;
};

export type TUseScheduleFiltersLabelingProps = {
  teachersData: Array<TApiUserWithRoles> | undefined;
  classesData: Array<TClass> | undefined;
  courseActivitiesData: Array<TCourseActivity> | undefined;
};

export const useScheduleFiltersLabeling = ({
  teachersData,
  classesData,
  courseActivitiesData,
}: TUseScheduleFiltersLabelingProps): TUseScheduleFiltersLabeling => {
  const getTeacherLabel = (
    option: TScheduleFilter[E_SCHEDULE_ITEM_ENTITY_KEYS.TEACHER],
  ) => {
    if (!teachersData || !option) return '';

    const foundTeacher = find(
      teachersData,
      (item) => item[E_USER_ENTITY_KEYS.ID] === option,
    );

    if (!foundTeacher) return '';

    const {
      [E_USER_ENTITY_KEYS.USERNAME]: username,
      [E_USER_ENTITY_KEYS.FIRST_NAME]: firstName,
      [E_USER_ENTITY_KEYS.LAST_NAME]: lastName,
    } = foundTeacher;

    return `${username} (${firstName} ${lastName})`;
  };

  const getClassLabel = (
    option: TScheduleFilter[E_SCHEDULE_ITEM_ENTITY_KEYS.CLASS],
  ) => {
    if (!teachersData || !option) return '';

    const foundClass = find(
      classesData,
      (item) => item[E_CLASS_ENTITY_KEYS.ID] === option,
    );

    if (!foundClass) return '';

    return `${foundClass[E_CLASS_ENTITY_KEYS.ABBR]}`;
  };

  const getCourseActivityLabel = (
    option: TScheduleFilter[E_SCHEDULE_ITEM_ENTITY_KEYS.COURSE_ACTIVITY],
  ) => {
    if (!courseActivitiesData || !option) return '';

    const foundCourseActivity = find(
      courseActivitiesData,
      (item) => item[E_CLASS_ENTITY_KEYS.ID] === option,
    );

    if (!foundCourseActivity) return '';

    const course = foundCourseActivity[E_COURSE_ACTIVITY_ENTITY_KEYS.COURSE];

    return `${course[E_COURSE_ENTITY_KEYS.NAME]} - ${
      foundCourseActivity[E_COURSE_ACTIVITY_ENTITY_KEYS.FORM]
    }`;
  };

  return {
    getTeacherLabel,
    getClassLabel,
    getCourseActivityLabel,
  };
};
