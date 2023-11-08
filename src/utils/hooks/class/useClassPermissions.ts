import { useCurrentUser } from '../user/useCurrentUser';
import {
  E_ROLE,
  E_ROLE_ENTITY_KEYS,
  E_USER_ENTITY_KEYS,
} from '../../../api/user/types';
import { map } from 'lodash';

export const classManageRoles = [E_ROLE.ADMIN] as const;

export type TUseClassPermissions = {
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
};

export const useClassPermissions = (): TUseClassPermissions => {
  const { currentUser } = useCurrentUser();

  if (!currentUser) {
    return {
      canCreate: false,
      canUpdate: false,
      canDelete: false,
    };
  }

  const userRoles = map(
    currentUser[E_USER_ENTITY_KEYS.ROLES],
    E_ROLE_ENTITY_KEYS.NAME,
  );

  const isAdmin = userRoles.includes(E_ROLE.ADMIN);

  return {
    canCreate: isAdmin,
    canUpdate: isAdmin,
    canDelete: isAdmin,
  };
};
