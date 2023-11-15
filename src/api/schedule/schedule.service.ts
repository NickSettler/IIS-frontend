import { E_SCHEDULE_ITEM_ENTITY_KEYS, TScheduleItem } from './types';

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
