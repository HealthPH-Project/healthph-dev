import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    initialLogin: null,
  },
  reducers: {
    authenticateUser: (state, { payload }) => {
      state.user = payload.user;
    },
    deauthenticateUser: (state) => {
      state.user = null;
    },
    updateUser: (state, { payload }) => {
      state.user = payload.user;
    },
    updateInitialLogin: (state, { payload }) => {
      state.initialLogin = payload.value;
    },
  },
});

export const {
  authenticateUser,
  deauthenticateUser,
  updateUser,
  updateInitialLogin,
} = authSlice.actions;

export default authSlice.reducer;
