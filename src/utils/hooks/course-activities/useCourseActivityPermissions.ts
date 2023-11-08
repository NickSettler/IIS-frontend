import { useCurrentUser } from '../user/useCurrentUser';
import {
  E_ROLE,
  E_ROLE_ENTITY_KEYS,
  E_USER_ENTITY_KEYS,
} from '../../../api/user/types';
import { map, some } from 'lodash';
import { TUseGenericPermissions } from '../../../components/data-grid/generic-toolbar';

export const useCourseActivityPermissions = (): TUseGenericPermissions => {
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
  const isGuarantor = userRoles.includes(E_ROLE.GUARANTOR);

  return {
    canCreate: isAdmin || isGuarantor,
    canUpdate: isAdmin || isGuarantor,
    canDelete: isAdmin || isGuarantor,
  };
};
