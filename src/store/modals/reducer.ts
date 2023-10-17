import { createReducer } from '@reduxjs/toolkit';
import { closeModal, openModal } from './actions';
import { findLastIndex } from 'lodash';
import { TUserCreateData } from '../../api/user/user.service';
import { E_ROLE } from '../../api/user/types';

export enum E_MODALS {
  ASSIGN_ROLE = 'assign-role.modal',
  ADD_NEW_USER = 'add-new-user.modal',
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
  [E_MODALS.ASSIGN_ROLE]: {
    userID: string;
    onSuccess(userID: string, role: E_ROLE): void;
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
