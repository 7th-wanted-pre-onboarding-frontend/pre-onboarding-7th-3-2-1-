import {
  createSlice,
  PayloadAction,
  SliceCaseReducers
} from '@reduxjs/toolkit';
import { IUser } from '../models/interfaces/IUser';

export type UserState = IUser | null;
const initialState: UserState = null;

export const userReducer = createSlice<UserState, SliceCaseReducers<UserState>>(
  {
    name: 'user',
    initialState,
    reducers: {
      setUser: (state: UserState, action: PayloadAction<IUser | null>): any => {
        state = action.payload;
        return state;
      }
    }
  }
);

export const { setUser } = userReducer.actions;
export default userReducer.reducer;
