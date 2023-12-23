// reducers.ts

import { combineReducers, AnyAction } from 'redux';
import {
    SET_START_DATE_FILTER,
    SET_END_DATE_FILTER,
    SET_STATUS_FILTER,
    SET_USER_FILTER,
} from './actions';

const startDateReducer = (state: string | '' = '', action: AnyAction) => {
    switch (action.type) {
        case SET_START_DATE_FILTER:
            return action.payload;
        default:
            return state;
    }
};

const endDateReducer = (state: string | '' = '', action: AnyAction) => {
    switch (action.type) {
        case SET_END_DATE_FILTER:
            return action.payload;
        default:
            return state;
    }
};

const statusReducer = (state: string | '' = '', action: AnyAction) => {
    switch (action.type) {
        case SET_STATUS_FILTER:
            return action.payload;
        default:
            return state;
    }
};

const userReducer = (state: string | '' = '', action: AnyAction) => {
    switch (action.type) {
        case SET_USER_FILTER:
            return action.payload;
        default:
            return state;
    }
};

export const requestFilterReducer = combineReducers({
    startDate: startDateReducer,
    endDate: endDateReducer,
    status: statusReducer,
    user: userReducer,
});
