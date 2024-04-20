const supertest = require("supertest");

const User = require("../models/users");

// Mocking the models
jest.mock("../models/users");

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

const mockUsers = [
  {
    _id: "65e9b5a995b6c7045a30d824",
    username: "User1",
    password: "password",
    profile_pic:
      "https://t4.ftcdn.net/jpg/04/10/43/77/360_F_410437733_hdq4Q3QOH9uwh0mcqAhRFzOKfrCR24Ta.jpg",
    reputation: 100,
    join_date: new Date("2023-11-12T03:30:00").toString(),
    askList: [mockQuestions[0]],
    ansList: [ans1],
  },
  {
    _id: "65e9b5a995b6c7045a30d825",
    username: "User2",
    password: "password",
    profile_pic:
      "https://t4.ftcdn.net/jpg/04/10/43/77/360_F_410437733_hdq4Q3QOH9uwh0mcqAhRFzOKfrCR24Ta.jpg",
    reputation: 150,
    join_date: new Date("2023-11-12T03:30:00").toString(),
    askList: [mockQuestions[1]],
    ansList: [ans2],
  },
  {
    _id: "65e9b5a995b6c7045a30d826",
    username: "User3",
    password: "password",
    profile_pic:
      "https://t4.ftcdn.net/jpg/04/10/43/77/360_F_410437733_hdq4Q3QOH9uwh0mcqAhRFzOKfrCR24Ta.jpg",
    reputation: 250,
    join_date: new Date("2023-11-12T03:30:00").toString(),
    askList: [],
    ansList: [],
  },
];

describe("GET /getUserById:uid", () => {
  beforeEach(() => {
    server = require("../server");
  });

  afterEach(async () => {
    server.close();
  });

  it("should return a user by id", async () => {
    const mockReqParams = { uid: "65e9b5a995b6c7045a30d826" };

    User.findById = jest.fn().mockImplementation(() => ({
      populate: jest.fn().mockImplementation(() => ({
        populate: jest.fn().mockResolvedValue(mockUsers[0]),
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

    const response = await supertest(server)
      .get(`/user/getUserById/${mockReqParams.uid}`)
      .set("x-csrf-token", token)
      .set("Cookie", [`connect.sid=${connectSidValue}`]);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUsers[0]);
  });
});

describe("POST /changeUsername", () => {
  beforeEach(() => {
    server = require("../server");
  });

  afterEach(async () => {
    server.close();
  });

  it("should successfully updated username", async () => {
    const mockReqQuery = {
      username: "brandNewUsername",
      uid: "65e9b5a995b6c7045a30d825",
    };

    const updatedUser = {
      _id: "65e9b5a995b6c7045a30d825",
      username: "brandNewUsername",
      password: "password",
      profile_pic:
        "https://t4.ftcdn.net/jpg/04/10/43/77/360_F_410437733_hdq4Q3QOH9uwh0mcqAhRFzOKfrCR24Ta.jpg",
      reputation: 150,
      join_date: new Date("2023-11-12T03:30:00").toString(),
      askList: [mockQuestions[1]],
      ansList: [ans2],
    };

    User.find = jest
      .fn()
      .mockResolvedValue(
        mockUsers.filter((user) => user.username == mockReqQuery.username)
      );
    User.findOneAndUpdate = jest.fn().mockResolvedValue(updatedUser);

    const respToken = await supertest(server).get("/login/csrf-token");
    const token = respToken.body.csrfToken;

    let connectSidValue = null;
    respToken.headers["set-cookie"].forEach((cookie) => {
      if (cookie.includes("connect.sid")) {
        connectSidValue = cookie.split("=")[1].split(";")[0];
      }
    });

    const response = await supertest(server)
      .post(`/user/changeUsername`)
      .send(mockReqQuery)
      .set("x-csrf-token", token)
      .set("Cookie", [`connect.sid=${connectSidValue}`]);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it("should reject the request to update username when username already exists", async () => {
    const mockReqQuery = {
      username: "User3",
      uid: "65e9b5a995b6c7045a30d825",
    };

    User.find = jest
      .fn()
      .mockResolvedValue(
        mockUsers.filter((user) => user.username == mockReqQuery.username)
      );

    const respToken = await supertest(server).get("/login/csrf-token");
    const token = respToken.body.csrfToken;

    let connectSidValue = null;
    respToken.headers["set-cookie"].forEach((cookie) => {
      if (cookie.includes("connect.sid")) {
        connectSidValue = cookie.split("=")[1].split(";")[0];
      }
    });

    const response = await supertest(server)
      .post(`/user/changeUsername`)
      .send(mockReqQuery)
      .set("x-csrf-token", token)
      .set("Cookie", [`connect.sid=${connectSidValue}`]);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe(
      "A user with this username already exists"
    );
  });
});

describe("POST /changeProfilePicture", () => {
  it("should successfully update the user's profile picture", async () => {
    const mockReqQuery = {
      link: "newlink.com",
      uid: "65e9b5a995b6c7045a30d826",
    };

    const updatedUser = {
      _id: "65e9b5a995b6c7045a30d826",
      username: "User3",
      password: "password",
      profile_pic: "newlink.com",
      reputation: 250,
      join_date: new Date("2023-11-12T03:30:00").toString(),
      askList: [],
      ansList: [],
    };

    User.findOneAndUpdate = jest.fn().mockResolvedValue(updatedUser);

    const respToken = await supertest(server).get("/login/csrf-token");
    const token = respToken.body.csrfToken;

    let connectSidValue = null;
    respToken.headers["set-cookie"].forEach((cookie) => {
      if (cookie.includes("connect.sid")) {
        connectSidValue = cookie.split("=")[1].split(";")[0];
      }
    });

    const res = await supertest(server)
      .post("/user/changeProfilePicture")
      .send(mockReqQuery)
      .set("x-csrf-token", token)
      .set("Cookie", [`connect.sid=${connectSidValue}`]);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.link).toBe("newlink.com");
  });

  it("should handle errors in updating the user's profile", async () => {
    const mockReqQuery = {
      link: "newlink.com",
      uid: "65e9b5a995b6c7045a30d826",
    };

    User.findOneAndUpdate = jest.fn().mockRejectedValue(new Error());

    const respToken = await supertest(server).get("/login/csrf-token");
    const token = respToken.body.csrfToken;

    let connectSidValue = null;
    respToken.headers["set-cookie"].forEach((cookie) => {
      if (cookie.includes("connect.sid")) {
        connectSidValue = cookie.split("=")[1].split(";")[0];
      }
    });

    const res = await supertest(server)
      .post("/user/changeProfilePicture")
      .send(mockReqQuery)
      .set("x-csrf-token", token)
      .set("Cookie", [`connect.sid=${connectSidValue}`]);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(false);
  });
});
