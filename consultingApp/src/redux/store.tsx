// store.ts
import { configureStore } from "@reduxjs/toolkit";
import authMiddleware from "./auth/authMiddleware";
import authReducer from "./auth/authSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    // Добавьте другие редюсеры, если необходимо
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(authMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;