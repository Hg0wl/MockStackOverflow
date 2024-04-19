// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { MONGO_URL, CLIENT_URL, port } = require('./config');

const csurf = require("csurf");
const session = require("express-session");



// const MONGO_URL = "mongodb://127.0.0.1:27017/fake_so";
// const MONGO_URL = "mongodb://mongodb:27017/fake_so";
// const CLIENT_URL = "http://localhost:3000";
// const port = 8000;

mongoose.connect(MONGO_URL);

const app = express();

app.use(
  cors({
    credentials: true,
    origin: [CLIENT_URL],
  })
);

app.use(
  session({
    secret: "your-secret-key", // never hardcode in source code. hard-coded here for demonstration purposes.
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
