import { BaseService } from '../base/service';
import Api from '../base/api';
import {
  E_COURSE_ACTIVITY_ENTITY_KEYS,
  E_COURSE_ACTIVITY_FORM,
  TCourseActivity,
} from './types';
import { E_COURSE_ENTITY_KEYS, TCourse } from '../course/types';

export type TCourseActivityCreateData = Omit<
  TCourseActivity,
  E_COURSE_ACTIVITY_ENTITY_KEYS.COURSE | E_COURSE_ACTIVITY_ENTITY_KEYS.ID
> & {
  [E_COURSE_ACTIVITY_ENTITY_KEYS.COURSE]: string;
  [E_COURSE_ACTIVITY_ENTITY_KEYS.FORM]: E_COURSE_ACTIVITY_FORM;
  [E_COURSE_ACTIVITY_ENTITY_KEYS.REQUIREMENTS]: string;
};

export type TCourseActivityUpdateData = Partial<TCourseActivityCreateData>;

export type TCourseActivityCreateMutationVariables = {
  data: TCourseActivityCreateData;
};

export type TCourseActivityUpdateMutationVariables = {
  [E_COURSE_ACTIVITY_ENTITY_KEYS.ID]: TCourseActivity[E_COURSE_ACTIVITY_ENTITY_KEYS.ID];
  data: TCourseActivityUpdateData;
};

export type TCourseActivityDeleteMutationVariables = {
  [E_COURSE_ACTIVITY_ENTITY_KEYS.ID]: TCourseActivity[E_COURSE_ACTIVITY_ENTITY_KEYS.ID];
};

export default class CourseActivityService extends BaseService {
  protected static readonly endpoint = '/courses';

  public static async getCourseActivities(
    id: TCourse[E_COURSE_ENTITY_KEYS.ID],
  ): Promise<Array<TCourseActivity>> {
    return await Api.instance.get<Array<TCourseActivity>>(
      `${this.endpoint}/${id}/activities`,
    );
  }

  public static async createCourseActivity(
    data: TCourseActivityCreateData,
  ): Promise<TCourseActivity> {
    return await Api.instance.post<TCourseActivityCreateData, TCourseActivity>(
      `${this.endpoint}/activity`,
      data,
    );
  }

  public static async updateCourseActivity(
    id: TCourseActivity[E_COURSE_ACTIVITY_ENTITY_KEYS.ID],
    data: TCourseActivityUpdateData,
  ): Promise<TCourseActivity> {
    return await Api.instance.put<TCourseActivityUpdateData, TCourseActivity>(
      `${this.endpoint}/activity/${id}`,
      data,
    );
  }

  public static async deleteCourseActivity(
    id: TCourseActivity[E_COURSE_ACTIVITY_ENTITY_KEYS.ID],
  ): Promise<void> {
    await Api.instance.delete<void>(`${this.endpoint}/activity/${id}`);
  }
}
