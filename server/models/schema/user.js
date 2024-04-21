const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var User = mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profile_pic: {
      type: String,
      required: true,
      default:
        "https://t4.ftcdn.net/jpg/04/10/43/77/360_F_410437733_hdq4Q3QOH9uwh0mcqAhRFzOKfrCR24Ta.jpg",
    },
    reputation: { type: Number, required: true, default: 0 },
    join_date: { type: Date, required: true },
    askList: [{ type: Schema.Types.ObjectId, ref: "Question" }],
    ansList: [{ type: Schema.Types.ObjectId, ref: "Question" }],
  },
  { collection: "User" }
);

module.exports = User;
mongoose.model("User", User);
