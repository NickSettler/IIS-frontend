import { TApiError } from '../../../api/base/types';
import {
  UseQueryResult,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query';
import { TPureCourse } from '../../../api/course/types';
import CourseService from '../../../api/course/course.service';

export const useCourses = (
  options?: Omit<
    UseQueryOptions<
      Array<TPureCourse>,
      TApiError,
      Array<TPureCourse>,
      Array<string>
    >,
    'initialData' | 'queryFn' | 'queryKey'
  > & { initialData?(): undefined },
): UseQueryResult<Array<TPureCourse>, TApiError> => {
  return useQuery(
    ['getCourses'],
    async (): Promise<Array<TPureCourse>> => CourseService.getCourses(),
    options,
  );
};
