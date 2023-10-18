import { BaseService } from '../base/service';
import { E_USER_ENTITY_KEYS, TUser } from '../user/types';
import Api from '../base/api';

export type TAuthLoginMutationVariables = {
  [E_USER_ENTITY_KEYS.USERNAME]: TUser[E_USER_ENTITY_KEYS.USERNAME];
  password: string;
};

export type TAuthRegisterMutationVariables = TAuthLoginMutationVariables & {
  [E_USER_ENTITY_KEYS.FIRST_NAME]: TUser[E_USER_ENTITY_KEYS.FIRST_NAME];
  [E_USER_ENTITY_KEYS.LAST_NAME]: TUser[E_USER_ENTITY_KEYS.LAST_NAME];
};

export type TAuthLoginResponse = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};

export default class AuthService extends BaseService {
  protected static readonly endpoint = '/auth';

  public static async signIn(
    username: TUser[E_USER_ENTITY_KEYS.USERNAME],
    password: string,
  ): Promise<TAuthLoginResponse> {
    return await Api.instance.post<
      TAuthLoginMutationVariables,
      TAuthLoginResponse
    >(`${this.endpoint}/sign-in`, {
      [E_USER_ENTITY_KEYS.USERNAME]: username,
      password,
    });
  }

  public static async signUp(
    firstName: TUser[E_USER_ENTITY_KEYS.FIRST_NAME],
    lastName: TUser[E_USER_ENTITY_KEYS.LAST_NAME],
    username: TUser[E_USER_ENTITY_KEYS.USERNAME],
    password: string,
  ): Promise<TAuthLoginResponse> {
    return await Api.instance.post<
      TAuthRegisterMutationVariables,
      TAuthLoginResponse
    >(`${this.endpoint}/sign-up`, {
      [E_USER_ENTITY_KEYS.FIRST_NAME]: firstName,
      [E_USER_ENTITY_KEYS.LAST_NAME]: lastName,
      [E_USER_ENTITY_KEYS.USERNAME]: username,
      password,
    });
  }
}
