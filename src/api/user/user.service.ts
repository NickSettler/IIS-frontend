import { BaseService } from '../base/service';
import {
  E_ROLE,
  E_USER_ENTITY_KEYS,
  TApiUser,
  TApiUserWithRoles,
  TUser,
} from './types';
import Api from '../base/api';

export type TUserCreateData = Omit<TUser, E_USER_ENTITY_KEYS.ID>;

export type TUserUpdateData = Partial<TUserCreateData>;

export type TUserAssignRoleMutationVariables = {
  [E_USER_ENTITY_KEYS.ID]: TUser[E_USER_ENTITY_KEYS.ID];
  role: E_ROLE;
};

export type TUserCreateMutationVariables = {
  data: TUserCreateData;
};

export type TUserUpdateMutationVariables = {
  [E_USER_ENTITY_KEYS.ID]: TUser[E_USER_ENTITY_KEYS.ID];
  data: TUserUpdateData;
};

export type TUserDeleteMutationVariables = {
  [E_USER_ENTITY_KEYS.ID]: TUser[E_USER_ENTITY_KEYS.ID];
};

export default class UserService extends BaseService {
  protected static readonly endpoint = '/users';

  public static async getUsers(): Promise<Array<TApiUserWithRoles>> {
    return await Api.instance.get<Array<TApiUserWithRoles>>(this.endpoint);
  }

  public static async getUser(
    id: TApiUser[E_USER_ENTITY_KEYS.ID],
  ): Promise<TApiUserWithRoles> {
    return await Api.instance.get<TApiUserWithRoles>(`${this.endpoint}/${id}`);
  }

  public static async getMe(): Promise<TApiUser> {
    return await Api.instance.get<TApiUser>(`${this.endpoint}/me`);
  }

  public static async createUser(
    data: TUserCreateData,
  ): Promise<TApiUserWithRoles> {
    return await Api.instance.post<TUserCreateData, TApiUserWithRoles>(
      `${this.endpoint}`,
      data,
    );
  }

  public static async updateUser(
    id: TUser[E_USER_ENTITY_KEYS.ID],
    data: TUserUpdateData,
  ): Promise<TApiUserWithRoles> {
    return await Api.instance.put<TUserUpdateData, TApiUserWithRoles>(
      `${this.endpoint}/${id}`,
      data,
    );
  }

  public static async deleteUser(
    id: TUser[E_USER_ENTITY_KEYS.ID],
  ): Promise<void> {
    await Api.instance.delete(`${this.endpoint}/${id}`);
  }

  public static async assignRole(
    id: TUser[E_USER_ENTITY_KEYS.ID],
    role: E_ROLE,
  ): Promise<TApiUserWithRoles> {
    return await Api.instance.post<Record<string, never>, TApiUserWithRoles>(
      `${this.endpoint}/${id}/role/${role}`,
      {},
    );
  }
}
