import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  auth: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.auth = action.payload;
    },

    logout: (state) => {
      state.auth = null;
    },
  },
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;