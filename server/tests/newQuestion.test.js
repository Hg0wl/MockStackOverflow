// unit tests for functions in controller/question.js

const supertest = require("supertest");
const { default: mongoose } = require("mongoose");

const Question = require("../models/questions");
const User = require("../models/users");
const {
  addTag,
  getQuestionsByOrder,
  filterQuestionsBySearch,
} = require("../utils/question");

// Mocking the models
jest.mock("../models/questions");
jest.mock("../models/users");
jest.mock("../utils/question", () => ({
  addTag: jest.fn(),
  getQuestionsByOrder: jest.fn(),
  filterQuestionsBySearch: jest.fn(),
}));

let server;

const tag1 = {
  _id: "507f191e810c19729de860ea",
  name: "tag1",
};
const tag2 = {
  _id: "65e9a5c2b26199dbcc3e6dc8",
  name: "tag2",
};

const ans1 = {
  _id: "65e9b58910afe6e94fc6e6dc",
  text: "Answer 1 Text",
  ans_by: "answer1_user",
};

const ans2 = {
  _id: "65e9b58910afe6e94fc6e6dd",
  text: "Answer 2 Text",
  ans_by: "answer2_user",
};

const mockQuestions = [
  {
    _id: "65e9b58910afe6e94fc6e6dc",
    title: "Question 1 Title",
    text: "Question 1 Text",
    tags: [tag1],
    answers: [ans1],
    views: 21,
  },
  {
    _id: "65e9b5a995b6c7045a30d823",
    title: "Question 2 Title",
    text: "Question 2 Text",
    tags: [tag2],
    answers: [ans2],
    views: 99,
  },
];

describe("GET /getQuestion", () => {
  beforeEach(() => {
    server = require("../server");
  });

  afterEach(async () => {
    server.close();
  });

  it("should return questions by filter", async () => {
    // Mock request query parameters
    const mockReqQuery = {
      order: "someOrder",
      search: "someSearch",
    };

    getQuestionsByOrder.mockResolvedValueOnce(mockQuestions);
    filterQuestionsBySearch.mockReturnValueOnce(mockQuestions);

    const respToken = await supertest(server).get("/login/csrf-token");
    const token = respToken.body.csrfToken;

    let connectSidValue = null;
    respToken.headers["set-cookie"].forEach((cookie) => {
      if (cookie.includes("connect.sid")) {
        connectSidValue = cookie.split("=")[1].split(";")[0];
      }
    });

    // Making the request
    const response = await supertest(server)
      .get("/question/getQuestion")
      .query(mockReqQuery)
      .set("x-csrf-token", token)
      .set("Cookie", [`connect.sid=${connectSidValue}`]);

    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockQuestions);
  });
});

describe("GET /getQuestionById/:qid", () => {
  beforeEach(() => {
    server = require("../server");
  });

  afterEach(async () => {
    server.close();
  });

  it("should return a question by id and increment its views by 1", async () => {
    // Mock request parameters
    const mockReqParams = {
      qid: "65e9b58910afe6e94fc6e6dc",
    };

    const mockPopulatedQuestion = {
      _id: mockQuestions[0]._id,
      answers: mockQuestions[0].answers, // Mock answers
      title: mockQuestions[0].title,
      text: mockQuestions[0].text,
      views: mockQuestions[0].views - 1,
      tags: mockQuestions[0].tags,
      save: jest.fn(() => {
        return;
      }),
    };

    const save = jest.fn();

    // Provide mock question data
    Question.findById = jest.fn().mockImplementation(() => ({
      populate: jest.fn().mockImplementation(() => ({
        populate: jest.fn().mockImplementation(() => ({
          populate: jest.fn().mockResolvedValue(mockPopulatedQuestion),
        })),
      })),
    }));

    const respToken = await supertest(server).get("/login/csrf-token");
    const token = respToken.body.csrfToken;

    let connectSidValue = null;
    respToken.headers["set-cookie"].forEach((cookie) => {
      if (cookie.includes("connect.sid")) {
        connectSidValue = cookie.split("=")[1].split(";")[0];
      }
    });

    // Making the request
    const response = await supertest(server)
      .get(`/question/getQuestionById/${mockReqParams.qid}`)
      .set("x-csrf-token", token)
      .set("Cookie", [`connect.sid=${connectSidValue}`]);

    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockQuestions[0]);
  });
});

