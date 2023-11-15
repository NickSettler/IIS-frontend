import { TApiUser } from '../user/types';

export enum E_TEACHER_REQUIREMENT_ENTITY_KEYS {
  ID = 'id',
  MODE = 'mode',
  TEACHER = 'teacher',
  START_TIME = 'start_time',
  END_TIME = 'end_time',
}

export enum E_TEACHER_REQUIREMENT_MODE {
  EXCLUDE = 'EXCLUDE',
  INCLUDE = 'INCLUDE',
}

export type TApiTeacherRequirement = {
  [E_TEACHER_REQUIREMENT_ENTITY_KEYS.ID]: string;
  [E_TEACHER_REQUIREMENT_ENTITY_KEYS.MODE]: E_TEACHER_REQUIREMENT_MODE;
  [E_TEACHER_REQUIREMENT_ENTITY_KEYS.TEACHER]: string;
  [E_TEACHER_REQUIREMENT_ENTITY_KEYS.START_TIME]: Date;
  [E_TEACHER_REQUIREMENT_ENTITY_KEYS.END_TIME]: Date;
};

export type TTeacherRequirement = Omit<
  TApiTeacherRequirement,
  E_TEACHER_REQUIREMENT_ENTITY_KEYS.TEACHER
> & {
  [E_TEACHER_REQUIREMENT_ENTITY_KEYS.TEACHER]: TApiUser;
};
