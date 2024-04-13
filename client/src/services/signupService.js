import { REACT_APP_API_URL, api } from "./config";

const SIGNUP_API_URL = `${REACT_APP_API_URL}/signup`;

const signup = async (username, password) => {
    const res = await api.post(`${SIGNUP_API_URL}/signup`, {username, password})

    return res.data
}

export { signup }