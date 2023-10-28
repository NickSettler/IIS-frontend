import { TApiCourse } from '../course/types';
import { E_USER_ENTITY_KEYS } from '../user/types';

export enum E_COURSE_ACTIVITY_ENTITY_KEYS {
  ID = 'id',
  COURSE = 'course',
  FORM = 'form',
}

export type TPureCourseActivity = {
  [E_COURSE_ACTIVITY_ENTITY_KEYS.ID]: string;
  [E_COURSE_ACTIVITY_ENTITY_KEYS.COURSE]: TApiCourse;
  [E_COURSE_ACTIVITY_ENTITY_KEYS.FORM]: string;
};

export type TApiCourseActivity = {
  [E_COURSE_ACTIVITY_ENTITY_KEYS.ID]: string;
  [E_COURSE_ACTIVITY_ENTITY_KEYS.COURSE]: TApiCourse;
  [E_COURSE_ACTIVITY_ENTITY_KEYS.FORM]: string;
};

export type TCourseActivity = {
  [E_COURSE_ACTIVITY_ENTITY_KEYS.FORM]: string;
  [E_COURSE_ACTIVITY_ENTITY_KEYS.COURSE]: string;
};
