import { REACT_APP_API_URL, api, getCsrfHeader } from "./config";

const SIGNUP_API_URL = `${REACT_APP_API_URL}/signup`;

const signup = async (username, password) => {
  const res = await api.post(
    `${SIGNUP_API_URL}/signup`,
    { username, password },
    getCsrfHeader()
  );

  return res.data;
};

export { signup };
