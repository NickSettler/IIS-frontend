import { TApiError } from '../../../api/base/types';
import {
  UseQueryResult,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query';
import { E_COURSE_ENTITY_KEYS, TPureCourse } from '../../../api/course/types';
import CourseActivityService from '../../../api/course-activities/course-activities.service';
import { TApiCourseActivity } from '../../../api/course-activities/types';

export const useCourseActivities = (
  id: TPureCourse[E_COURSE_ENTITY_KEYS.ID] | undefined,
  options?: Omit<
    UseQueryOptions<
      Array<TApiCourseActivity>,
      TApiError,
      Array<TApiCourseActivity>,
      Array<string>
    >,
    'initialData' | 'queryFn' | 'queryKey'
  > & { initialData?(): undefined },
): UseQueryResult<Array<TApiCourseActivity>, TApiError> => {
  return useQuery(
    ['course-activities - ', id ?? '__EMPTY'],
    async (): Promise<Array<TApiCourseActivity>> =>
      id ? CourseActivityService.getCourseActivities(id) : [],
    options,
  );
};
