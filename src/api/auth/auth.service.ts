import { BaseService } from '../base/service';
import { E_USER_ENTITY_KEYS, TUser } from '../user/types';
import Api from '../base/api';

export type TAuthLoginMutationVariables = {
  [E_USER_ENTITY_KEYS.USERNAME]: string;
  password: string;
};

export type TAuthRegisterMutationVariables = {
  [E_USER_ENTITY_KEYS.USERNAME]: string;
  password: string;
  [E_USER_ENTITY_KEYS.FIRST_NAME]: string;
  [E_USER_ENTITY_KEYS.LAST_NAME]: string;
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
    >(`${this.endpoint}/sign-in`, { username, password });
  }

  public static async signUp(
    username: TUser[E_USER_ENTITY_KEYS.USERNAME],
    firstName: string,
    lastName: string,
    password: string,
  ): Promise<TAuthLoginResponse> {
    return await Api.instance.post<
      TAuthRegisterMutationVariables,
      TAuthLoginResponse
    >(`${this.endpoint}/sign-up`, {
      [E_USER_ENTITY_KEYS.USERNAME]: username,
      [E_USER_ENTITY_KEYS.FIRST_NAME]: firstName,
      [E_USER_ENTITY_KEYS.LAST_NAME]: lastName,
      password,
    });
  }
}
