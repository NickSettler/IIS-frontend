import { TUseGenericPermissions } from '../../../components/data-grid/generic-toolbar';
import { useCurrentUser } from '../user/useCurrentUser';
import { map } from 'lodash';
import {
  E_ROLE,
  E_ROLE_ENTITY_KEYS,
  E_USER_ENTITY_KEYS,
} from '../../../api/user/types';

export const useSchedulePermissions = (): TUseGenericPermissions => {
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
  const isScheduler = userRoles.includes(E_ROLE.SCHEDULER);

  return {
    canCreate: isAdmin || isScheduler,
    canUpdate: isAdmin || isScheduler,
    canDelete: isAdmin || isScheduler,
  };
};
