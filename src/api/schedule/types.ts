import { TApiUser } from '../user/types';
import { TCourseActivity } from '../course-activities/types';
import { TClass } from '../class/types';

export enum E_SCHEDULE_ITEM_ENTITY_KEYS {
  ID = 'id',
  COURSE_ACTIVITY = 'course_activity',
  TEACHER = 'teacher',
  CLASS = 'class',
  START_TIME = 'start_time',
  END_TIME = 'end_time',
  RECURRENCE_RULE = 'recurrence_rule',
  EXCLUSION_DATES = 'exclusion_dates',
  NOTES = 'notes',
}

export type TScheduleItem = {
  [E_SCHEDULE_ITEM_ENTITY_KEYS.ID]: string;
  [E_SCHEDULE_ITEM_ENTITY_KEYS.COURSE_ACTIVITY]: TCourseActivity;
  [E_SCHEDULE_ITEM_ENTITY_KEYS.TEACHER]: TApiUser;
  [E_SCHEDULE_ITEM_ENTITY_KEYS.CLASS]: TClass;
  [E_SCHEDULE_ITEM_ENTITY_KEYS.START_TIME]: Date;
  [E_SCHEDULE_ITEM_ENTITY_KEYS.END_TIME]: Date;
  [E_SCHEDULE_ITEM_ENTITY_KEYS.RECURRENCE_RULE]: string | null;
  [E_SCHEDULE_ITEM_ENTITY_KEYS.EXCLUSION_DATES]: string | null;
  [E_SCHEDULE_ITEM_ENTITY_KEYS.NOTES]: string | null;
};
