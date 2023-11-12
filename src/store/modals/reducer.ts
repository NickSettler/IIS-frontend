import { createReducer } from '@reduxjs/toolkit';
import { closeModal, openModal } from './actions';
import { findLastIndex } from 'lodash';
import { TUserCreateData } from '../../api/user/user.service';
import { E_ROLE } from '../../api/user/types';
import { E_MODAL_MODE } from '../../utils/modal/base-modal';
import { E_COURSE_ENTITY_KEYS, TPureCourse } from '../../api/course/types';
import { TCourseCreateData } from '../../api/course/course.service';
import {
  TCourseActivityCreateData,
  TCourseActivityUpdateData,
} from '../../api/course-activities/course-activities.service';
import {
  TClassCreateData,
  TClassUpdateData,
} from '../../api/class/class.service';
import { E_CLASS_ENTITY_KEYS, TClass } from '../../api/class/types';
import {
  E_COURSE_ACTIVITY_ENTITY_KEYS,
  TApiCourseActivity,
} from '../../api/course-activities/types';
import {
  TTeacherRequirementCreateData,
  TTeacherRequirementUpdateData,
} from '../../api/teacher-requirements/teacher-requirements.service';
import {
  E_TEACHER_REQUIREMENT_ENTITY_KEYS,
  TTeacherRequirement,
} from '../../api/teacher-requirements/types';

export enum E_MODALS {
  MANAGE_ROLES = 'manage-roles.modal',
  ADD_NEW_USER = 'add-new-user.modal',
  COURSE_FORM = 'course-form.modal',
  CLASS_FORM = 'class-form.modal',
  ADD_NEW_ACTIVITY = 'add-new-activity.modal',
  TEACHER_REQUIREMENT_FORM = 'teacher-requirement-form.modal',
}

export type TModalMapItem = {
  id: E_MODALS;
  open: boolean;
  meta?: any;
};

export type TModalGenericMetaItems = {
  onSuccess(...args: Array<any>): void;
};

export type TModalMetaMap = {
  [E_MODALS.ADD_NEW_USER]: {
    onSuccess(data: TUserCreateData): void;
  };
  [E_MODALS.MANAGE_ROLES]: {
    userID: string;
    onSuccess(userID: string, roles: Array<E_ROLE>): void;
  };
  [E_MODALS.COURSE_FORM]:
    | {
        mode: E_MODAL_MODE.CREATE;
        initialData?: Partial<TPureCourse>;
        onSuccess(data: TCourseCreateData): void;
      }
    | {
        mode: E_MODAL_MODE.UPDATE;
        initialData: Partial<TPureCourse> & {
          [E_COURSE_ENTITY_KEYS.ID]: TPureCourse[E_COURSE_ENTITY_KEYS.ID];
        };
        onSuccess(id: string, data: TCourseCreateData): void;
      };
  [E_MODALS.CLASS_FORM]:
    | {
        mode: E_MODAL_MODE.CREATE;
        initialData?: Partial<TClass>;
        onSuccess(data: TClassCreateData): void;
      }
    | {
        mode: E_MODAL_MODE.UPDATE;
        initialData: Partial<TClass> & {
          [E_CLASS_ENTITY_KEYS.ID]: TClass[E_CLASS_ENTITY_KEYS.ID];
        };
        onSuccess(id: string, data: TClassUpdateData): void;
      };
  [E_MODALS.ADD_NEW_ACTIVITY]:
    | {
        mode: E_MODAL_MODE.CREATE;
        initialData: Partial<TApiCourseActivity> & {
          [E_COURSE_ACTIVITY_ENTITY_KEYS.COURSE]: TPureCourse[E_COURSE_ENTITY_KEYS.ID];
        };
        onSuccess(data: TCourseActivityCreateData): void;
      }
    | {
        mode: E_MODAL_MODE.UPDATE;
        initialData: Partial<TApiCourseActivity> & {
          [E_COURSE_ACTIVITY_ENTITY_KEYS.ID]: TApiCourseActivity[E_COURSE_ACTIVITY_ENTITY_KEYS.ID];
          [E_COURSE_ACTIVITY_ENTITY_KEYS.COURSE]: TPureCourse[E_COURSE_ENTITY_KEYS.ID];
        };
        onSuccess(
          id: TApiCourseActivity[E_COURSE_ACTIVITY_ENTITY_KEYS.ID],
          data: TCourseActivityUpdateData,
        ): void;
      };
  [E_MODALS.TEACHER_REQUIREMENT_FORM]:
    | {
        mode: E_MODAL_MODE.CREATE;
        initialData?: Partial<TTeacherRequirement>;
        onSuccess(data: TTeacherRequirementCreateData): void;
      }
    | {
        mode: E_MODAL_MODE.UPDATE;
        initialData: Partial<TTeacherRequirement> & {
          [E_TEACHER_REQUIREMENT_ENTITY_KEYS.ID]: TTeacherRequirement[E_TEACHER_REQUIREMENT_ENTITY_KEYS.ID];
        };
        onSuccess(
          id: TTeacherRequirement[E_TEACHER_REQUIREMENT_ENTITY_KEYS.ID],
          data: TTeacherRequirementUpdateData,
        ): void;
      };
};

export type TModalState = {
  modals: Array<TModalMapItem>;
};

export type TDynModalMeta<Modal extends E_MODALS> = TModalMetaMap[Modal];

const initialState: TModalState = {
  modals: [],
};

export const reducer = createReducer(initialState, (builder) =>
  builder
    .addCase(openModal, (state, { payload: { modal, meta } }) => {
      return {
        ...state,
        modals: [
          ...state.modals,
          {
            id: modal,
            open: true,
            meta,
          },
        ],
      };
    })
    .addCase(closeModal, (state, { payload: { modal } }) => {
      const lastModalIndex = findLastIndex(state.modals, { id: modal });

      return {
        ...state,
        modals: [
          ...state.modals.slice(0, lastModalIndex),
          ...state.modals.slice(lastModalIndex + 1),
        ],
      };
    }),
);
