const express = require("express");
const User = require("../models/users");

const router = express.Router();

/**
 * Creates a user with the given data
 * 
 * @param {*} username The user's username
 * @param {*} password The password used when the user logs in
 * @param {*} profile_pic A link the the user's profile image
 * @param {*} reputation The ammount of reputation the user has
 * @param {*} join_date The date the user created an account
 * @param {*} askList The list of Questions this user asked
 * @param {*} ansList The list of Questions this user has an answer on 
 * @returns 
 */
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

  return User.create(userDetail);
}

router.post("/signup", async (req, res) => {
  const { username, password } = req.body;
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
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

module.exports = router;
