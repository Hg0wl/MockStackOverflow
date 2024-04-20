// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { MONGO_URL, CLIENT_URL, port } = require('./config');

const csurf = require("csurf");
const session = require("express-session");

mongoose.connect(MONGO_URL);

const app = express();

app.use(
  cors({
    credentials: true,
    origin: [CLIENT_URL],
  })
);

var token = require("crypto").randomBytes(48).toString("hex");
app.use(
  session({
    secret: token,
    resave: false,
    saveUninitialized: false,
  })
);

// Set up CSRF protection
app.use(csurf());

app.use(express.json());

require("./models/users");

const questionController = require("./controller/question");
const tagController = require("./controller/tag");
const answerController = require("./controller/answer");
const userController = require("./controller/user");
const loginController = require("./controller/login");
const signupController = require("./controller/signup")

app.use("/question", questionController);
app.use("/tag", tagController);
app.use("/answer", answerController);
app.use("/user", userController);
app.use("/login", loginController);
app.use("/signup", signupController)

let server = app.listen(port, () => {
  console.log(`Server starts at http://localhost:${port}`);
});

process.on("SIGINT", () => {
  server.close();
  mongoose.disconnect();
  console.log("Server closed. Database instance disconnected");
  process.exit(0);
});

module.exports = server;
