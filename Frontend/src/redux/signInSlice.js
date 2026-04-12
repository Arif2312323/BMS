import { createSlice } from "@reduxjs/toolkit";

const signInSlice = createSlice({
  name: "isSignInModalOpen",
  initialState: false,
  reducers: {
    toggleSignIn: (state) => {
      return !state;
    },
    openSignIn: () => {
      return true;
    },
    closeSignIn: () => {
      return false;
    },
  },
});

export const { toggleSignIn, openSignIn, closeSignIn } = signInSlice.actions;
export default signInSlice.reducer;