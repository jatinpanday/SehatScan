import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/types/auth";

export interface UserState {
  profile: User | null;
}

const initialState: UserState = {
  profile: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | null>) {
      state.profile = action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;
export const userReducer = userSlice.reducer;
