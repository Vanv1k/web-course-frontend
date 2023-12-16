import { createAction } from "@reduxjs/toolkit";

export const login = createAction<{ userLogin: string; password: string }>(
  "auth/login"
);
export const logout = createAction("auth/logout");