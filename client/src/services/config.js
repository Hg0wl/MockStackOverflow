import _axios from "axios";

const REACT_APP_API_URL = "http://localhost:8000";
let csrfHeader = {
  withCredentials: true,
};

const handleRes = (res) => {
  return res;
};

const handleErr = (err) => {
  console.log(err);
  return err;
};

const getCsrfHeader = () => {
  return csrfHeader;
};

const setCsrfHeader = (header) => {
  csrfHeader = header;
};

const api = _axios.create({ withCredentials: true });
api.interceptors.request.use(handleRes, handleErr);
api.interceptors.response.use(handleRes, handleErr);

export { REACT_APP_API_URL, api, getCsrfHeader, setCsrfHeader };
