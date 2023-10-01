import axios, { AxiosInstance } from "axios";

export default class Api {
  private static _instance: AxiosInstance;

  private static createInstance(): AxiosInstance {
    return axios.create({
      url: process.env.REACT_APP_API_URL,
    });
  }

  public static get instance(): Api {
    if (!this._instance) this._instance = this.createInstance();

    return this;
  }
}
