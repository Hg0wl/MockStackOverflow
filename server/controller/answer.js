const express = require("express");
const Answer = require("../models/answers");
const Question = require("../models/questions");
const User = require("../models/users");

const router = express.Router();

// Adding answer
const addAnswer = async (req, res) => {
  let ans = req.body.ans;
  let qid = req.body.qid;

  let answer = await answerCreate(ans.text, ans.ans_by, ans.ans_date_time);

  await Question.findOneAndUpdate(
    { _id: { $eq: qid } },
    { $push: { answers: { $each: [answer._id], $position: 0 } } },
    { new: true }
  );

  await User.findOneAndUpdate(
    { _id: { $eq: ans.ans_by } },
    { $addToSet: { ansList: { $each: [qid]} } },
    { new: true }
  );

  res.send(answer);
};

function answerCreate(text, ans_by, ans_date_time) {
  let answerdetail = { text: text };
  if (ans_by != false) answerdetail.ans_by = ans_by;
  if (ans_date_time != false) answerdetail.ans_date_time = ans_date_time;

  let answer = new Answer(answerdetail);
  answer.save();
  return answer;
}

router.use("/addAnswer", express.json());
router.post("/addAnswer", (req, res) => addAnswer(req, res));

module.exports = router;
