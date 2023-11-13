import { TCourse } from '../course/types';

export enum E_COURSE_ACTIVITY_ENTITY_KEYS {
  ID = 'id',
  COURSE = 'course',
  FORM = 'form',
  REQUIREMENTS = 'requirements',
}

export enum E_COURSE_ACTIVITY_FORM {
  LECTURE = 'LECTURE',
  EXERCISE = 'EXERCISE',
  SEMINAR = 'SEMINAR',
}

export type TCourseActivity = {
  [E_COURSE_ACTIVITY_ENTITY_KEYS.ID]: string;
  [E_COURSE_ACTIVITY_ENTITY_KEYS.COURSE]: TCourse;
  [E_COURSE_ACTIVITY_ENTITY_KEYS.FORM]: E_COURSE_ACTIVITY_FORM;
  [E_COURSE_ACTIVITY_ENTITY_KEYS.REQUIREMENTS]: string;
};
