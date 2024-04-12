const mongoose = require("mongoose");

var Schema = mongoose.Schema;
var Question = mongoose.Schema(
  {
    id: { type: String },
    title: { type: String, required: true },
    text: { type: String, required: true },
    asked_by: { type: Schema.Types.ObjectId, ref: "User", required: true },
    ask_date_time: { type: Date, required: true },
    views: { type: Number, required: true, default: 0 },
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
    answers: [{ type: Schema.Types.ObjectId, ref: "Answer" }],
    upvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    downvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { collection: "Question" }
);
// Schema for questions
module.exports = Question;
mongoose.model("Question", Question);
