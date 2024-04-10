const express = require("express");
const Tag = require("../models/tags");
const Question = require("../models/questions");

const router = express.Router();

const getTagsWithQuestionNumber = async (req, res) => {
  let tags = await Tag.find({});
  let tagsWithNumber = [];
  let counts = [];

  questions = await Question.find({}).populate("tags");

  tags.forEach((t) => {
    let name = t.name;
    let filteredQuestions = questions.filter((q) =>
      q.tags.map((t) => t.name).includes(name)
    );
    counts.push(filteredQuestions.length);
  });

  for (let i = 0; i < counts.length; i++) {
    tagsWithNumber.push({
      name: tags[i].name,
      qcnt: counts[i],
    });
  }

  res.send(tagsWithNumber);
};

// add appropriate HTTP verbs and their endpoints to the router.

router.get("/getTagsWithQuestionNumber", (req, res) =>
  getTagsWithQuestionNumber(req, res)
);

module.exports = router;
