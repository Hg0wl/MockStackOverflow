const supertest = require("supertest");

const User = require("../models/users");

// Mocking the models
jest.mock("../models/users");

let server;

describe("POST /login", () => {
  beforeEach(() => {
    server = require("../server");
  });

  afterEach(async () => {
    server.close();
  });

  it("providing correct username and password login", async () => {
    // Creating a csrf token
    const respToken = await supertest(server).get("/login/csrf-token");
    const token = respToken.body.csrfToken;
    let connectSidValue;
    respToken.headers["set-cookie"].forEach((cookie) => {
      if (cookie.includes("connect.sid")) {
        connectSidValue = cookie.split("=")[1].split(";")[0];
      }
    });

    // Mocking the data / methods
    const mockUser = {
      username: "testUser",
      password: "1234",
    };

    const mockReqBody = {
      username: "testUser",
      password: "1234",
    };

    User.findOne = jest.fn().mockResolvedValueOnce(mockUser);

    // Making the request
    const res = await supertest(server)
      .post("/login/login")
      .query(mockReqBody)
      .set("x-csrf-token", token)
      .set("Cookie", [`connect.sid=${connectSidValue}`]);

    // Asserting the response
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("providing incorrect username and password", async () => {
    // Creating a csrf token
    const respToken = await supertest(server).get("/login/csrf-token");
    const token = respToken.body.csrfToken;
    let connectSidValue;
    respToken.headers["set-cookie"].forEach((cookie) => {
      if (cookie.includes("connect.sid")) {
        connectSidValue = cookie.split("=")[1].split(";")[0];
      }
    });

    // Mocking the data / methods
    const mockUser = {
      username: "testUser",
      password: "1234",
    };

    const mockReqBody = {
      username: "testUser",
      password: "1234",
    };

    User.findOne = jest.fn().mockResolvedValueOnce(null);

    // Making the request
    const res = await supertest(server)
      .post("/login/login")
      .query(mockReqBody)
      .set("x-csrf-token", token)
      .set("Cookie", [`connect.sid=${connectSidValue}`]);

    // Asserting the response
    expect(res.status).toBe(401);
    expect(res.body).toStrictEqual({
      success: false,
      message: "Invalid credentials",
    });
  });
});

describe("POST /logout", () => {
  it("Destroys the current session and logs the user out", async () => {
    const respToken = await supertest(server).get("/login/csrf-token");
    const token = respToken.body.csrfToken;
    let connectSidValue;
    respToken.headers["set-cookie"].forEach((cookie) => {
      if (cookie.includes("connect.sid")) {
        connectSidValue = cookie.split("=")[1].split(";")[0];
      }
    });

    const res = await supertest(server)
      .post("/login/logout")
      .set("x-csrf-token", token)
      .set("Cookie", [`connect.sid=${connectSidValue}`]);
    expect(res.status).toBe(200);
  });
});

describe("POST /csrf-token", () => {
  it("Gets a crsf-token from the server", async () => {
    const respToken = await supertest(server).get("/login/csrf-token");
    const token = respToken.body.csrfToken;
    let connectSidValue;
    respToken.headers["set-cookie"].forEach((cookie) => {
      if (cookie.includes("connect.sid")) {
        connectSidValue = cookie.split("=")[1].split(";")[0];
      }
    });

    const res = await supertest(server)
      .get("/login/csrf-token")
      .set("x-csrf-token", token)
      .set("Cookie", [`connect.sid=${connectSidValue}`]);
    
      expect(res.status).toBe(200);
  });
});
