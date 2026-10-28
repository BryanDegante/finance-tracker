import { createSlice } from "@reduxjs/toolkit";

type AuthState = {
  isAuthOpen: boolean;
}

const initialState: AuthState = {
  isAuthOpen :false,
}

export const AuthModalSlice = createSlice({
  name:'auth',
  initialState,
  reducers:{
    openAuthModal: (state) => {
      state.isAuthOpen = true;
    },
    closeAuthModal: (state) => {
      state.isAuthOpen = false;
    }

  }
})

export const {openAuthModal,closeAuthModal} = AuthModalSlice.actions;

export default AuthModalSlice.reducer;