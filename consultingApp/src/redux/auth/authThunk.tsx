import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "/api";

export const login = createAsyncThunk(
  "auth/login",
  async ({ userLogin, password }: { userLogin: string; password: string }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        userLogin,
        password,
      });

      if (response.status === 200) {
        console.log('200')
        return { userLogin }; // Возвращаем данные о пользователе
      } else {
        console.log('error 500')
        throw new Error("Authentication failed");
      }
    } catch (error) {
        console.log('REER')
      throw error;
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async ({ userName,userLogin,email,phoneNumber, password }: {userName: string; userLogin: string;
    email: string; phoneNumber: string; password: string}) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/registration`, {
        userName,
        userLogin,
        phoneNumber,
        email,
        password,
      });

      if (response.status === 200) {
        return { userLogin };
      } else {
        throw new Error("Registration failed");
      }
    } catch (error) {
      throw error;
    }
  }
);