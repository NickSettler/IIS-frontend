import { TApiError } from '../../../api/base/types';
import {
  UseQueryResult,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query';
import CourseActivityService from '../../../api/course-activities/course-activities.service';
import {
  E_COURSE_ACTIVITY_ENTITY_KEYS,
  TCourseActivity,
} from '../../../api/course-activities/types';

export const useCourseActivity = (
  id: TCourseActivity[E_COURSE_ACTIVITY_ENTITY_KEYS.ID],
  options?: Omit<
    UseQueryOptions<TCourseActivity, TApiError, TCourseActivity, Array<string>>,
    'initialData' | 'queryFn' | 'queryKey'
  > & { initialData?(): undefined },
): UseQueryResult<TCourseActivity, TApiError> => {
  return useQuery(
    ['course-activity - ', id],
    async (): Promise<TCourseActivity> =>
      CourseActivityService.getCourseActivity(id),
    options,
  );
};
