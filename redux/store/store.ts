import { configureStore } from "@reduxjs/toolkit";
import  AuthModalSlice  from "../slices/AuthModalSlice";

export const store = configureStore({
  reducer: {
    auth: AuthModalSlice,
  }
})


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;