const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);

const helper = require("./test_helper");
const bcrypt = require("bcrypt");
const User = require("../models/user");

describe.skip("when there are users in the db", () => {
  // NOTE: may refactor both describe blocks into one at a later point
  test("should retrieve all users as json with status code 200", async () => {
    // TODO
  });
});

describe("when there is initially one user in db", () => {
  beforeEach(async () => {
    await User.deleteMany();
    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({
      username: "root",
      passwordHash: passwordHash,
    });

    await user.save();
  });

  test("shoud create a new user with a fresh username", async () => {
    const usersAtStart = await helper.usersInDB();

    const newUser = {
      username: "jrl",
      name: "jorch",
      password: "katitos",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDB();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });

  test("should fail with status code 400 if username already exists", async () => {
    const usersAtStart = await helper.usersInDB();

    const newUser = {
      username: "root",
      name: "SuperUser",
      password: "anotherpassword",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain("`username` to be unique");
    expect(result.body.errorName).toContain("ValidationError");

    const usersAtEnd = await helper.usersInDB();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
