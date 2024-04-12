const mongoose = require("mongoose");

var Tag = mongoose.Schema(
  {
    id: { type: String },
    name: { type: String, required: true },
  },
  { collection: "Tag" }
);

module.exports = Tag;
mongoose.model("Tag", Tag);
