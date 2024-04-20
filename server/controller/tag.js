const express = require("express");
const Tag = require("../models/tags");
const Question = require("../models/questions");

const router = express.Router();

/**
 * Returns a list of objects that contain a tag and a count of questions that have that tag
 *
 * @param {*} res The response of the server
 */
const getTagsWithQuestionNumber = async (_, res) => {
  let tags = await Tag.find({});
  let tagsWithNumber = [];
  let counts = [];

  let questions = await Question.find({}).populate("tags");

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

router.get("/getTagsWithQuestionNumber", (req, res) =>
  getTagsWithQuestionNumber(req, res)
);

module.exports = router;
