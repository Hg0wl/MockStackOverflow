const express = require("express");
const User = require("../models/users");

const router = express.Router();

const getUserById = async (req, res) => {
  let user = await User.findById(req.params.uid)
    .populate("askList")
    .populate("ansList");
  res.send(user);
};

router.get("/getUserById/:uid", (req, res) => getUserById(req, res));

module.exports = router;
