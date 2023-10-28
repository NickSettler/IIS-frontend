import { TApiError } from '../../api/base/types';
import {
  UseQueryResult,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query';
import { E_COURSE_ENTITY_KEYS, TPureCourse } from '../../api/course/types';
import CourseActivityService from '../../api/course-activities/course-activities.service';
import { TApiCourseActivity } from '../../api/course-activities/types';

export const useCourseActivities = (
  abbr: TPureCourse[E_COURSE_ENTITY_KEYS.ABBR] | undefined,
  options?: Omit<
    UseQueryOptions<
      Array<TApiCourseActivity> | null,
      TApiError,
      Array<TApiCourseActivity> | null,
      Array<string | null>
    >,
    'initialData' | 'queryFn' | 'queryKey'
  > & { initialData?(): undefined },
): UseQueryResult<Array<TApiCourseActivity> | null, TApiError> => {
  return useQuery(
    ['course-activities', abbr ?? null],
    async (): Promise<Array<TApiCourseActivity> | null> =>
      abbr ? CourseActivityService.getCourseActivities(abbr) : null,
    options,
  );
};
