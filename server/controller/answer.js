const express = require("express");
const Answer = require("../models/answers");
const Question = require("../models/questions");
const User = require("../models/users");

const router = express.Router();

/**
 * Adds an answer to the given question in the database
 * 
 * @param {*} req Should contain an ans object with text, ans_by, and and_date_time fields and 
 *                the qid to add the answer to
 * @param {*} res The server response
 */
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

/**
 * Upvotes the given post by adding the given user to the answer's upvotes list or
 * removing it if the user is already present there. Also updates the user's reputation accordingly
 * 
 * @param {*} req Should contain the id of the answer being upvoted and the id of the user who is upvoting
 * @param {*} res The response of the server
 */
const upvote = async (req, res) => {
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
      if (answer.downvotes.includes(uid)) {
        updateUserReputation(12, answer.ans_by._id);
      } else {
        updateUserReputation(10, answer.ans_by._id);
      }
      answer = await Answer.findOneAndUpdate(
        { _id: { $eq: aid } },
        { $addToSet: { upvotes: uid }, $pull: { downvotes: uid } },
        { new: true }
      );
    }

    res.send(answer);
  }
};

/**
 * Downvotes the given post by adding the given user to the answer's downvotes list or
 * removing it if the user is already present there. Also updates the user's reputation accordingly.
 * 
 * @param {*} req Should contain the id of the answer being downvoted and the id of the user who is downvoting
 * @param {*} res The response of the server
 */
const downvote = async (req, res) => {
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
      if (answer.upvotes.includes(uid)) {
        updateUserReputation(-12, answer.ans_by._id);
      } else {
        updateUserReputation(-2, answer.ans_by._id);
      }
      answer = await Answer.findOneAndUpdate(
        { _id: { $eq: aid } },
        { $addToSet: { downvotes: uid }, $pull: { upvotes: uid } },
        { new: true }
      );
    }

    res.send(answer);
  }
};

/**
 * Adds the given value to the given user's reputation
 * 
 * @param {*} delta The ammount to add to the reputation 
 * @param {*} id The id of the user whose reputation is being updated
 */
const updateUserReputation = async (delta, id) => {
  await User.findOneAndUpdate(
    { _id: { $eq: id } },
    { $inc: { reputation: delta } }
  );
};

/**
 * Removes the given answer from the databse. If that answer the only answer by the person who answered it,
 * removes the associated question from the user's list of answered questions. It remains there if the user
 * had another answer on that question
 * 
 * @param {*} req Should contain the id of the answer to delete
 * @param {*} res The response of the server
 */
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

/**
 * Creates an Answer with the given data and saves it to the databse
 * 
 * @param {*} text The body text of the answer
 * @param {*} ans_by The user who answered
 * @param {*} ans_date_time The time the aswer was posted
 * @returns 
 */
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
