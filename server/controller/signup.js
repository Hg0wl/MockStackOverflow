const express = require("express");
const User = require("../models/users");

const router = express.Router();

function userCreate(
  username,
  password,
  profile_pic,
  reputation,
  join_date,
  askList,
  ansList
) {
  let userDetail = {
    username,
    password,
    profile_pic,
    reputation,
    join_date,
    askList,
    ansList,
  };

  let user = User(userDetail);
  return user.save();
}

router.post("/signup", async (req, res) => {
  const { username, password } = req.body;
    console.log(username, password)
  let user = {}
  try {
    user = await userCreate(
      username,
      password,
      "https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg",
      0,
      new Date(),
      [],
      []
    );

    res.send({user: user, success: true})
  } catch (error) {
    console.log(error)
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

module.exports = router;
