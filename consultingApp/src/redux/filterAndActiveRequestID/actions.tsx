export const SET_ACTIVE_REQUEST_ID = 'SET_ACTIVE_REQUEST_ID';
export const SET_MAX_PRICE_FILTER = 'SET_MAX_PRICE_FILTER';

export const setActiveRequestID = (activeRequestID: number) => ({
  type: SET_ACTIVE_REQUEST_ID,
  payload: activeRequestID,
});

export const setMaxPriceFilter = (maxPrice: string | '') => ({
  type: SET_MAX_PRICE_FILTER,
  payload: maxPrice,
});