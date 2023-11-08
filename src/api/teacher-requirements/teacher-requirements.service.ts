import { BaseService } from '../base/service';
import {
  E_TEACHER_REQUIREMENT_ENTITY_KEYS,
  TTeacherRequirement,
} from './types';
import Api from '../base/api';
import { E_USER_ENTITY_KEYS, TUser } from '../user/types';
import { E_COURSE_ENTITY_KEYS, TPureCourse } from '../course/types';
import { TCourseUpdateData } from '../course/course.service';

export type TTeacherRequirementCreateData = Omit<
  TTeacherRequirement,
  | E_TEACHER_REQUIREMENT_ENTITY_KEYS.ID
  | E_TEACHER_REQUIREMENT_ENTITY_KEYS.TEACHER
> & {
  [E_TEACHER_REQUIREMENT_ENTITY_KEYS.TEACHER]: TUser[E_USER_ENTITY_KEYS.ID];
};

export type TTeacherRequirementUpdateData =
  Partial<TTeacherRequirementCreateData>;

export type TTeacherRequirementCreateMutationVariables = {
  data: TTeacherRequirementCreateData;
};

export type TTeacherRequirementUpdateMutationVariables = {
  [E_TEACHER_REQUIREMENT_ENTITY_KEYS.ID]: TTeacherRequirement[E_TEACHER_REQUIREMENT_ENTITY_KEYS.ID];
  data: TTeacherRequirementUpdateData;
};

export type TTeacherRequirementDeleteMutationVariables = {
  [E_TEACHER_REQUIREMENT_ENTITY_KEYS.ID]: TTeacherRequirement[E_TEACHER_REQUIREMENT_ENTITY_KEYS.ID];
};

export default class TeacherRequirementsService extends BaseService {
  protected static readonly endpoint = '/teacher/requirements';

  public static async getAll(): Promise<Array<TTeacherRequirement>> {
    return await Api.instance.get<Array<TTeacherRequirement>>(this.endpoint);
  }

  public static async getOne(
    id: TTeacherRequirement[E_TEACHER_REQUIREMENT_ENTITY_KEYS.ID],
  ): Promise<TTeacherRequirement> {
    return await Api.instance.get<TTeacherRequirement>(
      `${this.endpoint}/${id}`,
    );
  }

  public static async create(
    data: TTeacherRequirementCreateData,
  ): Promise<TTeacherRequirement> {
    return await Api.instance.post<
      TTeacherRequirementCreateData,
      TTeacherRequirement
    >(this.endpoint, data);
  }

  public static async update(
    id: TTeacherRequirement[E_TEACHER_REQUIREMENT_ENTITY_KEYS.ID],
    data: TTeacherRequirementUpdateData,
  ): Promise<TTeacherRequirement> {
    return await Api.instance.put<
      TTeacherRequirementUpdateData,
      TTeacherRequirement
    >(`${this.endpoint}/${id}`, data);
  }

  public static async delete(
    id: TTeacherRequirement[E_TEACHER_REQUIREMENT_ENTITY_KEYS.ID],
  ): Promise<void> {
    await Api.instance.delete<void>(`${this.endpoint}/${id}`);
  }
}
