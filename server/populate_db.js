// Run this script to test your schema
// Start the mongoDB service as a background process before running the script
// Pass URL of your mongoDB instance as first argument(e.g., mongodb://127.0.0.1:27017/fake_so)
let userArgs = process.argv.slice(2);

if (!userArgs[0].startsWith("mongodb")) {
  console.log(
    "ERROR: You need to specify a valid mongodb URL as the first argument"
  );
  return;
}

let Tag = require("./models/tags");
let Answer = require("./models/answers");
let Question = require("./models/questions");
let User = require("./models/users");

let mongoose = require("mongoose");
let mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
// mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

function tagCreate(name) {
  let tag = new Tag({ name: name });
  return tag.save();
}

function answerCreate(text, ans_by, ans_date_time) {
  let answerdetail = { text: text };
  if (ans_by != false) answerdetail.ans_by = ans_by;
  if (ans_date_time != false) answerdetail.ans_date_time = ans_date_time;

  let answer = new Answer(answerdetail);
  return answer.save();
}

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

function questionCreate(
  title,
  text,
  tags,
  answers,
  asked_by,
  ask_date_time,
  views
) {
  qstndetail = {
    title: title,
    text: text,
    tags: tags,
    asked_by: asked_by,
  };
  if (answers != false) qstndetail.answers = answers;
  if (ask_date_time != false) qstndetail.ask_date_time = ask_date_time;
  if (views != false) qstndetail.views = views;

  let qstn = new Question(qstndetail);
  return qstn.save();
}

const populate = async () => {
  let u1 = await userCreate(
    "Blue Toad",
    "password",
    "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/7007030f-ab1b-4e6d-8082-5f4ba8258af8/de777rp-cabd2ca2-1866-4d9d-9e26-278fa781d076.jpg/v1/fill/w_451,h_443,q_75,strp/blue_toad_total_drama_square_by_totaldramamario_de777rp-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NDQzIiwicGF0aCI6IlwvZlwvNzAwNzAzMGYtYWIxYi00ZTZkLTgwODItNWY0YmE4MjU4YWY4XC9kZTc3N3JwLWNhYmQyY2EyLTE4NjYtNGQ5ZC05ZTI2LTI3OGZhNzgxZDA3Ni5qcGciLCJ3aWR0aCI6Ijw9NDUxIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.zJVwrGjzv9niCIDKGgebmly1THswyykIHYdU1H5iOnI",
    250,
    new Date("2023-11-20T03:24:42"),
    [],
    []
  );
  let u2 = await userCreate(
    "Red Toad",
    "password",
    "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/7007030f-ab1b-4e6d-8082-5f4ba8258af8/de75ehx-831e7755-e42c-48b8-89f3-e3cc52674142.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzcwMDcwMzBmLWFiMWItNGU2ZC04MDgyLTVmNGJhODI1OGFmOFwvZGU3NWVoeC04MzFlNzc1NS1lNDJjLTQ4YjgtODlmMy1lM2NjNTI2NzQxNDIuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.blpIYYFz5CuWYhWqFXqA7pAmeLdy5oz2idER7EW2Q0Q",
    450,
    new Date("2023-11-20T03:24:42"),
    [],
    []
  );
  let u3 = await userCreate(
    "Yoshi",
    "password",
    "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/7007030f-ab1b-4e6d-8082-5f4ba8258af8/de75epb-7bf82a3f-ba1b-41a9-bd00-4d4e58b98c33.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzcwMDcwMzBmLWFiMWItNGU2ZC04MDgyLTVmNGJhODI1OGFmOFwvZGU3NWVwYi03YmY4MmEzZi1iYTFiLTQxYTktYmQwMC00ZDRlNThiOThjMzMuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.A7I3qxIL5VWMSVKdoyWou6if5Auy67IKZzsOErnZa_Q",
    450,
    new Date("2023-11-12T03:30:00"),
    [],
    []
  );

  let t1 = await tagCreate("react");
  let t2 = await tagCreate("javascript");
  let t3 = await tagCreate("android-studio");
  let t4 = await tagCreate("shared-preferences");
  let t5 = await tagCreate("storage");
  let t6 = await tagCreate("website");
  let t7 = await tagCreate("Flutter");
  let a1 = await answerCreate(
    "React Router is mostly a wrapper around the history library. history handles interaction with the browser's window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don't have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.",
    u1,
    new Date("2023-11-20T03:24:42")
  );
  let a2 = await answerCreate(
    "On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn't change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router.",
    u2,
    new Date("2023-11-23T08:24:00")
  );
  let a3 = await answerCreate(
    "Consider using apply() instead; commit writes its data to persistent storage immediately, whereas apply will handle it in the background.",
    u3,
    new Date("2023-11-18T09:24:00")
  );
  let a4 = await answerCreate(
    "YourPreference yourPrefrence = YourPreference.getInstance(context); yourPreference.saveData(YOUR_KEY,YOUR_VALUE);",
    u1,
    new Date("2023-11-12T03:30:00")
  );
  let a5 = await answerCreate(
    "I just found all the above examples just too confusing, so I wrote my own. ",
    u2,
    new Date("2023-11-01T15:24:19")
  );
  let a6 = await answerCreate(
    "Storing content as BLOBs in databases.",
    u3,
    new Date("2023-02-19T18:20:59")
  );
  let a7 = await answerCreate(
    "Using GridFS to chunk and store content.",
    u1,
    new Date("2023-02-22T17:19:00")
  );
  let a8 = await answerCreate(
    "Store data in a SQLLite database.",
    u2,
    new Date("2023-03-22T21:17:53")
  );
  await questionCreate(
    "Programmatically navigate using React router",
    "the alert shows the proper index for the li clicked, and when I alert the variable within the last function Im calling, moveToNextImage(stepClicked), the same value shows but the animation isnt happening. This works many other ways, but Im trying to pass the index value of the list item clicked to use for the math to calculate.",
    [t1, t2],
    [a1, a2],
    u3,
    new Date("2022-01-20T03:00:00"),
    10
  );
  await questionCreate(
    "android studio save string shared preference, start activity and load the saved string",
    "I am using bottom navigation view but am using custom navigation, so my fragments are not recreated every time i switch to a different view. I just hide/show my fragments depending on the icon selected. The problem i am facing is that whenever a config change happens (dark/light theme), my app crashes. I have 2 fragments in this activity and the below code is what i am using to refrain them from being recreated.",
    [t3, t4, t2],
    [a3, a4, a5],
    u1,
    new Date("2023-01-10T11:24:30"),
    121
  );
  await questionCreate(
    "Object storage for a web application",
    "I am currently working on a website where, roughly 40 million documents and images should be served to its users. I need suggestions on which method is the most suitable for storing content with subject to these requirements.",
    [t5, t6],
    [a6, a7],
    u2,
    new Date("2023-02-18T01:02:15"),
    200
  );
  await questionCreate(
    "Quick question about storage on android",
    "I would like to know the best way to go about storing an array on an android phone so that even when the app/activity ended the data remains",
    [t3, t4, t5],
    [a8],
    u3,
    new Date("2023-03-10T14:28:01"),
    103
  );
  if (db) db.close();
  console.log("done");
};

populate().catch((err) => {
  console.log("ERROR: " + err);
  if (db) db.close();
});

console.log("processing ...");
