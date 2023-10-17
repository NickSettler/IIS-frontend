import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  moduleName as modalsModuleName,
  reducer as modalsReducer,
} from './modals';
import { useDispatch } from 'react-redux';

const reducers = combineReducers({
  [modalsModuleName]: modalsReducer,
});

const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type TRootState = ReturnType<typeof store.getState>;

export type TAppDispatch = typeof store.dispatch;
export const useAppDispatch: () => TAppDispatch = useDispatch;

export default store;
