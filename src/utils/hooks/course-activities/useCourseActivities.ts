import { TApiError } from '../../../api/base/types';
import {
  UseQueryResult,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query';
import { E_COURSE_ENTITY_KEYS, TCourse } from '../../../api/course/types';
import CourseActivityService from '../../../api/course-activities/course-activities.service';
import { TCourseActivity } from '../../../api/course-activities/types';

export const useCourseActivities = (
  id: TCourse[E_COURSE_ENTITY_KEYS.ID] | undefined,
  options?: Omit<
    UseQueryOptions<
      Array<TCourseActivity>,
      TApiError,
      Array<TCourseActivity>,
      Array<string>
    >,
    'initialData' | 'queryFn' | 'queryKey'
  > & { initialData?(): undefined },
): UseQueryResult<Array<TCourseActivity>, TApiError> => {
  return useQuery(
    ['course-activities - ', id ?? '__EMPTY'],
    async (): Promise<Array<TCourseActivity>> =>
      id ? CourseActivityService.getCourseActivities(id) : [],
    options,
  );
};
