import { TApiError } from '../../../api/base/types';
import { UseQueryResult, UseQueryOptions } from '@tanstack/react-query';
import { TApiUserWithRoles } from '../../../api/user/types';
import { applyFilters, filterTeachers } from '../../react-query/transforms';
import { useUsers } from './useUsers';

export const useTeachers = (
  options?: Omit<
    UseQueryOptions<
      Array<TApiUserWithRoles>,
      TApiError,
      Array<TApiUserWithRoles>,
      Array<string>
    >,
    'initialData' | 'queryFn' | 'queryKey'
  > & { initialData?(): undefined },
): UseQueryResult<Array<TApiUserWithRoles>, TApiError> => {
  return useUsers({
    ...options,
    select: applyFilters(filterTeachers).bind(this),
  });
};