describe("POST /addQuestion", () => {
  beforeEach(() => {
    server = require("../server");
  });

  afterEach(async () => {
    server.close();
  });

  it("should add a new question", async () => {
    // Mock request body

    const mockTags = [tag1, tag2];

    const mockQuestion = {
      _id: "65e9b58910afe6e94fc6e6fe",
      title: "Question 3 Title",
      text: "Question 3 Text",
      tags: mockTags,
      answers: [ans1],
      asked_by: { username: "testUser" },
    };

    addTag.mockResolvedValueOnce(mockTags);
    Question.create.mockResolvedValueOnce(mockQuestion);
    User.findOneAndUpdate = jest.fn();

    const respToken = await supertest(server).get("/login/csrf-token");
    const token = respToken.body.csrfToken;

    let connectSidValue = null;
    respToken.headers["set-cookie"].forEach((cookie) => {
      if (cookie.includes("connect.sid")) {
        connectSidValue = cookie.split("=")[1].split(";")[0];
      }
    });

    // Making the request
    const response = await supertest(server)
      .post("/question/addQuestion")
      .send(mockQuestion)
      .set("x-csrf-token", token)
      .set("Cookie", [`connect.sid=${connectSidValue}`]);

    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockQuestion);
  });
});

const mockUsers = [
  "65e9b5a995b6c7045a30d824",
  "65e9b5a995b6c7045a30d825",
  "65e9b5a995b6c7045a30d826",
];

const q1 = {
  _id: "65e9b58910afe6e94fc6e6dc",
  text: "Answer 1 Text",
  asked_by: "answer1_user",
  upvotes: [],
  downvotes: [mockUsers[0]],
};

const q2 = {
  _id: "65e9b58910afe6e94fc6e6dd",
  text: "Answer 2 Text",
  asked_by: "answer2_user",
  upvotes: [mockUsers[1]],
  downvotes: [],
};

