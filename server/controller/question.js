const express = require("express");
const Question = require("../models/questions");
const User = require("../models/users");
const {
  addTag,
  getQuestionsByOrder,
  filterQuestionsBySearch,
} = require("../utils/question");

const router = express.Router();

/**
 * Returns a list of questions according to the given sorting and filtering criteria
 *
 * @param {*} req Should contain an order field to dictate sorting order and serach field to dictate filter
 * @param {*} res The response of the server
 */
const getQuestionsByFilter = async (req, res) => {
  let order = req.query.order;
  let search = req.query.search;
  let questions = await getQuestionsByOrder(order);
  questions = filterQuestionsBySearch(questions, search);

  res.send(questions);
};

/**
 * Responds with the Question with the given id
 *
 * @param {*} req should have a qid parameter that is the id of the question to send back
 * @param {*} res the response of the server
 */
const getQuestionById = async (req, res) => {
  let question = await Question.findById(req.params.qid)
    .populate({ path: "answers", populate: "ans_by" })
    .populate("tags")
    .populate("asked_by");
  question.views += 1;

  question.save(question);
  res.send(question);
};

/**
 * Adds a question with the given fileds to the database
 *
 * @param {*} req The body shoudl consist of the fields to include in the question:
 * title, text, tags, asked_by, and ask_date_time
 * @param {*} res The response of the server
 */
const addQuestion = async (req, res) => {
  let q = req.body;
  let tagPromises = q.tags.map((tag) => addTag(tag));
  let tagIds = await Promise.all(tagPromises);

  //Assign this question to a user
  let question = await questionCreate(
    q.title,
    q.text,
    tagIds,
    [],
    q.asked_by,
    q.ask_date_time,
    0
  );

  await User.findOneAndUpdate(
    { _id: { $eq: q.asked_by } },
    { $push: { askList: { $each: [question._id], $position: 0 } } },
    { new: true }
  );

  res.send(question);
};

/**
 * Upvotes the given post by adding the given user to the question's upvotes list or
 * removing it if the user is already present there. Also updates the user's reputation accordingly
 *
 * @param {*} req Should contain the id of the question being upvoted and the id of the user who is upvoting
 * @param {*} res The response of the server
 */
const upvote = async (req, res) => {
  let qid = req.body.qid;
  let uid = req.body.uid;

  let question = await Question.findById(qid);

  if (question) {
    if (question.upvotes.includes(uid)) {
      question = await Question.findOneAndUpdate(
        { _id: { $eq: qid } },
        { $pull: { downvotes: uid, upvotes: uid } },
        { new: true }
      );

      updateUserReputation(-10, question.asked_by._id);
    } else {
      if (question.downvotes.includes(uid)) {
        updateUserReputation(12, question.asked_by._id);
      } else {
        updateUserReputation(10, question.asked_by._id);
      }
      question = await Question.findOneAndUpdate(
        { _id: { $eq: qid } },
        { $addToSet: { upvotes: uid }, $pull: { downvotes: uid } },
        { new: true }
      );
    }

    res.send(question);
  }
};

/**
 * Downvotes the given post by adding the given user to the question's downvotes list or
 * removing it if the user is already present there. Also updates the user's reputation accordingly.
 * 
 * @param {*} req Should contain the id of the question being downvoted and the id of the user who is downvoting
 * @param {*} res The response of the server
 */
const downvote = async (req, res) => {
  let qid = req.body.qid;
  let uid = req.body.uid;

  let question = await Question.findById(qid);

  if (question) {
    if (question.downvotes.includes(uid)) {
      question = await Question.findOneAndUpdate(
        { _id: { $eq: qid } },
        { $pull: { downvotes: uid, upvotes: uid } },
        { new: true }
      );

      updateUserReputation(2, question.asked_by._id);
    } else {
      if (question.upvotes.includes(uid)) {
        updateUserReputation(-12, question.asked_by._id);
      } else {
        updateUserReputation(-2, question.asked_by._id);
      }
      question = await Question.findOneAndUpdate(
        { _id: { $eq: qid } },
        { $addToSet: { downvotes: uid }, $pull: { upvotes: uid } },
        { new: true }
      );
    }

    res.send(question);
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
 * Removes the given question from the database
 * 
 * @param {*} req should have the id of the questio to delete, qid, in the body
 * @param {*} res the response of the server
 */
const deleteQuestion = async (req, res) => {
  try {
    let qid = req.body.qid;
    await Question.findByIdAndDelete(qid);

    res.send({ success: true });
  } catch {
    res.send({ success: false });
  }
};

/**
 * Removes the given tag from the given question and saves the new question to the database
 * 
 * @param {*} req should have the ids of the question and tag to delete in the body (qid, tid)
 * @param {*} res 
 */
const removeTag = async (req, res) => {
  try {
    let qid = req.body.qid;
    let tid = req.body.tid;
    let question = await Question.findOneAndUpdate(
      { _id: { $eq: qid } },
      { $pull: { tags: tid } },
      { new: true }
    ).populate("tags");

    res.send({ success: true, tags: question.tags });
  } catch (error) {
    res.send({ success: false });
  }
};

/**
 * Adds the given tags to the given question
 * 
 * @param {*} req body should contain a list of string with new tags to add and the id of the question to add them to (tags, qid)
 * @param {*} res the response of the server
 */
const addTags = async (req, res) => {
  try {
    let tags = req.body.tags;
    let qid = req.body.qid;
    let tagPromises = tags.map((tag) => addTag(tag));
    let tagIds = await Promise.all(tagPromises);

    let question = await Question.findOneAndUpdate(
      { _id: { $eq: qid } },
      { $addToSet: { tags: { $each: tagIds } } },
      { new: true }
    ).populate("tags");

    res.send({ success: true, tags: question.tags });
  } catch (error) {
    console.log(error);
    res.send({ success: false });
  }
};

/**
 * Creates a new question with the given data
 * 
 * @param {*} title the title of the question
 * @param {*} text the body text of the question
 * @param {*} tags a list of tags for this question
 * @param {*} answers a list of answer for this question 
 * @param {*} asked_by the user who asked the question
 * @param {*} ask_date_time the time the question was asked
 * @param {*} views the number of views on this question
 * @returns A Question object with the given data
 */
function questionCreate(
  title,
  text,
  tags,
  answers,
  asked_by,
  ask_date_time,
  views
) {
  let qstndetail = {
    title: title,
    text: text,
    tags: tags,
    asked_by: asked_by,
  };
  if (answers != false) qstndetail.answers = answers;
  if (ask_date_time != false) qstndetail.ask_date_time = ask_date_time;
  if (views != false) qstndetail.views = views;

  let qstn = Question.create(qstndetail);
  return qstn;
}

// add appropriate TP verbs and their endpoints to the router
router.get("/getQuestion", (req, res) => getQuestionsByFilter(req, res));

router.get("/getQuestionById/:qid", (req, res) => getQuestionById(req, res));

router.use("/addQuestion", express.json());
router.post("/addQuestion", (req, res) => addQuestion(req, res));

router.use("/upvote", express.json());
router.post("/upvote", (req, res) => upvote(req, res));

router.use("/downvote", express.json());
router.post("/downvote", (req, res) => downvote(req, res));

router.use("/deleteQuestion", express.json());
router.post("/deleteQuestion", (req, res) => deleteQuestion(req, res));

router.use("/removeTag", express.json());
router.post("/removeTag", (req, res) => removeTag(req, res));

router.use("/addTags", express.json());
router.post("/addTags", (req, res) => addTags(req, res));

module.exports = router;
