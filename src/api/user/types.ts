export enum E_PERMISSION_ENTITY_KEYS {
  NAME = 'name',
}

export type TPermission = {
  [E_PERMISSION_ENTITY_KEYS.NAME]: string;
};

export enum E_ROLE {
  ADMIN = 'ADMIN',
  GUARANTOR = 'GUARANTOR',
  TEACHER = 'TEACHER',
  SCHEDULER = 'SCHEDULER',
  STUDENT = 'STUDENT',
  GUEST = 'GUEST',
}

export enum E_ROLE_ENTITY_KEYS {
  NAME = 'name',
  PERMISSIONS = 'permissions',
}

export type TUserRole = {
  [E_ROLE_ENTITY_KEYS.NAME]: E_ROLE;
};

export type TUserRoleWithPermissions = TUserRole & {
  [E_ROLE_ENTITY_KEYS.PERMISSIONS]: Array<TPermission>;
};

export enum E_USER_ENTITY_KEYS {
  ID = 'id',
  USERNAME = 'username',
  PASSWORD = 'password',
  FIRST_NAME = 'first_name',
  LAST_NAME = 'last_name',
  ROLES = 'roles',
}

export type TApiUser = {
  [E_USER_ENTITY_KEYS.ID]: string;
  [E_USER_ENTITY_KEYS.USERNAME]: string;
  [E_USER_ENTITY_KEYS.FIRST_NAME]: string;
  [E_USER_ENTITY_KEYS.LAST_NAME]: string;
};

export type TUser = TApiUser & {
  [E_USER_ENTITY_KEYS.PASSWORD]: string;
};

export type TApiUserWithRoles = TApiUser & {
  [E_USER_ENTITY_KEYS.ROLES]: Array<TUserRoleWithPermissions>;
};

export type TUserWithRoles = TUser & {
  [E_USER_ENTITY_KEYS.ROLES]: Array<TUserRoleWithPermissions>;
};
