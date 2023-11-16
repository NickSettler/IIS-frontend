import { BaseService } from '../base/service';
import Api from '../base/api';
import { E_COURSE_ENTITY_KEYS, TCourseWithStudents, TCourse } from './types';

export type TCourseCreateData = Omit<
  TCourse,
  | E_COURSE_ENTITY_KEYS.ABBR
  | E_COURSE_ENTITY_KEYS.ANNOTATION
  | E_COURSE_ENTITY_KEYS.CREDITS
  | E_COURSE_ENTITY_KEYS.GUARANTOR
  | E_COURSE_ENTITY_KEYS.ID
  | E_COURSE_ENTITY_KEYS.TEACHERS
> & {
  [E_COURSE_ENTITY_KEYS.CREDITS]: number;
  [E_COURSE_ENTITY_KEYS.ABBR]: string;
  [E_COURSE_ENTITY_KEYS.ANNOTATION]?: string;
  [E_COURSE_ENTITY_KEYS.GUARANTOR]: string;
  [E_COURSE_ENTITY_KEYS.TEACHERS]?: Array<string>;
};

export type TCourseUpdateData = Partial<TCourseCreateData>;

export type TCourseCreateMutationVariables = {
  data: TCourseCreateData;
};

export type TCourseUpdateMutationVariables = {
  [E_COURSE_ENTITY_KEYS.ID]: TCourse[E_COURSE_ENTITY_KEYS.ID];
  data: TCourseUpdateData;
};

export type TCourseDeleteMutationVariables = {
  [E_COURSE_ENTITY_KEYS.ID]: TCourse[E_COURSE_ENTITY_KEYS.ID];
};

export default class CourseService extends BaseService {
  protected static readonly endpoint = '/courses';

  public static async getCourses(): Promise<Array<TCourse>> {
    return await Api.instance.get<Array<TCourse>>(this.endpoint);
  }

  public static async getCourse(
    id: TCourse[E_COURSE_ENTITY_KEYS.ID],
  ): Promise<TCourseWithStudents> {
    return await Api.instance.get<TCourseWithStudents>(
      `${this.endpoint}/${id}`,
    );
  }

  public static async createCourse(data: TCourseCreateData): Promise<TCourse> {
    return await Api.instance.post<TCourseCreateData, TCourse>(
      this.endpoint,
      data,
    );
  }

  public static async updateCourse(
    id: TCourse[E_COURSE_ENTITY_KEYS.ID],
    data: TCourseUpdateData,
  ): Promise<TCourse> {
    return await Api.instance.put<TCourseUpdateData, TCourse>(
      `${this.endpoint}/${id}`,
      data,
    );
  }

  public static async deleteCourse(
    id: TCourse[E_COURSE_ENTITY_KEYS.ID],
  ): Promise<void> {
    await Api.instance.delete<void>(`${this.endpoint}/${id}`);
  }
}
