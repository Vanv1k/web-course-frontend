// store.ts
import { configureStore } from "@reduxjs/toolkit";
import authMiddleware from "./auth/authMiddleware";
import requestsMiddleware from "./request/requestMiddleware";
import authReducer from "./auth/authSlice";
import requestReducer from "./request/requestSlice"; // Добавили этот импорт
import {filterAndActiveIdReducer} from "./filterAndActiveRequestID/reducers"


const store = configureStore({
  reducer: {
    auth: authReducer,
    request: requestReducer,
    filterAndActiveId: filterAndActiveIdReducer,
    // Добавьте другие редюсеры, если необходимо
  },
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({
    serializableCheck: false,
  }).concat(authMiddleware, requestsMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;