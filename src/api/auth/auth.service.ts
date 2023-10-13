import { BaseService } from '../base/service';
import { E_USER_ENTITY_KEYS, TUser } from '../user/types';
import Api from '../base/api';

export type TAuthLoginMutationVariables = {
  [E_USER_ENTITY_KEYS.USERNAME]: string;
  password: string;
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
    password: string,
  ): Promise<TAuthLoginResponse> {
    return await Api.instance.post<
      TAuthLoginMutationVariables,
      TAuthLoginResponse
    >(`${this.endpoint}/sign-up`, { username, password });
  }
}
