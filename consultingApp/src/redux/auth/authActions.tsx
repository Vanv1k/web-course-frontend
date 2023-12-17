import { createAction } from "@reduxjs/toolkit";

export const login = createAction<{ userLogin: string; password: string }>(
  "auth/login"
);
export const logout = createAction("auth/logout");

export const register = createAction<{ userName: string; userLogin: string;
   email: string; phoneNumber: string; password: string }>(
  "auth/register"
);