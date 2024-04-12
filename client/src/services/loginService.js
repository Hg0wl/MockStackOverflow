import { REACT_APP_API_URL, api } from "./config";

const LOGIN_API_URL = `${REACT_APP_API_URL}/login`;

const login = async (username, password, csrfToken) => {
  console.log(csrfToken);
  const res = await api.post(
    `${LOGIN_API_URL}/login`,
    { username, password },
    {
      headers: {
        "X-CSRF-Token": csrfToken,
      },
      withCredentials: true,
    }
  );

  return res;
};

const logout = async () => {
  const res = await api.post(`${LOGIN_API_URL}/logout`);

  return res;
};

const checkLogin = async (csrfToken) => {
  const res = await api.get(`${LOGIN_API_URL}/check-login`, {
    headers: {
      "X-CSRF-Token": csrfToken,
    },
    withCredentials: true,
  });

  return res;
};

const getCSRFToken = async () => {
  const res = await api.get(`${LOGIN_API_URL}/csrf-token`, {
    withCredentials: true,
  });

  return res;
};

export { login, logout, checkLogin, getCSRFToken };
