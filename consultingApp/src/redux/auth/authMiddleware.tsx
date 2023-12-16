import { Middleware } from "redux";
import { login, logout } from "./authActions";
import { loginSuccess, loginFailure } from "./authSlice";
import axios from "axios";

const API_BASE_URL = "/api";

const authMiddleware: Middleware = (store) => (next) => async (action) => {
    if (login.match(action)) {
        try {
            const { userLogin, password } = action.payload;
            console.log(userLogin, password)
            const response = await axios.post(`${API_BASE_URL}/auth/login`, {
                "login": userLogin,
                "password": password,
            });

            console.log('Response:', response); // Добавлен вывод

            if (response.status === 200) {
                console.log('loginSuccess');
                store.dispatch(loginSuccess());
                const token = response.data.access_token;
                console.log('Token:', token); // Добавлен вывод
                localStorage.setItem("accessToken", token);
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
            } else {
                console.log('logoutFailure');
                // Может потребоваться диспатчить дополнительные действия в случае неудачного выхода
            }
        } catch (error) {
            console.log('Error during logout');
            console.error("Error during logout:", error);
            // Может потребоваться диспатчить дополнительные действия в случае ошибки
            throw error;
        }
    }

    return next(action);
};


export default authMiddleware;