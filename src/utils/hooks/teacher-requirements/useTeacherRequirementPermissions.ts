import { useCurrentUser } from '../user/useCurrentUser';
import {
  E_ROLE,
  E_ROLE_ENTITY_KEYS,
  E_USER_ENTITY_KEYS,
} from '../../../api/user/types';
import { map } from 'lodash';
import { TUseGenericPermissions } from '../../../components/data-grid/generic-toolbar';

export const teacherManageRoles = [E_ROLE.TEACHER] as const;

export const useTeacherRequirementPermissions = (): TUseGenericPermissions => {
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
  const isTeacher = userRoles.includes(E_ROLE.TEACHER);

  return {
    canCreate: isAdmin || isTeacher,
    canUpdate: isAdmin || isTeacher,
    canDelete: isAdmin || isTeacher,
  };
};
