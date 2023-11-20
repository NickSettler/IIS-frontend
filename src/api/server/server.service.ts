import { BaseService } from '../base/service';
import Api from '../base/api';

export default class ServerService extends BaseService {
  protected static readonly endpoint = '/server';

  public static async restart(): Promise<void> {
    await Api.instance.get(`${this.endpoint}/restart`);
  }
}
