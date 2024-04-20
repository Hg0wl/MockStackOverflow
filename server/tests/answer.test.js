const supertest = require("supertest");

const User = require("../models/users");
const Answer = require("../models/answers");

// Mocking the models
jest.mock("../models/users");
jest.mock("../models/answers");

let server;

const mockUsers = [
  "65e9b5a995b6c7045a30d824",
  "65e9b5a995b6c7045a30d825",
  "65e9b5a995b6c7045a30d826",
];

const ans1 = {
  _id: "65e9b58910afe6e94fc6e6dc",
  text: "Answer 1 Text",
  ans_by: "answer1_user",
  upvotes: [],
  downvotes: [mockUsers[0]],
};

const ans2 = {
  _id: "65e9b58910afe6e94fc6e6dd",
  text: "Answer 2 Text",
  ans_by: "answer2_user",
  upvotes: [mockUsers[1]],
  downvotes: [],
};

const ans3 = {
  _id: "65e9b58910afe6e94fc6e6df",
  text: "Answer 3 Text",
  ans_by: "answer3_user",
  upvotes: [],
  downvotes: [],
};

describe("POST /upvote", () => {
  beforeEach(() => {
    server = require("../server");
  });

  afterEach(async () => {
    server.close();
  });

  it("Adds an upvote and updates reputation when the user has not upvoted yet", async () => {
    const respToken = await supertest(server).get("/login/csrf-token");
    const token = respToken.body.csrfToken;
    let connectSidValue;
    respToken.headers["set-cookie"].forEach((cookie) => {
      if (cookie.includes("connect.sid")) {
        connectSidValue = cookie.split("=")[1].split(";")[0];
      }
    });

    let updatedUser = {
      _id: "65e9b5a995b6c7045a30d824",
      username: "User1",
      password: "password",
      profile_pic:
        "https://t4.ftcdn.net/jpg/04/10/43/77/360_F_410437733_hdq4Q3QOH9uwh0mcqAhRFzOKfrCR24Ta.jpg",
      reputation: 10,
      join_date: new Date("2023-11-12T03:30:00").toString(),
      askList: [],
      ansList: [],
    };

    let updatedAns = {
      _id: "65e9b58910afe6e94fc6e6df",
      text: "Answer 3 Text",
      ans_by: "answer3_user",
      upvotes: [updatedUser],
      downvotes: [],
    };

    Answer.findById = jest.fn().mockResolvedValueOnce(ans3);
    Answer.findOneAndUpdate = jest.fn().mockResolvedValueOnce(updatedAns);
    User.findOneAndUpdate = jest.fn().mockResolvedValueOnce(updatedUser);

    mockReqBody = {
      aid: "65e9b58910afe6e94fc6e6dc",
      uid: "65e9b5a995b6c7045a30d824",
    };

    // Making the request
    const res = await supertest(server)
      .post("/answer/upvote")
      .send(mockReqBody)
      .set("x-csrf-token", token)
      .set("Cookie", [`connect.sid=${connectSidValue}`]);

    expect(res.status).toBe(200);
    expect(res.body).toStrictEqual(updatedAns);
  });

  it("Removes an upvote and updates reputation when the user has already upvoted", async () => {
    const respToken = await supertest(server).get("/login/csrf-token");
    const token = respToken.body.csrfToken;
    let connectSidValue;
    respToken.headers["set-cookie"].forEach((cookie) => {
      if (cookie.includes("connect.sid")) {
        connectSidValue = cookie.split("=")[1].split(";")[0];
      }
    });

    let updatedUser = {
      _id: "65e9b5a995b6c7045a30d825",
      username: "User2",
      password: "password",
      profile_pic:
        "https://t4.ftcdn.net/jpg/04/10/43/77/360_F_410437733_hdq4Q3QOH9uwh0mcqAhRFzOKfrCR24Ta.jpg",
      reputation: 0,
      join_date: new Date("2023-11-12T03:30:00").toString(),
      askList: [],
      ansList: [],
    };

    let updatedAns = {
      _id: "65e9b58910afe6e94fc6e6dd",
      text: "Answer 2 Text",
      ans_by: "answer2_user",
      upvotes: [],
      downvotes: [],
    };

    Answer.findById = jest.fn().mockResolvedValueOnce(ans2);
    Answer.findOneAndUpdate = jest.fn().mockResolvedValueOnce(updatedAns);
    User.findOneAndUpdate = jest.fn().mockResolvedValueOnce(updatedUser);

    mockReqBody = {
      aid: "65e9b58910afe6e94fc6e6dd",
      uid: "65e9b5a995b6c7045a30d825",
    };

    // Making the request
    const res = await supertest(server)
      .post("/answer/upvote")
      .send(mockReqBody)
      .set("x-csrf-token", token)
      .set("Cookie", [`connect.sid=${connectSidValue}`]);

    expect(res.status).toBe(200);
    expect(res.body).toStrictEqual(updatedAns);
  });

  it("Removes a downvote, upvotes, and updates reputation when the user has already downvoted", async () => {
    const respToken = await supertest(server).get("/login/csrf-token");
    const token = respToken.body.csrfToken;
    let connectSidValue;
    respToken.headers["set-cookie"].forEach((cookie) => {
      if (cookie.includes("connect.sid")) {
        connectSidValue = cookie.split("=")[1].split(";")[0];
      }
    });

    let updatedUser = {
      _id: "65e9b5a995b6c7045a30d824",
      username: "User1",
      password: "password",
      profile_pic:
        "https://t4.ftcdn.net/jpg/04/10/43/77/360_F_410437733_hdq4Q3QOH9uwh0mcqAhRFzOKfrCR24Ta.jpg",
      reputation: 10,
      join_date: new Date("2023-11-12T03:30:00").toString(),
      askList: [],
      ansList: [],
    };

    let updatedAns = {
      _id: "65e9b58910afe6e94fc6e6dc",
      text: "Answer 1 Text",
      ans_by: "answer1_user",
      upvotes: [updatedUser],
      downvotes: [],
    };

    Answer.findById = jest.fn().mockResolvedValueOnce(ans1);
    Answer.findOneAndUpdate = jest.fn().mockResolvedValueOnce(updatedAns);
    User.findOneAndUpdate = jest.fn().mockResolvedValueOnce(updatedUser);

    mockReqBody = {
      aid: "65e9b58910afe6e94fc6e6dc",
      uid: "65e9b5a995b6c7045a30d824",
    };

    // Making the request
    const res = await supertest(server)
      .post("/answer/upvote")
      .send(mockReqBody)
      .set("x-csrf-token", token)
      .set("Cookie", [`connect.sid=${connectSidValue}`]);

    expect(res.status).toBe(200);
    expect(res.body).toStrictEqual(updatedAns);
  });
});

