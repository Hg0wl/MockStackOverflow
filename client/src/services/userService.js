import { REACT_APP_API_URL, api } from "./config";

const USER_API_URL = `${REACT_APP_API_URL}/user`;

// To get Questions by id
const getUserById = async (uid) => {
    console.log("Calling get question by id!")
  const res = await api.get(`${USER_API_URL}/getUserById/${uid}`);

  return res.data;
};

export { getUserById }