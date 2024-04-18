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

  if (answer) {
    if (answer.upvotes.includes(uid)) {
      answer = await Answer.findOneAndUpdate(
        { _id: { $eq: aid } },
        { $pull: { downvotes: uid, upvotes: uid } },
        { new: true }
      );

      updateUserReputation(-10, answer.ans_by._id);
    } else {
      answer = await Answer.findOneAndUpdate(
        { _id: { $eq: aid } },
        { $addToSet: { upvotes: uid }, $pull: { downvotes: uid } },
        { new: true }
      );
      if (answer.downvotes.includes(uid)) {
        updateUserReputation(12, answer.ans_by._id);
      } else {
        updateUserReputation(10, answer.ans_by._id);
      }
    }

    res.send(answer);
  }
};

const downvote = async (req, res) => {
  //Add to downvote list
  let aid = req.body.aid;
  let uid = req.body.uid;

  let answer = await Answer.findById(aid);

  if (answer) {
    if (answer.downvotes.includes(uid)) {
      answer = await Answer.findOneAndUpdate(
        { _id: { $eq: aid } },
        { $pull: { downvotes: uid, upvotes: uid } },
        { new: true }
      );
      updateUserReputation(2, answer.ans_by._id);
    } else {
      answer = await Answer.findOneAndUpdate(
        { _id: { $eq: aid } },
        { $addToSet: { downvotes: uid }, $pull: { upvotes: uid } },
        { new: true }
      );
      if (answer.upvotes.includes(uid)) {
        updateUserReputation(-12, answer.ans_by._id);
      } else {
        updateUserReputation(-2, answer.ans_by._id);
      }
    }

    res.send(answer);
  }
};

const updateUserReputation = async (delta, id) => {
  await User.findOneAndUpdate(
    { _id: { $eq: id } },
    { $inc: { reputation: delta } }
  );
};

const deleteAnswer = async (req, res) => {
  try {
    let aid = req.body.aid;
    let answer = await Answer.findById(aid).populate("ans_by");
    let user = answer.ans_by;
    await user.populate("ansList");

    const results = await Promise.all(
      user.ansList.map((q) => q.populate("answers"))
    );
    user.ansList = results.filter((q) => {
      let ansCount = 0;
      q.answers.forEach((ans) => {
        if (ans.ans_by.toString() == user._id) {
          ansCount = ansCount + 1;
        }
      });
      return ansCount != 1;
    });

    await Answer.findByIdAndDelete(aid);
    await user.save();
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

  return Answer.create(answerdetail);
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
