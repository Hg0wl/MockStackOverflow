const express = require("express");
const Question = require("../models/questions");
const Answer = require("../models/answers");
const Tag = require("../models/tags");
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
    .populate("answers")
    .populate("tags");
  question.views += 1;

  question.save(question);
  res.send(question);
};

// To add Question
const addQuestion = async (req, res) => {
  let q = req.body;
  let tagPromises = q.tags.map((tag) => addTag(tag));
  let tagIds = await Promise.all(tagPromises);

  if (q._id) {
    res.send({
      _id: q._id,
      answers: q.answers,
      tags: q.tags,
      text: q.text,
      title: q.title,
    });
  } else {
    let question = await questionCreate(
      q.title,
      q.text,
      tagIds,
      [],
      q.asked_by,
      q.ask_date_time,
      0
    );
    console.log(question);
    res.send(question);
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

module.exports = router;