describe("POST /downvote", () => {
  beforeEach(() => {
    server = require("../server");
  });

  afterEach(async () => {
    server.close();
  });

  it("Adds a downvote and updates reputation when the user has not downvoted yet", async () => {
    const respToken = await supertest(server).get("/login/csrf-token");
    const token = respToken.body.csrfToken;
    let connectSidValue;
    respToken.headers["set-cookie"].forEach((cookie) => {
      if (cookie.includes("connect.sid")) {
        connectSidValue = cookie.split("=")[1].split(";")[0];
      }
    });

    let updatedUser = {
      _id: "65e9b5a995b6c7045a30d824",
      username: "User1",
      password: "password",
      profile_pic:
        "https://t4.ftcdn.net/jpg/04/10/43/77/360_F_410437733_hdq4Q3QOH9uwh0mcqAhRFzOKfrCR24Ta.jpg",
      reputation: -2,
      join_date: new Date("2023-11-12T03:30:00").toString(),
      askList: [],
      ansList: [],
    };

    let updatedAns = {
      _id: "65e9b58910afe6e94fc6e6df",
      text: "Answer 3 Text",
      ans_by: "answer3_user",
      upvotes: [],
      downvotes: [updatedUser],
    };

    Answer.findById = jest.fn().mockResolvedValueOnce(ans3);
    Answer.findOneAndUpdate = jest.fn().mockResolvedValueOnce(updatedAns);
    User.findOneAndUpdate = jest.fn().mockResolvedValueOnce(updatedUser);

    mockReqBody = {
      aid: "65e9b58910afe6e94fc6e6dc",
      uid: "65e9b5a995b6c7045a30d824",
    };

    // Making the request
    const res = await supertest(server)
      .post("/answer/downvote")
      .send(mockReqBody)
      .set("x-csrf-token", token)
      .set("Cookie", [`connect.sid=${connectSidValue}`]);

    expect(res.status).toBe(200);
    expect(res.body).toStrictEqual(updatedAns);
  });

  it("Removes a downvote and updates reputation when the user has already downvoted", async () => {
    const respToken = await supertest(server).get("/login/csrf-token");
    const token = respToken.body.csrfToken;
    let connectSidValue;
    respToken.headers["set-cookie"].forEach((cookie) => {
      if (cookie.includes("connect.sid")) {
        connectSidValue = cookie.split("=")[1].split(";")[0];
      }
    });

    let updatedUser = {
      _id: "65e9b5a995b6c7045a30d824",
      username: "User2",
      password: "password",
      profile_pic:
        "https://t4.ftcdn.net/jpg/04/10/43/77/360_F_410437733_hdq4Q3QOH9uwh0mcqAhRFzOKfrCR24Ta.jpg",
      reputation: 2,
      join_date: new Date("2023-11-12T03:30:00").toString(),
      askList: [],
      ansList: [],
    };

    let updatedAns = {
      _id: "65e9b58910afe6e94fc6e6dc",
      text: "Answer 1 Text",
      ans_by: "answer1_user",
      upvotes: [],
      downvotes: [],
    };

    Answer.findById = jest.fn().mockResolvedValueOnce(ans1);
    Answer.findOneAndUpdate = jest.fn().mockResolvedValueOnce(updatedAns);
    User.findOneAndUpdate = jest.fn().mockResolvedValueOnce(updatedUser);

    mockReqBody = {
      aid: "65e9b58910afe6e94fc6e6dc",
      uid: "65e9b5a995b6c7045a30d824",
    };

    // Making the request
    const res = await supertest(server)
      .post("/answer/downvote")
      .send(mockReqBody)
      .set("x-csrf-token", token)
      .set("Cookie", [`connect.sid=${connectSidValue}`]);

    expect(res.status).toBe(200);
    expect(res.body).toStrictEqual(updatedAns);
  });

  it("Removes an upvote, downvotes, and updates reputation when the user has already upvoted", async () => {
    const respToken = await supertest(server).get("/login/csrf-token");
    const token = respToken.body.csrfToken;
    let connectSidValue;
    respToken.headers["set-cookie"].forEach((cookie) => {
      if (cookie.includes("connect.sid")) {
        connectSidValue = cookie.split("=")[1].split(";")[0];
      }
    });

    let updatedUser = {
      _id: "65e9b5a995b6c7045a30d825",
      username: "User1",
      password: "password",
      profile_pic:
        "https://t4.ftcdn.net/jpg/04/10/43/77/360_F_410437733_hdq4Q3QOH9uwh0mcqAhRFzOKfrCR24Ta.jpg",
      reputation: -2,
      join_date: new Date("2023-11-12T03:30:00").toString(),
      askList: [],
      ansList: [],
    };

    let updatedAns = {
      _id: "65e9b58910afe6e94fc6e6dd",
      text: "Answer 2 Text",
      ans_by: "answer2_user",
      upvotes: [],
      downvotes: [updatedUser],
    };

    Answer.findById = jest.fn().mockResolvedValueOnce(ans2);
    Answer.findOneAndUpdate = jest.fn().mockResolvedValueOnce(updatedAns);
    User.findOneAndUpdate = jest.fn().mockResolvedValueOnce(updatedUser);

    mockReqBody = {
      aid: "65e9b58910afe6e94fc6e6dc",
      uid: "65e9b5a995b6c7045a30d825",
    };

    // Making the request
    const res = await supertest(server)
      .post("/answer/downvote")
      .send(mockReqBody)
      .set("x-csrf-token", token)
      .set("Cookie", [`connect.sid=${connectSidValue}`]);

    expect(res.status).toBe(200);
    expect(res.body).toStrictEqual(updatedAns);
  });
});

