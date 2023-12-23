import { Middleware } from "redux";
import { login, logout, register } from "./authActions";
import { loginSuccess, loginFailure, setRole } from "./authSlice";
import axios from "axios";

const API_BASE_URL = "/api";

const authMiddleware: Middleware = (store) => (next) => async (action) => {
    if (login.match(action)) {
        try {
            const { userLogin, password } = action.payload;
            const response = await axios.post(`${API_BASE_URL}/auth/login`, {
                "login": userLogin,
                "password": password,
            });
            if (response.status === 200) {
                console.log('loginSuccess');
                store.dispatch(loginSuccess());
                const token = response.data.access_token;
                localStorage.setItem("accessToken", token);
                store.dispatch(setRole(response.data.role))
                localStorage.setItem('role', response.data.role);
                const updatedNumOfCons = 0;
                localStorage.setItem('numOfCons', updatedNumOfCons.toString());
            } else {
                console.log('loginFailure');
                store.dispatch(loginFailure());
            }
        } catch (error) {
            console.log('Error during login');
            console.error("Error during login:", error);
            store.dispatch(loginFailure());
            throw error;
        }
    } else if (logout.match(action)) {
        try {
            // Отправить запрос на сервер для выполнения выхода
            const response = await axios.get(`${API_BASE_URL}/auth/logout`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });

            if (response.status === 200) {
                console.log('logoutSuccess');
                store.dispatch(loginFailure());
                localStorage.removeItem("accessToken"); // Удаляем токен из локального хранилища
                localStorage.removeItem("numOfCons");
                localStorage.removeItem("role");
            } else {
                console.log('logoutFailure');
            }
        } catch (error) {
            console.log('Error during logout');
            console.error("Error during logout:", error);
            throw error;
        }
    } else if (register.match(action)) {
        try {
            const { userName,
                userLogin,
                phoneNumber,
                email,
                password, } = action.payload;
            const response = await axios.post(`${API_BASE_URL}/auth/registration`, {
                "name": userName,
                "login": userLogin,
                "phoneNumber": phoneNumber,
                "email": email,
                "pass": password,
            });

            if (response.status === 200) {
                store.dispatch(loginSuccess()); // Dispatch your success action
                const token = response.data.access_token;
                localStorage.setItem("accessToken", token);
                store.dispatch(setRole(response.data.role))
                localStorage.setItem('role', response.data.role);
                const updatedNumOfCons = 0;
                localStorage.setItem('numOfCons', updatedNumOfCons.toString());
            } else {
                store.dispatch(loginFailure()); // Dispatch your failure action
            }
        } catch (error) {
            console.error("Error during registration:", error);
            store.dispatch(loginFailure());
            throw error;
        }
    }


    return next(action);
};


export default authMiddleware;