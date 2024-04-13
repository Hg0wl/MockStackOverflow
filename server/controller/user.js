const express = require("express");
const User = require("../models/users");

const router = express.Router();

const getUserById = async (req, res) => {
  let user = await User.findById(req.params.uid)
    .populate("askList")
    .populate("ansList");
  res.send(user);
};

const changeUsername = async (req, res) => {
  let newUsername = req.body.username;
  let uid = req.body.uid;
  console.log(newUsername);

  let userList = await User.find({ username: { $eq: newUsername } });
  if (userList.length == 0) {
    await User.findOneAndUpdate(
      { _id: { $eq: uid } },
      { $set: { username: newUsername } },
      { new: true }
    );

    res.send({ success: true });
  } else {
    res.send({
      success: false,
      message: "A user with this username already exists",
    });
  }
};

router.get("/getUserById/:uid", (req, res) => getUserById(req, res));
router.post("/changeUsername", (req, res) => changeUsername(req, res));

module.exports = router;
