import axios, { AxiosInstance, AxiosResponse } from 'axios';

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
      console.log(config);
      return config;
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
