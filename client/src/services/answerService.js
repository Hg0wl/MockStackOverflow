import { REACT_APP_API_URL, api } from "./config";

const ANSWER_API_URL = `${REACT_APP_API_URL}/answer`;

// To add answer
const addAnswer = async (qid, ans) => {
  const data = { qid: qid, ans: ans };
  const res = await api.post(`${ANSWER_API_URL}/addAnswer`, data);

  return res.data;
};

const upvoteAnswer = async (aid, uid ) => {
  const data = { aid: aid, uid: uid };
  const res = await api.post(`${ANSWER_API_URL}/upvote`, data);

  return res.data;
};

const downvoteAnswer = async (aid, uid ) => {
  const data = { aid: aid, uid: uid };
  const res = await api.post(`${ANSWER_API_URL}/downvote`, data);

  return res.data;
};

const deleteAnswer = async (aid) => {
  const res = await api.post(`${ANSWER_API_URL}/deleteAnswer`, { aid: aid });
  return res.data
}

export { addAnswer, upvoteAnswer, downvoteAnswer, deleteAnswer };
