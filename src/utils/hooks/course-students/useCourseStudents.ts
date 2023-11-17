import { TApiError } from '../../../api/base/types';
import {
  UseQueryResult,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query';
import { TCourseStudent } from '../../../api/course/types';
import CourseService from '../../../api/course/course.service';

export const useCourseStudents = (
  options?: Omit<
    UseQueryOptions<
      Array<TCourseStudent>,
      TApiError,
      Array<TCourseStudent>,
      Array<string>
    >,
    'initialData' | 'queryFn' | 'queryKey'
  > & { initialData?(): undefined },
): UseQueryResult<Array<TCourseStudent>, TApiError> => {
  return useQuery(
    ['course-students__ALL'],
    async (): Promise<Array<TCourseStudent>> =>
      CourseService.getCourseStudents(),
    options,
  );
};
