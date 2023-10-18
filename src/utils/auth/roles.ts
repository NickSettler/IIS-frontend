import {
  E_ROLE,
  E_ROLE_ENTITY_KEYS,
  E_USER_ENTITY_KEYS,
  TApiUserWithRoles,
} from '../../api/user/types';
import { map, some } from 'lodash';

export const userHasRoles = (
  user: TApiUserWithRoles | null,
  roles: Array<E_ROLE> | null,
): boolean => {
  if (!user) return false;

  if (!roles || roles.length === 0) return true;

  const userRoles = map(
    user?.[E_USER_ENTITY_KEYS.ROLES],
    (role) => role[E_ROLE_ENTITY_KEYS.NAME],
  );

  return some(roles, (role: E_ROLE) => userRoles.includes(role));
};
