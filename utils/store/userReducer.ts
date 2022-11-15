import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser } from '../models/interfaces/IUser';

type State = IUser | null;
const initialState: State = null;

export const userReducer = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state: State, action: PayloadAction<IUser | null>): any => {
      state = action.payload;
      return state;
    }
  }
});

export const { setUser } = userReducer.actions;
export default userReducer.reducer;
