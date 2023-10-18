import { BaseService } from '../base/service';
import { E_ROLE, E_USER_ENTITY_KEYS, TUser, TUserWithRoles } from './types';
import Api from '../base/api';

export type TUserAssignRoleMutationVariables = {
  [E_USER_ENTITY_KEYS.ID]: TUser[E_USER_ENTITY_KEYS.ID];
  role: E_ROLE;
};

export type TUserUpdateMutationVariables = {
  [E_USER_ENTITY_KEYS.ID]: TUser[E_USER_ENTITY_KEYS.ID];
  data: TUserUpdateData;
};

export type TUserUpdateData = Partial<
  Omit<TUserWithRoles, E_USER_ENTITY_KEYS.ID>
>;

export default class UserService extends BaseService {
  protected static readonly endpoint = '/users';

  public static async getUsers(): Promise<Array<TUserWithRoles>> {
    return await Api.instance.get<Array<TUserWithRoles>>(this.endpoint);
  }

  public static async getUser(
    id: TUser[E_USER_ENTITY_KEYS.ID],
  ): Promise<TUserWithRoles> {
    return await Api.instance.get<TUserWithRoles>(`${this.endpoint}/${id}`);
  }

  public static async getMe(): Promise<TUser> {
    return await Api.instance.get<TUser>(`${this.endpoint}/me`);
  }

  public static async updateUser(
    id: TUser[E_USER_ENTITY_KEYS.ID],
    data: TUserUpdateData,
  ): Promise<TUserWithRoles> {
    return await Api.instance.put<TUserUpdateData, TUserWithRoles>(
      `${this.endpoint}/${id}`,
      data,
    );
  }

  public static async assignRole(
    id: TUser[E_USER_ENTITY_KEYS.ID],
    role: E_ROLE,
  ) {
    return await Api.instance.post<Record<string, never>, TUserWithRoles>(
      `${this.endpoint}/${id}/role/${role}`,
      {},
    );
  }
}
