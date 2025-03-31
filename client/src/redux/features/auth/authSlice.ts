import { createSlice } from "@reduxjs/toolkit";

export interface userState {
  username: string;
  email: string;
  profilePic: string;
  isAdmin: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const initialState: { userInfo: userState | null } = {
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo")!)
    : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
      const expirationTime = new Date().getTime() + 24 * 60 * 60 * 1000;
      localStorage.setItem("expirationTime", JSON.stringify(expirationTime));
    },

    logout: (state) => {
      state.userInfo = null;
      localStorage.clear();
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
