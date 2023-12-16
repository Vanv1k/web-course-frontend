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