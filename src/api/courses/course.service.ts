import { BaseService } from '../base/service';
import Api from '../base/api';
import { E_COURSE_ENTITY_KEYS, TPureCourse } from './types';

export type TCreateCourseData = Omit<
  TPureCourse,
  | E_COURSE_ENTITY_KEYS.ANNOTATION
  | E_COURSE_ENTITY_KEYS.CREDITS
  | E_COURSE_ENTITY_KEYS.GUARANTOR
  | E_COURSE_ENTITY_KEYS.TEACHERS
> & {
  [E_COURSE_ENTITY_KEYS.CREDITS]: number;
  [E_COURSE_ENTITY_KEYS.ANNOTATION]?: string;
  [E_COURSE_ENTITY_KEYS.GUARANTOR]: string;
  [E_COURSE_ENTITY_KEYS.TEACHERS]?: Array<string>;
};

export type TUpdateCourseData = Partial<TCreateCourseData>;

export type TCourseCreateMutationVariables = {
  data: TCreateCourseData;
};

export type TCourseUpdateMutationVariables = {
  [E_COURSE_ENTITY_KEYS.ABBR]: TPureCourse[E_COURSE_ENTITY_KEYS.ABBR];
  data: TUpdateCourseData;
};

export type TCourseDeleteMutationVariables = {
  [E_COURSE_ENTITY_KEYS.ABBR]: TPureCourse[E_COURSE_ENTITY_KEYS.ABBR];
};

export default class CourseService extends BaseService {
  protected static readonly endpoint = '/courses';

  public static async getCourses(): Promise<Array<TPureCourse>> {
    return await Api.instance.get<Array<TPureCourse>>(this.endpoint);
  }

  public static async getCourse(
    abbr: TPureCourse[E_COURSE_ENTITY_KEYS.ABBR],
  ): Promise<TPureCourse> {
    return await Api.instance.get<TPureCourse>(`${this.endpoint}/${abbr}`);
  }

  public static async createCourse(
    data: TCreateCourseData,
  ): Promise<TPureCourse> {
    return await Api.instance.post<TCreateCourseData, TPureCourse>(
      this.endpoint,
      data,
    );
  }

  public static async updateCourse(
    abbr: TPureCourse[E_COURSE_ENTITY_KEYS.ABBR],
    data: TUpdateCourseData,
  ): Promise<TPureCourse> {
    return await Api.instance.put<TUpdateCourseData, TPureCourse>(
      `${this.endpoint}/${abbr}`,
      data,
    );
  }

  public static async deleteCourse(
    abbr: TPureCourse[E_COURSE_ENTITY_KEYS.ABBR],
  ): Promise<void> {
    await Api.instance.delete<void>(`${this.endpoint}/${abbr}`);
  }
}
