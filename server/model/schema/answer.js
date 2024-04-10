const mongoose = require("mongoose");

var Answer = mongoose.Schema(
  {
    id: { type: String },
    text: { type: String, required: true },
    ans_by: { type: String, required: true },
    ans_date_time: { type: Date, required: true },
  },
  { collection: "Answer" }
);

mongoose.model("Answer", Answer);

module.exports = Answer;
