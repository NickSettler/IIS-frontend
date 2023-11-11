export enum E_CLASS_ENTITY_KEYS {
  ID = 'id',
  ABBR = 'abbr',
  CAPACITY = 'capacity',
}

export type TClass = {
  [E_CLASS_ENTITY_KEYS.ID]: string;
  [E_CLASS_ENTITY_KEYS.ABBR]: string;
  [E_CLASS_ENTITY_KEYS.CAPACITY]: number;
};
