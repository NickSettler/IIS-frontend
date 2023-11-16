import { TApiUser } from '../user/types';

export enum E_COURSE_ENTITY_KEYS {
  ID = 'id',
  ABBR = 'abbr',
  NAME = 'name',
  CREDITS = 'credits',
  ANNOTATION = 'annotation',
  GUARANTOR = 'guarantor',
  TEACHERS = 'teachers',
  STUDENTS = 'students',
}

export type TPureCourse = {
  [E_COURSE_ENTITY_KEYS.ID]: string;
  [E_COURSE_ENTITY_KEYS.ABBR]: string;
  [E_COURSE_ENTITY_KEYS.NAME]: string;
  [E_COURSE_ENTITY_KEYS.CREDITS]: number;
  [E_COURSE_ENTITY_KEYS.ANNOTATION]: string;
  [E_COURSE_ENTITY_KEYS.GUARANTOR]: TApiUser;
  [E_COURSE_ENTITY_KEYS.TEACHERS]: Array<TApiUser>;
};

export type TCourseWithStudents = TPureCourse & {
  [E_COURSE_ENTITY_KEYS.STUDENTS]: Array<TApiUser>;
};