describe("POST /deleteAnswer", () => {
  it("Deletes an answer", async () => {
    const respToken = await supertest(server).get("/login/csrf-token");
    const token = respToken.body.csrfToken;
    let connectSidValue;
    respToken.headers["set-cookie"].forEach((cookie) => {
      if (cookie.includes("connect.sid")) {
        connectSidValue = cookie.split("=")[1].split(";")[0];
      }
    });

    const answer1 = {
      _id: "65e9b58910afe6e94fc6e6dc",
      text: "Answer 1 Text",
      ans_by: {
        _id: "fakeId",
        ansList: [
          {
            populate: () => Promise.resolve({
              answers: [{ ans_by: "notId" }]
            }),
          },
          {
            populate: () => Promise.resolve({
              answers: [{ ans_by: "fakeId" }]
            }),
          },
        ],
        populate: () => {},
        save: () => {},
      },
      upvotes: [],
      downvotes: [mockUsers[0]],
    };

    Answer.findById = jest.fn().mockImplementation(() => ({
      populate: jest.fn().mockResolvedValueOnce(answer1),
    }));
    Answer.findByIdAndDelete = jest.fn().mockResolvedValueOnce({});

    const res = await supertest(server)
      .post("/answer/deleteAnswer")
      .send(mockReqBody)
      .set("x-csrf-token", token)
      .set("Cookie", [`connect.sid=${connectSidValue}`]);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("Handles erroneous input on deleting an answer", async () => {
    const respToken = await supertest(server).get("/login/csrf-token");
    const token = respToken.body.csrfToken;
    let connectSidValue;
    respToken.headers["set-cookie"].forEach((cookie) => {
      if (cookie.includes("connect.sid")) {
        connectSidValue = cookie.split("=")[1].split(";")[0];
      }
    });

    const answer1 = {
      _id: "65e9b58910afe6e94fc6e6dc",
      text: "Answer 1 Text",
      ans_by: {
        _id: "fakeId",
        ansList: [
        ],
        save: () => {},
      },
      upvotes: [],
      downvotes: [mockUsers[0]],
    };

    Answer.findById = jest.fn().mockImplementation(() => ({
      populate: jest.fn().mockResolvedValueOnce(answer1),
    }));
    Answer.findByIdAndDelete = jest.fn().mockResolvedValueOnce({});

    const res = await supertest(server)
      .post("/answer/deleteAnswer")
      .send(mockReqBody)
      .set("x-csrf-token", token)
      .set("Cookie", [`connect.sid=${connectSidValue}`]);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(false);
  });
});
