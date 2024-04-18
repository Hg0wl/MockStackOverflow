const supertest = require("supertest");

const User = require("../models/users");

// Mocking the models
jest.mock("../models/users");

let server;

describe("POST /signup", () => {
  beforeEach(() => {
    server = require("../server");
  });

  afterEach(async () => {
    server.close();
});

  it("should create and return a new user when given valid credentials", async () => {
    mockReqBody = { username: "newUser", password: "password" };

    mockUser = {
      username: "newUser",
      password: "password",
    };

    User.create.mockResolvedValueOnce(mockUser);

    const res = await supertest(server)
      .post("/signup/signup")
      .send(mockReqBody);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true)
    expect(res.body.user.password).toBe(mockUser.password);
    expect(res.body.user.username).toBe(mockUser.username);
  });

  it("should not create a new user when given username is already in database", async () => {
    mockReqBody = { username: "oldUser", password: "password" };

    User.create.mockRejectedValue(new Error());

    const res = await supertest(server)
      .post("/signup/signup")
      .send(mockReqBody);

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Invalid credentials");
  });
});
