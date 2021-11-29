const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);

const Note = require("../models/note");
const helper = require("./test_helper");

beforeEach(async () => {
  await Note.deleteMany({});
  await Note.insertMany(helper.initialNotes);
});

//// GET /api/notes
describe("when there is intially some notes saved", () => {
  test("notes are returned as json", async () => {
    await api
      .get("/api/notes")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  }, 100000);

  test("all notes are returned", async () => {
    const response = await api.get("/api/notes");

    expect(response.body).toHaveLength(helper.initialNotes.length);
  });

  test("a specific note is within the returned notes", async () => {
    const response = await api.get("/api/notes");
    const contents = response.body.map((r) => r.content);

    expect(contents).toContain("Browser can execute only JavaScript");
  });
});

///// POST /api/notes
describe("addition of a new note", () => {
  test("succeeds with valid data", async () => {
    const newNote = {
      content: "async/await simplifies making async calls",
      important: true,
    };

    await api
      .post("/api/notes")
      .send(newNote)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const notesAtEnd = await helper.notesInDB();
    expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1);

    const contents = notesAtEnd.map((n) => n.content);
    expect(contents).toContain("async/await simplifies making async calls");
  });

  test("fails with status code 400 if data is invalid", async () => {
    const newNote = {
      important: true,
    };

    await api.post("/api/notes").send(newNote).expect(400);

    const notesAtEnd = await helper.notesInDB();
    expect(notesAtEnd).toHaveLength(helper.initialNotes.length);
  });
});

//// GET /api/notes/:id
describe("viewing a specific note", () => {
  test("succeeds with a valid id", async () => {
    const notesAtStart = await helper.notesInDB();
    const noteToView = notesAtStart[0];

    const resultNote = await api
      .get(`/api/notes/${noteToView.id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const processedNoteToView = JSON.parse(JSON.stringify(noteToView));
    expect(resultNote.body).toEqual(processedNoteToView);
  });

  test("fails with status code 400 if note does not exist", async () => {
    // I currently have no way of determining between a non existing id
    // and an invalid one
    const validNonExistingId = helper.nonExistingId();

    await api.get(`/api/notes/${validNonExistingId}`).expect(400);
  });

  test("fails with status code 400 if id is invalid", async () => {
    const invalidId = "asdfgh";

    await api.get(`/api/notes/${invalidId}`).expect(400);
  });
});

//// DELETE /api/notes/:id
describe("deletion of a note", () => {
  test("succeds with status code 204 if id is valid", async () => {
    const notesAtStart = await helper.notesInDB();
    const noteToDelete = notesAtStart[0];

    await api.delete(`/api/notes/${noteToDelete.id}`).expect(204);

    const notesAtEnd = await helper.notesInDB();

    expect(notesAtEnd).toHaveLength(helper.initialNotes.length - 1);

    const contents = notesAtEnd.map((n) => n.content);
    expect(contents).not.toContain(noteToDelete.content);
  });
});

//// PUT /api/notes/:id

afterAll(() => {
  mongoose.connection.close();
});
