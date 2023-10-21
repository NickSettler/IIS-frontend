import { useCurrentUser } from './useCurrentUser';
import {
  E_ROLE,
  E_ROLE_ENTITY_KEYS,
  E_USER_ENTITY_KEYS,
} from '../../api/user/types';
import { map, some } from 'lodash';
import { E_COURSE_ENTITY_KEYS, TPureCourse } from '../../api/courses/types';

export const courseManageRoles = [
  E_ROLE.ADMIN,
  E_ROLE.GUARANTOR,
  E_ROLE.TEACHER,
] as const;

export type TUseCoursePermissions = {
  canCreateCourse: boolean;
  canUpdateCourse: boolean;
  canDeleteCourse: boolean;
};

export const useCoursePermissions = (
  course?: TPureCourse,
): TUseCoursePermissions => {
  const { currentUser } = useCurrentUser();

  if (!currentUser) {
    return {
      canCreateCourse: false,
      canUpdateCourse: false,
      canDeleteCourse: false,
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
      canCreateCourse: isAdmin || isGuarantor,
      canUpdateCourse: isAdmin || isGuarantor,
      canDeleteCourse: isAdmin || isGuarantor,
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
    canCreateCourse,
    canUpdateCourse,
    canDeleteCourse,
  };
};
