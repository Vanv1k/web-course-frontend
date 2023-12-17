import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface RequestState {
  data: any[];
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: RequestState = {
  data: [],
  status: "idle",
};

const requestSlice = createSlice({
  name: "request",
  initialState,
  reducers: {
    getAllRequestsStart: (state) => {
      state.status = "loading";
    },
    getAllRequestsSuccess: (state, action: PayloadAction<any[]>) => {
      state.status = "succeeded";
      state.data = action.payload;
    },
    getAllRequestsFailure: (state) => {
      state.status = "failed";
    },
  },
});

export const { getAllRequestsStart, getAllRequestsSuccess, getAllRequestsFailure } = requestSlice.actions;
export default requestSlice.reducer;