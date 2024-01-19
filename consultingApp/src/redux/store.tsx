// store.ts
import { configureStore } from "@reduxjs/toolkit";
import authMiddleware from "./auth/authMiddleware";
import requestsMiddleware from "./request/requestMiddleware";
import authReducer from "./auth/authSlice";
import requestReducer from "./request/requestSlice";
import {filterAndActiveIdReducer} from "./filterAndActiveRequestID/reducers"
import { requestFilterReducer } from "./requestFilters/reducers";

const store = configureStore({
  reducer: {
    auth: authReducer,
    request: requestReducer,
    filterAndActiveId: filterAndActiveIdReducer,
    requestFilters: requestFilterReducer,
  },
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({
    serializableCheck: false,
  }).concat(authMiddleware, requestsMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;