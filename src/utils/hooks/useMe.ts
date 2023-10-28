import { TApiUserWithRoles } from '../../api/user/types';
import { TApiError } from '../../api/base/types';
import {
  UseQueryResult,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query';
import UserService from '../../api/user/user.service';

export const useMe = (
  options?: Omit<
    UseQueryOptions<
      TApiUserWithRoles | null,
      TApiError,
      TApiUserWithRoles | null,
      Array<string>
    >,
    'initialData' | 'queryFn' | 'queryKey'
  > & { initialData?(): undefined },
): UseQueryResult<TApiUserWithRoles | null, TApiError> => {
  return useQuery(
    ['user', 'me'],
    async (): Promise<TApiUserWithRoles> => UserService.getMe(),
    options,
  );
};
