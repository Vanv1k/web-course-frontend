import { RootState } from "../store";

export const selectRequests = (state: RootState) => state.request.data;
export const selectRequestsStatus = (state: RootState) => state.request.status;