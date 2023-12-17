import { Middleware } from "redux";
import { getAllRequestsStart, getAllRequestsSuccess, getAllRequestsFailure } from "./requestSlice";
import { getAllRequests } from "./requestActions";
import axios from "axios";

const API_BASE_URL = "/api";

const requestsMiddleware: Middleware = (store) => (next) => async (action) => {
  if (getAllRequests.match(action)) {
    try {
      store.dispatch(getAllRequestsStart());

      const response = await axios.get(`${API_BASE_URL}/requests/`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
    });

      if (response.status === 200) {
        store.dispatch(getAllRequestsSuccess(response.data));
      } else {
        store.dispatch(getAllRequestsFailure());
      }
    } catch (error) {
      console.log('Error during getAllRequests');
      console.error("Error during getAllRequests:", error);
      store.dispatch(getAllRequestsFailure());
      throw error;
    }
  }

  return next(action);
};

export default requestsMiddleware;