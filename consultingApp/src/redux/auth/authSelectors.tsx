import { RootState } from "../store";

export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;

export const selectUserRole = (state: RootState) => state.auth.role;