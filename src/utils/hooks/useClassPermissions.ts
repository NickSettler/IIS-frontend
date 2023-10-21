import { useCurrentUser } from './useCurrentUser';
import {
  E_ROLE,
  E_ROLE_ENTITY_KEYS,
  E_USER_ENTITY_KEYS,
} from '../../api/user/types';
import { map } from 'lodash';

export const classManageRoles = [E_ROLE.ADMIN] as const;

export type TUseClassPermissions = {
  canCreateClass: boolean;
  canUpdateClass: boolean;
  canDeleteClass: boolean;
};

export const useClassPermissions = (): TUseClassPermissions => {
  const { currentUser } = useCurrentUser();

  if (!currentUser) {
    return {
      canCreateClass: false,
      canUpdateClass: false,
      canDeleteClass: false,
    };
  }

  const userRoles = map(
    currentUser[E_USER_ENTITY_KEYS.ROLES],
    E_ROLE_ENTITY_KEYS.NAME,
  );

  const isAdmin = userRoles.includes(E_ROLE.ADMIN);

  return {
    canCreateClass: isAdmin,
    canUpdateClass: isAdmin,
    canDeleteClass: isAdmin,
  };
};
