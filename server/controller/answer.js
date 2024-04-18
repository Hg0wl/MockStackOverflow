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
    { $addToSet: { ansList: { $each: [qid] } } },
    { new: true }
  );

  res.send(answer);
};

const upvote = async (req, res) => {
  //Add to upvote list
  let aid = req.body.aid;
  let uid = req.body.uid;

  let answer = await Answer.findById(aid);

  if (answer.upvotes.includes(uid)) {
    answer = await Answer.findOneAndUpdate(
      { _id: { $eq: aid } },
      { $pull: { downvotes: uid, upvotes: uid } },
      { new: true }
    );

    await User.findOneAndUpdate(
      { _id: { $eq: answer.ans_by._id } },
      { $inc: { reputation: -10 } }
    );
  } else if (answer.downvotes.includes(uid)) {
    answer = await Answer.findOneAndUpdate(
      { _id: { $eq: aid } },
      { $addToSet: { upvotes: uid }, $pull: { downvotes: uid } },
      { new: true }
    );
    await User.findOneAndUpdate(
      { _id: { $eq: answer.ans_by._id } },
      { $inc: { reputation: 12 } }
    );
  } else {
    answer = await Answer.findOneAndUpdate(
      { _id: { $eq: aid } },
      { $addToSet: { upvotes: uid }, $pull: { downvotes: uid } },
      { new: true }
    );
    await User.findOneAndUpdate(
      { _id: { $eq: answer.ans_by._id } },
      { $inc: { reputation: 10 } }
    );
  }

  res.send(answer);
};
const downvote = async (req, res) => {
  //Add to downvote list
  let aid = req.body.aid;
  let uid = req.body.uid;

  let answer = await Answer.findById(aid);

  if (answer.downvotes.includes(uid)) {
    answer = await Answer.findOneAndUpdate(
      { _id: { $eq: aid } },
      { $pull: { downvotes: uid, upvotes: uid } },
      { new: true }
    );
    await User.findOneAndUpdate(
      { _id: { $eq: answer.ans_by._id } },
      { $inc: { reputation: 2 } }
    );
  } else if (answer.upvotes.includes(uid)) {
    answer = await Answer.findOneAndUpdate(
      { _id: { $eq: aid } },
      { $addToSet: { downvotes: uid }, $pull: { upvotes: uid } },
      { new: true }
    );
    await User.findOneAndUpdate(
      { _id: { $eq: answer.ans_by._id } },
      { $inc: { reputation: -12 } }
    );
  } else {
    answer = await Answer.findOneAndUpdate(
      { _id: { $eq: aid } },
      { $addToSet: { downvotes: uid }, $pull: { upvotes: uid } },
      { new: true }
    );
    await User.findOneAndUpdate(
      { _id: { $eq: answer.ans_by._id } },
      { $inc: { reputation: -2 } }
    );
  }

  res.send(answer);
};

const deleteAnswer = async (req, res) => {
  try {
    let aid = req.body.aid;
    await Answer.findByIdAndDelete(aid);

    res.send({ success: true });
  } catch (error) {
    console.log(error);
    res.send({ success: false });
  }
};

function answerCreate(text, ans_by, ans_date_time) {
  let answerdetail = { text: text };
  if (ans_by != false) answerdetail.ans_by = ans_by;
  if (ans_date_time != false) answerdetail.ans_date_time = ans_date_time;

  // let answer = new Answer(answerdetail);
  // answer.save();
  // return answer;
  return Answer.create(answerdetail)
}

router.use("/addAnswer", express.json());
router.post("/addAnswer", (req, res) => addAnswer(req, res));

router.use("/upvote", express.json());
router.post("/upvote", (req, res) => upvote(req, res));

router.use("/downvote", express.json());
router.post("/downvote", (req, res) => downvote(req, res));

router.use("/deleteAnswer", express.json());
router.post("/deleteAnswer", (req, res) => deleteAnswer(req, res));

module.exports = router;
