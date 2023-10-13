import axios, { AxiosInstance, AxiosResponse } from 'axios';
import LocalStorage, { E_LOCAL_STORAGE_KEYS } from '../../utils/local-storage';
import { parseJWT } from '../../utils/jwt';

/**
 * API class (Singleton)
 * @class Api
 */
export default class Api {
  /**
   * API instance
   * @private
   */
  private static _instance: Api;

  /**
   * Axios instance
   * @private
   */
  private _axiosInstance: AxiosInstance;

  private constructor() {
    this._axiosInstance = axios.create({
      baseURL: process.env.REACT_APP_API_URL,
    });

    this._axiosInstance.interceptors.request.use((config) => {
      const accessToken = LocalStorage.getItem<string>(
        E_LOCAL_STORAGE_KEYS.ACCESS_TOKEN,
      );

      if (!accessToken) return config;

      try {
        const jwtToken = parseJWT(accessToken);
        if (jwtToken.exp * 1000 < Date.now()) throw new Error('Token expired');
      } catch (e) {
        // TODO: Refresh token
      }

      config.headers.Authorization = `Bearer ${accessToken}`;

      return config;
    });

    this._axiosInstance.interceptors.response.use(async (response) => {
      if (response.status === 401) {
        // TODO: Refresh token
        return this._axiosInstance.request(response.config);
      }

      return response;
    });
  }

  /**
   * Get API instance
   */
  public static get instance(): Api {
    if (!this._instance) this._instance = new Api();

    return this._instance;
  }

  /**
   * Send GET request to API
   * @param url - API endpoint
   */
  public async get<Response>(url: string): Promise<Response> {
    return await this._axiosInstance
      .get<Response>(url)
      .then((response) => response.data);
  }

  /**
   * Send POST request to API
   * @param url - API endpoint
   * @param data - Data to send
   */
  public async post<Data, Response>(
    url: string,
    data: Data,
  ): Promise<Response> {
    return await this._axiosInstance
      .post<Response, AxiosResponse<Response>, Data>(url, data)
      .then((response) => response.data);
  }

  /**
   * Send PUT request to API
   * @param url - API endpoint
   * @param data - Data to send
   */
  public async put<Data, Response>(url: string, data: Data): Promise<Response> {
    return await this._axiosInstance
      .put<Response, AxiosResponse<Response>, Data>(url, data)
      .then((response) => response.data);
  }

  /**
   * Send DELETE request to API
   * @param url - API endpoint
   */
  public async delete<Response>(url: string): Promise<Response> {
    return await this._axiosInstance
      .delete<Response>(url)
      .then((response) => response.data);
  }
}
