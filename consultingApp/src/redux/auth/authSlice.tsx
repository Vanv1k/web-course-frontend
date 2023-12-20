import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  role: number | -1;
}

const initialState: AuthState = {
  isAuthenticated: false,
  role: -1
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state) => {
      state.isAuthenticated = true;
    },
    loginFailure: (state) => {
      state.isAuthenticated = false;
      state.role = -1;
    },
    setRole: (state, action: PayloadAction<number | -1>) => {
      state.role = action.payload;
    },
  },
});

export const { loginSuccess, loginFailure, setRole  } = authSlice.actions;
export default authSlice.reducer;