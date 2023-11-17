import { TApiError } from '../../../api/base/types';
import {
  UseQueryResult,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query';
import { TCourse } from '../../../api/course/types';
import CourseService from '../../../api/course/course.service';

export const useCourses = (
  options?: Omit<
    UseQueryOptions<Array<TCourse>, TApiError, Array<TCourse>, Array<string>>,
    'initialData' | 'queryFn' | 'queryKey'
  > & { initialData?(): undefined },
): UseQueryResult<Array<TCourse>, TApiError> => {
  return useQuery(
    ['getCourses'],
    async (): Promise<Array<TCourse>> => CourseService.getCourses(),
    options,
  );
};
