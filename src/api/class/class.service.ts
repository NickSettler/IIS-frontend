import { BaseService } from '../base/service';
import { E_CLASS_ENTITY_KEYS, TClass } from './types';
import Api from '../base/api';

export type TClassCreateData = Omit<TClass, E_CLASS_ENTITY_KEYS.ID>;

export type TClassUpdateData = Partial<TClassCreateData>;

export type TClassCreateMutationVariables = {
  data: TClassCreateData;
};

export type TClassUpdateMutationVariables = {
  [E_CLASS_ENTITY_KEYS.ID]: TClass[E_CLASS_ENTITY_KEYS.ID];
  data: TClassUpdateData;
};

export type TClassDeleteMutationVariables = {
  [E_CLASS_ENTITY_KEYS.ID]: TClass[E_CLASS_ENTITY_KEYS.ID];
};

export default class ClassService extends BaseService {
  protected static readonly endpoint = '/classes';

  public static async getClasses(): Promise<Array<TClass>> {
    return await Api.instance.get<Array<TClass>>(this.endpoint);
  }

  public static async getClass(
    id: TClass[E_CLASS_ENTITY_KEYS.ID],
  ): Promise<TClass> {
    return await Api.instance.get<TClass>(`${this.endpoint}/${id}`);
  }

  public static async createClass(data: TClassCreateData): Promise<TClass> {
    return await Api.instance.post<TClassCreateData, TClass>(
      this.endpoint,
      data,
    );
  }

  public static async updateClass(
    id: TClass[E_CLASS_ENTITY_KEYS.ID],
    data: TClassUpdateData,
  ): Promise<TClass> {
    return await Api.instance.put<TClassUpdateData, TClass>(
      `${this.endpoint}/${id}`,
      data,
    );
  }

  public static async deleteClass(
    id: TClass[E_CLASS_ENTITY_KEYS.ID],
  ): Promise<void> {
    await Api.instance.delete<void>(`${this.endpoint}/${id}`);
  }
}
