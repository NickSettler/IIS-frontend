import { TApiError } from '../../../api/base/types';
import {
  UseQueryResult,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query';
import {
  E_COURSE_ENTITY_KEYS,
  TCourse,
  TCourseWithStudents,
} from '../../../api/course/types';
import CourseService from '../../../api/course/course.service';

export const useCourse = (
  id: TCourse[E_COURSE_ENTITY_KEYS.ID] | undefined,
  options?: Omit<
    UseQueryOptions<
      TCourseWithStudents | null,
      TApiError,
      TCourseWithStudents | null,
      Array<string | null>
    >,
    'initialData' | 'queryFn' | 'queryKey'
  > & { initialData?(): undefined },
): UseQueryResult<TCourseWithStudents | null, TApiError> => {
  return useQuery(
    ['course', id ?? null],
    async (): Promise<TCourseWithStudents | null> =>
      id ? CourseService.getCourse(id) : null,
    options,
  );
};