const q3 = {
  _id: "65e9b58910afe6e94fc6e6df",
  text: "Answer 3 Text",
  asked_by: "answer3_user",
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
      asked_by: "answer3_user",
      upvotes: [updatedUser],
      downvotes: [],
    };

    Question.findById = jest.fn().mockResolvedValueOnce(q3);
    Question.findOneAndUpdate = jest.fn().mockResolvedValueOnce(updatedAns);
    User.findOneAndUpdate = jest.fn().mockResolvedValueOnce(updatedUser);

    mockReqBody = {
      aid: "65e9b58910afe6e94fc6e6dc",
      uid: "65e9b5a995b6c7045a30d824",
    };

    // Making the request
    const res = await supertest(server)
      .post("/question/upvote")
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
      asked_by: "answer2_user",
      upvotes: [],
      downvotes: [],
    };

    Question.findById = jest.fn().mockResolvedValueOnce(q2);
    Question.findOneAndUpdate = jest.fn().mockResolvedValueOnce(updatedAns);
    User.findOneAndUpdate = jest.fn().mockResolvedValueOnce(updatedUser);

    mockReqBody = {
      aid: "65e9b58910afe6e94fc6e6dd",
      uid: "65e9b5a995b6c7045a30d825",
    };

    // Making the request
    const res = await supertest(server)
      .post("/question/upvote")
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
      asked_by: "answer1_user",
      upvotes: [updatedUser],
      downvotes: [],
    };

    Question.findById = jest.fn().mockResolvedValueOnce(q1);
    Question.findOneAndUpdate = jest.fn().mockResolvedValueOnce(updatedAns);
    User.findOneAndUpdate = jest.fn().mockResolvedValueOnce(updatedUser);

    mockReqBody = {
      aid: "65e9b58910afe6e94fc6e6dc",
      uid: "65e9b5a995b6c7045a30d824",
    };

    // Making the request
    const res = await supertest(server)
      .post("/question/upvote")
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
      asked_by: "answer3_user",
      upvotes: [],
      downvotes: [updatedUser],
    };

    Question.findById = jest.fn().mockResolvedValueOnce(q3);
    Question.findOneAndUpdate = jest.fn().mockResolvedValueOnce(updatedAns);
    User.findOneAndUpdate = jest.fn().mockResolvedValueOnce(updatedUser);

    mockReqBody = {
      aid: "65e9b58910afe6e94fc6e6dc",
      uid: "65e9b5a995b6c7045a30d824",
    };

    // Making the request
    const res = await supertest(server)
      .post("/question/downvote")
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
      asked_by: "answer1_user",
      upvotes: [],
      downvotes: [],
    };

    Question.findById = jest.fn().mockResolvedValueOnce(q1);
    Question.findOneAndUpdate = jest.fn().mockResolvedValueOnce(updatedAns);
    User.findOneAndUpdate = jest.fn().mockResolvedValueOnce(updatedUser);

    mockReqBody = {
      aid: "65e9b58910afe6e94fc6e6dc",
      uid: "65e9b5a995b6c7045a30d824",
    };

    // Making the request
    const res = await supertest(server)
      .post("/question/downvote")
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
      asked_by: "answer2_user",
      upvotes: [],
      downvotes: [updatedUser],
    };

    Question.findById = jest.fn().mockResolvedValueOnce(q2);
    Question.findOneAndUpdate = jest.fn().mockResolvedValueOnce(updatedAns);
    User.findOneAndUpdate = jest.fn().mockResolvedValueOnce(updatedUser);

    mockReqBody = {
      aid: "65e9b58910afe6e94fc6e6dc",
      uid: "65e9b5a995b6c7045a30d825",
    };

    // Making the request
    const res = await supertest(server)
      .post("/question/downvote")
      .send(mockReqBody)
      .set("x-csrf-token", token)
      .set("Cookie", [`connect.sid=${connectSidValue}`]);

    expect(res.status).toBe(200);
    expect(res.body).toStrictEqual(updatedAns);
  });
});

