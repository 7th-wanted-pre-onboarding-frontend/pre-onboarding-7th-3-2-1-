import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import userReducer from './userReducer';

export const store = configureStore({
  reducer: {
    user: userReducer
  }
});

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector = useSelector<RootState>;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
