import { E_SCHEDULE_ITEM_ENTITY_KEYS, TScheduleItem } from './types';
import { BaseService } from '../base/service';
import Api from '../base/api';

export type TScheduleItemCreateData = {
  [Key in keyof Omit<TScheduleItem, E_SCHEDULE_ITEM_ENTITY_KEYS.ID>]: string;
};

export type TScheduleItemUpdateData = Partial<TScheduleItemCreateData>;

export type TScheduleItemCreateMutationVariables = {
  data: TScheduleItemCreateData;
};

export type TScheduleItemUpdateMutationVariables = {
  [E_SCHEDULE_ITEM_ENTITY_KEYS.ID]: TScheduleItem[E_SCHEDULE_ITEM_ENTITY_KEYS.ID];
  data: TScheduleItemUpdateData;
};

export type TScheduleItemDeleteMutationVariables = {
  [E_SCHEDULE_ITEM_ENTITY_KEYS.ID]: TScheduleItem[E_SCHEDULE_ITEM_ENTITY_KEYS.ID];
};

export default class ScheduleService extends BaseService {
  protected static readonly endpoint = '/schedule';

  public static async getAll(): Promise<Array<TScheduleItem>> {
    return await Api.instance.get<Array<TScheduleItem>>(this.endpoint);
  }

  public static async create(
    data: TScheduleItemCreateData,
  ): Promise<TScheduleItem> {
    return await Api.instance.post<TScheduleItemCreateData, TScheduleItem>(
      this.endpoint,
      data,
    );
  }

  public static async update(
    id: TScheduleItem[E_SCHEDULE_ITEM_ENTITY_KEYS.ID],
    data: TScheduleItemUpdateData,
  ): Promise<TScheduleItem> {
    return await Api.instance.put<TScheduleItemUpdateData, TScheduleItem>(
      `${this.endpoint}/${id}`,
      data,
    );
  }

  public static async delete(
    id: TScheduleItem[E_SCHEDULE_ITEM_ENTITY_KEYS.ID],
  ): Promise<void> {
    await Api.instance.delete<void>(`${this.endpoint}/${id}`);
  }
}
