import { TApiError } from '../../../api/base/types';
import {
  UseQueryResult,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query';
import { TPublicCourse } from '../../../api/course/types';
import CourseService from '../../../api/course/course.service';

export const usePublicCourses = (
  options?: Omit<
    UseQueryOptions<
      Array<TPublicCourse>,
      TApiError,
      Array<TPublicCourse>,
      Array<string>
    >,
    'initialData' | 'queryFn' | 'queryKey'
  > & { initialData?(): undefined },
): UseQueryResult<Array<TPublicCourse>, TApiError> => {
  return useQuery(
    ['getPublicCourses'],
    async (): Promise<Array<TPublicCourse>> => CourseService.getPublicCourses(),
    options,
  );
};