describe("POST /deleteQuestion", () => {
  it("Deletes a question when given it's _id", async () => {
    const respToken = await supertest(server).get("/login/csrf-token");
    const token = respToken.body.csrfToken;
    let connectSidValue;
    respToken.headers["set-cookie"].forEach((cookie) => {
      if (cookie.includes("connect.sid")) {
        connectSidValue = cookie.split("=")[1].split(";")[0];
      }
    });

    Question.findByIdAndDelete = jest.fn().mockImplementation(() => {});
    mockReqBody = { uid: "id" };

    const res = await supertest(server)
      .post("/question/deleteQuestion")
      .send(mockReqBody)
      .set("x-csrf-token", token)
      .set("Cookie", [`connect.sid=${connectSidValue}`]);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("Handles exceptions that occur during deletion", async () => {
    const respToken = await supertest(server).get("/login/csrf-token");
    const token = respToken.body.csrfToken;
    let connectSidValue;
    respToken.headers["set-cookie"].forEach((cookie) => {
      if (cookie.includes("connect.sid")) {
        connectSidValue = cookie.split("=")[1].split(";")[0];
      }
    });

    Question.findByIdAndDelete = jest.fn().mockRejectedValue(new Error());
    mockReqBody = { uid: "id" };

    const res = await supertest(server)
      .post("/question/deleteQuestion")
      .send(mockReqBody)
      .set("x-csrf-token", token)
      .set("Cookie", [`connect.sid=${connectSidValue}`]);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(false);
  });
});

describe("POST /removeTag", () => {
  it("removes the tag with the given id from the question", async () => {
    const respToken = await supertest(server).get("/login/csrf-token");
    const token = respToken.body.csrfToken;
    let connectSidValue;
    respToken.headers["set-cookie"].forEach((cookie) => {
      if (cookie.includes("connect.sid")) {
        connectSidValue = cookie.split("=")[1].split(";")[0];
      }
    });

    Question.findOneAndUpdate = jest.fn().mockImplementation(() => ({
      populate: jest.fn().mockResolvedValue({
        _id: "65e9b58910afe6e94fc6e6dc",
        title: "Question 1 Title",
        text: "Question 1 Text",
        tags: [],
        answers: [ans1],
        views: 21,
      }),
    }));

    mockReqBody = {
      tid: tag1._id,
      qid: "65e9b58910afe6e94fc6e6dc",
    };

    const res = await supertest(server)
      .post("/question/removeTag")
      .send(mockReqBody)
      .set("x-csrf-token", token)
      .set("Cookie", [`connect.sid=${connectSidValue}`]);

    expect(res.status).toBe(200);
    expect(res.body).toStrictEqual({ success: true, tags: [] });
  });

  it ("Handles romoving tags when given erroneous inputs", async () => {
    const respToken = await supertest(server).get("/login/csrf-token");
    const token = respToken.body.csrfToken;
    let connectSidValue;
    respToken.headers["set-cookie"].forEach((cookie) => {
      if (cookie.includes("connect.sid")) {
        connectSidValue = cookie.split("=")[1].split(";")[0];
      }
    });

    Question.findOneAndUpdate = jest.fn().mockImplementation(() => {return new Error()})

    mockReqBody = {
      tid: tag1._id,
      qid: "65e9b58910afe6e94fc6e6dc",
    };

    const res = await supertest(server)
      .post("/question/removeTag")
      .send(mockReqBody)
      .set("x-csrf-token", token)
      .set("Cookie", [`connect.sid=${connectSidValue}`]);

    expect(res.status).toBe(200);
    expect(res.body).toStrictEqual({ success: false});
  })
});

describe("POST /addTag", () => {
  it ("Adds the given tags to the given question", async () => {
    const respToken = await supertest(server).get("/login/csrf-token");
    const token = respToken.body.csrfToken;
    let connectSidValue;
    respToken.headers["set-cookie"].forEach((cookie) => {
      if (cookie.includes("connect.sid")) {
        connectSidValue = cookie.split("=")[1].split(";")[0];
      }
    });

    Question.findOneAndUpdate = jest.fn().mockImplementation(() => ({
      populate: jest.fn().mockResolvedValue({
        _id: "65e9b58910afe6e94fc6e6dc",
        title: "Question 1 Title",
        text: "Question 1 Text",
        tags: [tag1, tag2],
        answers: [ans1],
        views: 21,
      }),
    }));

    const mockReqBody = {
      tags: [tag2],
      qid: "65e9b58910afe6e94fc6e6dc",
    };

    const res = await supertest(server)
      .post("/question/addTags")
      .send(mockReqBody)
      .set("x-csrf-token", token)
      .set("Cookie", [`connect.sid=${connectSidValue}`]);

    expect(res.status).toBe(200);
    expect(res.body).toStrictEqual({ success: true, tags: [tag1, tag2] });
  })

  it("Hadles errors in addTags input", async () => {
    const respToken = await supertest(server).get("/login/csrf-token");
    const token = respToken.body.csrfToken;
    let connectSidValue;
    respToken.headers["set-cookie"].forEach((cookie) => {
      if (cookie.includes("connect.sid")) {
        connectSidValue = cookie.split("=")[1].split(";")[0];
      }
    });

    Question.findOneAndUpdate = jest.fn().mockImplementation(() => {new Error()});

    const mockReqBody = {
      tags: [tag2],
      qid: "65e9b58910afe6e94fc6e6dc",
    };

    const res = await supertest(server)
      .post("/question/addTags")
      .send(mockReqBody)
      .set("x-csrf-token", token)
      .set("Cookie", [`connect.sid=${connectSidValue}`]);

    expect(res.status).toBe(200);
    expect(res.body).toStrictEqual({ success: false });
  });
})