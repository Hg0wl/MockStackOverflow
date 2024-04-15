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

const changeProfilePicture = async (req, res) => {
  try {
    let link = req.body.link;
    let uid = req.body.uid;

    await User.findOneAndUpdate(
      { _id: { $eq: uid } },
      { $set: { profile_pic: link } }
    );

    res.send({ success: true, link: link });
  } catch (error) {
    res.send({ success: false });
  }
};

router.get("/getUserById/:uid", (req, res) => getUserById(req, res));
router.post("/changeUsername", (req, res) => changeUsername(req, res));
router.post("/changeProfilePicture", (req, res) =>
  changeProfilePicture(req, res)
);

module.exports = router;
