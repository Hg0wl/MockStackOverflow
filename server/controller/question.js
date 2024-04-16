const express = require("express");
const Question = require("../models/questions");
const Answer = require("../models/answers");
const Tag = require("../models/tags");
const User = require("../models/users");
const {
  addTag,
  getQuestionsByOrder,
  filterQuestionsBySearch,
} = require("../utils/question");

const router = express.Router();

// To get Questions by Filter
const getQuestionsByFilter = async (req, res) => {
  let order = req.query.order;
  let search = req.query.search;
  let questions = await getQuestionsByOrder(order);
  questions = filterQuestionsBySearch(questions, search);

  res.send(questions);
};

// To get Questions by Id
const getQuestionById = async (req, res) => {
  let question = await Question.findById(req.params.qid)
    .populate({ path: "answers", populate: "ans_by" })
    .populate("tags")
    .populate("asked_by");
  question.views += 1;

  question.save(question);
  res.send(question);
};

// To add Question
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

const upvote = async (req, res) => {
  //Add to upvote list
  let qid = req.body.qid;
  let uid = req.body.uid;

  let question = await Question.findById(qid);

  if (question.upvotes.includes(uid)) {
    question = await Question.findOneAndUpdate(
      { _id: { $eq: qid } },
      { $pull: { downvotes: uid, upvotes: uid } },
      { new: true }
    );

    await User.findOneAndUpdate(
      { _id: { $eq: question.asked_by._id } },
      { $inc: { reputation: -10 } }
    );
  } else if (question.downvotes.includes(uid)) {
    question = await Question.findOneAndUpdate(
      { _id: { $eq: qid } },
      { $addToSet: { upvotes: uid }, $pull: { downvotes: uid } },
      { new: true }
    );

    console.log(question.upvotes);
    await User.findOneAndUpdate(
      { _id: { $eq: question.asked_by._id } },
      { $inc: { reputation: 12 } }
    );
  } else {
    await User.findOneAndUpdate(
      { _id: { $eq: question.asked_by._id } },
      { $inc: { reputation: 10 } }
    );
    question = await Question.findOneAndUpdate(
      { _id: { $eq: qid } },
      { $addToSet: { upvotes: uid }, $pull: { downvotes: uid } },
      { new: true }
    );
  }

  res.send(question);
};

const downvote = async (req, res) => {
  //Add to downvote list
  let qid = req.body.qid;
  let uid = req.body.uid;

  let question = await Question.findById(qid);

  if (question.downvotes.includes(uid)) {
    console.log("downvotes includes");
    question = await Question.findOneAndUpdate(
      { _id: { $eq: qid } },
      { $pull: { downvotes: uid, upvotes: uid } },
      { new: true }
    );

    await User.findOneAndUpdate(
      { _id: { $eq: question.asked_by._id } },
      { $inc: { reputation: 2 } }
    );
  } else if (question.upvotes.includes(uid)) {
    console.log("downvotes not includes");
    question = await Question.findOneAndUpdate(
      { _id: { $eq: qid } },
      { $addToSet: { downvotes: uid }, $pull: { upvotes: uid } },
      { new: true }
    );

    await User.findOneAndUpdate(
      { _id: { $eq: question.asked_by._id } },
      { $inc: { reputation: -12 } }
    );
  } else {
    question = await Question.findOneAndUpdate(
      { _id: { $eq: qid } },
      { $addToSet: { downvotes: uid }, $pull: { upvotes: uid } },
      { new: true }
    );

    await User.findOneAndUpdate(
      { _id: { $eq: question.asked_by._id } },
      { $inc: { reputation: -2 } },
      { new: true }
    );
  }

  res.send(question);
};

const deleteQuestion = async (req, res) => {
  try {
    let qid = req.body.qid;
    await Question.findByIdAndDelete(qid);

    res.send({ success: true });
  } catch {
    res.send({ success: false });
  }
};

const removeTag = async (req, res) => {
  try {
    let qid = req.body.qid;
    let tid = req.body.tid;
    console.log(qid, tid);
    let question = await Question.findOneAndUpdate(
      { _id: { $eq: qid } },
      { $pull: { tags: tid } },
      { new: true }
    ).populate("tags");

    res.send({ success: true, tags: question.tags });
  } catch (error) {
    console.log(error);
    res.send({ success: false });
  }
};

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

function questionCreate(
  title,
  text,
  tags,
  answers,
  asked_by,
  ask_date_time,
  views
) {
  qstndetail = {
    title: title,
    text: text,
    tags: tags,
    asked_by: asked_by,
  };
  if (answers != false) qstndetail.answers = answers;
  if (ask_date_time != false) qstndetail.ask_date_time = ask_date_time;
  if (views != false) qstndetail.views = views;

  let qstn = new Question(qstndetail);
  return qstn.save();
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
