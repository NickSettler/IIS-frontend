import { BaseService } from '../base/service';
import { E_CLASS_ENTITY_KEYS, TClass } from './types';
import Api from '../base/api';

export type TClassCreateData = TClass;

export type TClassUpdateData = Partial<TClassCreateData>;

export type TClassCreateMutationVariables = {
  data: TClassCreateData;
};

export type TClassUpdateMutationVariables = {
  [E_CLASS_ENTITY_KEYS.ABBR]: TClass[E_CLASS_ENTITY_KEYS.ABBR];
  data: TClassUpdateData;
};

export type TClassDeleteMutationVariables = {
  [E_CLASS_ENTITY_KEYS.ABBR]: TClass[E_CLASS_ENTITY_KEYS.ABBR];
};

export default class ClassService extends BaseService {
  protected static readonly endpoint = '/classes';

  public static async getClasses(): Promise<Array<TClass>> {
    return await Api.instance.get<Array<TClass>>(this.endpoint);
  }

  public static async getClass(
    abbr: TClass[E_CLASS_ENTITY_KEYS.ABBR],
  ): Promise<TClass> {
    return await Api.instance.get<TClass>(`${this.endpoint}/${abbr}`);
  }

  public static async createClass(data: TClassCreateData): Promise<TClass> {
    return await Api.instance.post<TClassCreateData, TClass>(
      this.endpoint,
      data,
    );
  }

  public static async updateClass(
    abbr: TClass[E_CLASS_ENTITY_KEYS.ABBR],
    data: TClassUpdateData,
  ): Promise<TClass> {
    return await Api.instance.put<TClassUpdateData, TClass>(
      `${this.endpoint}/${abbr}`,
      data,
    );
  }

  public static async deleteClass(
    abbr: TClass[E_CLASS_ENTITY_KEYS.ABBR],
  ): Promise<void> {
    await Api.instance.delete<void>(`${this.endpoint}/${abbr}`);
  }
}
