import {
  E_USER_ENTITY_KEYS,
  TApiUserWithRoles,
  TUser,
} from '../../api/user/types';
import { TApiError } from '../../api/base/types';
import { UseQueryResult, useQuery } from '@tanstack/react-query';
import UserService from '../../api/user/user.service';

export const useUser = (
  userId: TUser[E_USER_ENTITY_KEYS.ID] | null,
): UseQueryResult<TApiUserWithRoles, TApiError> | null => {
  return useQuery(
    ['user', userId],
    async (): Promise<TApiUserWithRoles | null> =>
      userId ? UserService.getUser(userId) : null,
  );
};
