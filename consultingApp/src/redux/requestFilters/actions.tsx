export const SET_START_DATE_FILTER = 'SET_START_DATE_FILTER';
export const SET_END_DATE_FILTER = 'SET_END_DATE_FILTER';
export const SET_STATUS_FILTER = 'SET_STATUS_FILTER';
export const SET_USER_FILTER = 'SET_USER_FILTER';

export const setStartDateFilter = (startDate: string | '') => ({
    type: SET_START_DATE_FILTER,
    payload: startDate,
});

export const setEndDateFilter = (endDate: string | '') => ({
    type: SET_END_DATE_FILTER,
    payload: endDate,
});

export const setStatusFilter = (status: string | '') => ({
    type: SET_STATUS_FILTER,
    payload: status,
});

export const setUserFilter = (user: string | '') => ({
    type: SET_USER_FILTER,
    payload: user,
});