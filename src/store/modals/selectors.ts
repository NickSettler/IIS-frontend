import { createSelector } from '@reduxjs/toolkit';
import { E_MODALS } from './reducer';
import { find } from 'lodash';
import { TRootState } from '../index';

export const modalsListSelector = createSelector(
  (state: TRootState) => state.modals,
  (modals) => modals.modals,
);

export const isModalOpenSelector = (id: E_MODALS) =>
  createSelector(
    (state: TRootState) => find(state.modals.modals, { id }),
    (modal) => modal?.open ?? false,
  );

export const modalMetaSelector = (id: E_MODALS) =>
  createSelector(
    (state: TRootState) => find(state.modals.modals, { id }),
    (modal) => modal?.meta ?? {},
  );
