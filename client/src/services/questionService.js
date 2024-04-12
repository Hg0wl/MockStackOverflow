import { REACT_APP_API_URL, api } from "./config";

const QUESTION_API_URL = `${REACT_APP_API_URL}/question`;

// To get Questions by Filter
const getQuestionsByFilter = async (order = "newest", search = "") => {
  const res = await api.get(
    `${QUESTION_API_URL}/getQuestion?order=${order}&search=${search}`
  );
  return res.data;
};

// To get Questions by id
const getQuestionById = async (qid) => {
    console.log("Calling get question by id!")
  const res = await api.get(`${QUESTION_API_URL}/getQuestionById/${qid}`);

  return res.data;
};

// To add Questions
const addQuestion = async (q) => {
  const res = await api.post(`${QUESTION_API_URL}/addQuestion`, q);

  return res.data;
};

const upvoteQuestion = async (qid, uid = "661974964d0bb703784662b3") => {
  const data = { qid: qid, uid: uid };
  const res = await api.post(`${QUESTION_API_URL}/upvote`, data);

  console.log(res);
  console.log(res.data);

  return res.data;
};

const downvoteQuestion = async (qid, uid = "661974964d0bb703784662b3") => {
  const data = { qid: qid, uid: uid };
  const res = await api.post(`${QUESTION_API_URL}/downvote`, data);

  return res.data;
};

export { getQuestionsByFilter, getQuestionById, addQuestion, upvoteQuestion, downvoteQuestion };
