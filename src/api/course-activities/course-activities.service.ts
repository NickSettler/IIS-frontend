import { BaseService } from '../base/service';
import Api from '../base/api';
import {
  E_COURSE_ACTIVITY_ENTITY_KEYS,
  TApiCourseActivity,
  TCourseActivity,
} from './types';
import { E_COURSE_ENTITY_KEYS, TApiCourse } from '../course/types';

export type TCourseActivityCreateData = Omit<
  TCourseActivity,
  E_COURSE_ACTIVITY_ENTITY_KEYS.ID
> & {
  [E_COURSE_ACTIVITY_ENTITY_KEYS.COURSE]: string;
  [E_COURSE_ACTIVITY_ENTITY_KEYS.FORM]: string;
};

export type TCourseActivityUpdateData = Partial<TCourseActivityCreateData>;

export type TCourseActivityCreateMutationVariables = {
  data: TCourseActivityCreateData;
};

export type TCourseActivityUpdateMutationVariables = {
  [E_COURSE_ACTIVITY_ENTITY_KEYS.ID]: TApiCourseActivity[E_COURSE_ACTIVITY_ENTITY_KEYS.ID];
  data: TCourseActivityUpdateData;
};

export type TCourseActivityDeleteMutationVariables = {
  [E_COURSE_ACTIVITY_ENTITY_KEYS.ID]: TApiCourseActivity[E_COURSE_ACTIVITY_ENTITY_KEYS.ID];
};

export default class CourseActivityService extends BaseService {
  protected static readonly endpoint = '/courses';

  public static async getCourseActivities(
    abbr: TApiCourse[E_COURSE_ENTITY_KEYS.ABBR],
  ): Promise<Array<TApiCourseActivity>> {
    return await Api.instance.get<Array<TApiCourseActivity>>(
      `${this.endpoint}/${abbr}/activities`,
    );
  }

  public static async getCourseActivity(
    abbr: TApiCourseActivity[E_COURSE_ACTIVITY_ENTITY_KEYS.COURSE],
  ): Promise<TApiCourseActivity> {
    return await Api.instance.get<TApiCourseActivity>(
      `${this.endpoint}/${abbr}`,
    );
  }

  public static async createCourseActivity(
    data: TCourseActivityCreateData,
  ): Promise<TApiCourseActivity> {
    return await Api.instance.post<
      TCourseActivityCreateData,
      TApiCourseActivity
    >(`${this.endpoint}/activity`, data);
  }

  public static async updateCourseActivity(
    id: TApiCourseActivity[E_COURSE_ACTIVITY_ENTITY_KEYS.ID],
    data: TCourseActivityUpdateData,
  ): Promise<TApiCourseActivity> {
    return await Api.instance.put<
      TCourseActivityUpdateData,
      TApiCourseActivity
    >(`${this.endpoint}/activity/${id}`, data);
  }

  public static async deleteCourseActivity(
    id: TApiCourseActivity[E_COURSE_ACTIVITY_ENTITY_KEYS.ID],
  ): Promise<void> {
    await Api.instance.delete<void>(`${this.endpoint}/activity/${id}`);
  }
}
