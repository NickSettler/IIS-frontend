import {
  E_USER_ENTITY_KEYS,
  TApiUserWithRoles,
  TUser,
} from '../../api/user/types';
import { TApiError } from '../../api/base/types';
import {
  UseQueryResult,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query';
import UserService from '../../api/user/user.service';

export const useUser = (
  userId: TUser[E_USER_ENTITY_KEYS.ID] | null,
  options?: Omit<
    UseQueryOptions<
      TApiUserWithRoles | null,
      TApiError,
      TApiUserWithRoles | null
    >,
    'queryFn' | 'queryKey'
  >,
): UseQueryResult<TApiUserWithRoles | null, TApiError> => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: async (): Promise<TApiUserWithRoles | null> =>
      userId ? UserService.getUser(userId) : null,
    ...options,
  });
};
