import { REACT_APP_API_URL, api, getCsrfHeader, setCsrfHeader } from "./config";

const LOGIN_API_URL = `${REACT_APP_API_URL}/login`;

const login = async (username, password) => {
  const res = await api.post(
    `${LOGIN_API_URL}/login`,
    { username, password },
    getCsrfHeader()
  );

  return res;
};

const logout = async () => {
  const res = await api.post(`${LOGIN_API_URL}/logout`, getCsrfHeader());

  return res;
};

const checkLogin = async () => {
  const res = await api.get(`${LOGIN_API_URL}/check-login`, getCsrfHeader());

  return res;
};

const getCSRFToken = async () => {
  const res = await api.get(`${LOGIN_API_URL}/csrf-token`, {
    withCredentials: true,
  });

  setCsrfHeader({
    headers: {
      "X-CSRF-Token": res.data.csrfToken,
    },
    withCredentials: true,
  });

  return res;
};

export { login, logout, checkLogin, getCSRFToken };
