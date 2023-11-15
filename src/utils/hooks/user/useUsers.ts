import { TApiError } from '../../../api/base/types';
import {
  UseQueryResult,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query';
import { TApiUserWithRoles } from '../../../api/user/types';
import UserService from '../../../api/user/user.service';

export const useUsers = (
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
  return useQuery(
    ['getUsers'],
    async (): Promise<Array<TApiUserWithRoles>> => UserService.getUsers(),
    options,
  );
};
