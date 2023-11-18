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

export type TCourse = {
  [E_COURSE_ENTITY_KEYS.ID]: string;
  [E_COURSE_ENTITY_KEYS.ABBR]: string;
  [E_COURSE_ENTITY_KEYS.NAME]: string;
  [E_COURSE_ENTITY_KEYS.CREDITS]: number;
  [E_COURSE_ENTITY_KEYS.ANNOTATION]: string;
  [E_COURSE_ENTITY_KEYS.GUARANTOR]: TApiUser;
  [E_COURSE_ENTITY_KEYS.TEACHERS]: Array<TApiUser>;
};

export type TCourseWithStudents = TCourse & {
  [E_COURSE_ENTITY_KEYS.STUDENTS]: Array<TApiUser>;
};

export enum E_COURSE_STUDENT_ENTITY_KEYS {
  COURSE_ID = 'course_id',
  STUDENT_ID = 'student_id',
  COURSE = 'course',
  STUDENT = 'student',
}

export type TCourseStudent = {
  [E_COURSE_STUDENT_ENTITY_KEYS.COURSE_ID]: string;
  [E_COURSE_STUDENT_ENTITY_KEYS.STUDENT_ID]: string;
  [E_COURSE_STUDENT_ENTITY_KEYS.COURSE]: TCourse;
  [E_COURSE_STUDENT_ENTITY_KEYS.STUDENT]: TApiUser;
};

export type TPublicCourse = Omit<
  TCourse,
  E_COURSE_ENTITY_KEYS.GUARANTOR | E_COURSE_ENTITY_KEYS.TEACHERS
>;
