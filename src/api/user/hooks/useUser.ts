import { E_USER_ENTITY_KEYS, TUserWithRoles } from '../types';
import { TApiError } from '../../base/types';
import { UseQueryResult, useQuery } from '@tanstack/react-query';
import UserService from '../user.service';

export const useUser = (
  userId: TUserWithRoles[E_USER_ENTITY_KEYS.ID] | null,
): UseQueryResult<TUserWithRoles, TApiError> | null => {
  return useQuery(
    ['user', userId],
    async (): Promise<TUserWithRoles | null> =>
      userId ? UserService.getUser(userId) : null,
  );
};
