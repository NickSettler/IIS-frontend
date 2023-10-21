import { createReducer } from '@reduxjs/toolkit';
import { closeModal, openModal } from './actions';
import { findLastIndex } from 'lodash';
import { TUserCreateData } from '../../api/user/user.service';
import { E_ROLE } from '../../api/user/types';
import { E_MODAL_MODE } from '../../utils/modal/base-modal';
import { TPureCourse } from '../../api/course/types';
import { TCourseCreateData } from '../../api/course/course.service';

export enum E_MODALS {
  MANAGE_ROLES = 'manage-roles.modal',
  ADD_NEW_USER = 'add-new-user.modal',
  COURSE_FORM = 'course-form.modal',
}

export type TModalMapItem = {
  id: E_MODALS;
  open: boolean;
  meta?: any;
};

export type TModalMetaMap = {
  [E_MODALS.ADD_NEW_USER]: {
    onSuccess(data: TUserCreateData): void;
  };
  [E_MODALS.MANAGE_ROLES]: {
    userID: string;
    onSuccess(userID: string, roles: Array<E_ROLE>): void;
  };
  [E_MODALS.COURSE_FORM]: { initialData?: Partial<TPureCourse> } & (
    | {
        mode: E_MODAL_MODE.CREATE;
        onSuccess(data: TCourseCreateData): void;
      }
    | {
        mode: E_MODAL_MODE.UPDATE;
        abbr: string;
        onSuccess(abbr: string, data: TCourseCreateData): void;
      }
  );
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
