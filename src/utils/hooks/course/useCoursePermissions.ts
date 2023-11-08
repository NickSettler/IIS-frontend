import { useCurrentUser } from '../user/useCurrentUser';
import {
  E_ROLE,
  E_ROLE_ENTITY_KEYS,
  E_USER_ENTITY_KEYS,
} from '../../../api/user/types';
import { map, some } from 'lodash';
import { E_COURSE_ENTITY_KEYS, TPureCourse } from '../../../api/course/types';

export const courseManageRoles = [
  E_ROLE.ADMIN,
  E_ROLE.GUARANTOR,
  E_ROLE.TEACHER,
] as const;

export type TUseCoursePermissions = {
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
};

export const useCoursePermissions = (
  course?: TPureCourse,
): TUseCoursePermissions => {
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

  if (!course) {
    return {
      canCreate: isAdmin || isGuarantor,
      canUpdate: isAdmin || isGuarantor,
      canDelete: isAdmin || isGuarantor,
    };
  }

  const canCreateCourse = some(courseManageRoles, (role) =>
    userRoles.includes(role),
  );

  let canUpdateCourse = false;

  if (isGuarantor)
    canUpdateCourse =
      course[E_COURSE_ENTITY_KEYS.GUARANTOR][E_USER_ENTITY_KEYS.ID] ===
      currentUser[E_USER_ENTITY_KEYS.ID];

  if (isAdmin) canUpdateCourse = true;

  let canDeleteCourse = false;

  if (isGuarantor)
    canDeleteCourse =
      course[E_COURSE_ENTITY_KEYS.GUARANTOR][E_USER_ENTITY_KEYS.ID] ===
      currentUser[E_USER_ENTITY_KEYS.ID];

  if (isAdmin) canDeleteCourse = true;

  return {
    canCreate: canCreateCourse,
    canUpdate: canUpdateCourse,
    canDelete: canDeleteCourse,
  };
};
