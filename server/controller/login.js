const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const csurf = require("csurf");
const User = require("../models/users");

const router = express.Router();

// Set up middleware
router.use(bodyParser.json());
router.use(
  session({
    secret: "your-secret-key", // never hardcode in source code. hard-coded here for demonstration purposes.
    resave: false,
    saveUninitialized: true,
  })
);

// Set up CSRF protection
router.use(csurf());

router.get("/csrf-token", async (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Login route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({
    username: { $eq: username },
    password: { $eq: password },
  });

  if (user) {
    req.session.user = user;
    res.json({ success: true, user });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

// Logout route
router.post("/logout", async (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

// Check login status route
router.get("/check-login", async (req, res) => {
  const user = req.session.user;
  res.json({ loggedIn: !!user, user });
});

module.exports = router;
