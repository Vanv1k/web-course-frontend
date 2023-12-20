// reducers.ts

import { combineReducers, AnyAction } from 'redux';
import {
  SET_ACTIVE_REQUEST_ID,
  SET_MAX_PRICE_FILTER,
} from './actions';

const activeRequestIDReducer = (state: number | null = null, action: AnyAction) => {
  switch (action.type) {
    case SET_ACTIVE_REQUEST_ID:
      return action.payload;
    default:
      return state;
  }
};

const maxPriceFilterReducer = (state: string | '' = '', action: AnyAction) => {
  switch (action.type) {
    case SET_MAX_PRICE_FILTER:
      return action.payload;
    default:
      return state;
  }
};

export const filterAndActiveIdReducer = combineReducers({
  activeRequestID: activeRequestIDReducer,
  maxPriceFilter: maxPriceFilterReducer,
});
