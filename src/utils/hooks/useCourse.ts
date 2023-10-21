import { TApiError } from '../../api/base/types';
import {
  UseQueryResult,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query';
import { E_COURSE_ENTITY_KEYS, TPureCourse } from '../../api/courses/types';
import CourseService from '../../api/courses/course.service';

export const useCourse = (
  abbr: TPureCourse[E_COURSE_ENTITY_KEYS.ABBR] | undefined,
  options?: Omit<
    UseQueryOptions<
      TPureCourse | null,
      TApiError,
      TPureCourse | null,
      Array<string | null>
    >,
    'initialData' | 'queryFn' | 'queryKey'
  > & { initialData?(): undefined },
): UseQueryResult<TPureCourse | null, TApiError> => {
  return useQuery(
    ['course', abbr ?? null],
    async (): Promise<TPureCourse | null> =>
      abbr ? CourseService.getCourse(abbr) : null,
    options,
  );
};
