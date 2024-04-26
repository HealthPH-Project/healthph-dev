import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import { baseAPI } from "./api/_baseAPI";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [baseAPI.reducerPath]: baseAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseAPI.middleware),
});
