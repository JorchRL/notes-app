const notesRouter = require("express").Router();
const Note = require("../models/note");
const User = require("../models/user");

/// This is our notes api handled with an express Router

// Get all notes
notesRouter.get("/", async (request, response, next) => {
  const notes = await Note.find({}).catch((e) => next(e));
  response.json(notes);
});

// Save a new note
notesRouter.post("/", async (request, response, next) => {
  const body = request.body;
  const user = await User.findById(body.userId);

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
    user: user._id,
  });

  try {
    const savedNote = await note.save();
    user.notes = user.notes.concat(savedNote._id);
    await user.save();
    response.json(savedNote);
  } catch (exception) {
    next(exception);
  }
});

// Get note by id
notesRouter.get("/:id", async (request, response, next) => {
  try {
    const note = await Note.findById(request.params.id);
    if (note) {
      response.json(note.toJSON());
    } else {
      response.status(404).end();
    }
  } catch (error) {
    next(error);
  }
});

// Update a note by id
notesRouter.put("/:id", (request, response, next) => {
  const body = request.body;
  const note = {
    content: body.content,
    important: body.important,
  };
  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then((updatedNote) => response.json(updatedNote))
    .catch((e) => next(e));
});

// Delete note by id
notesRouter.delete("/:id", async (request, response, next) => {
  try {
    await Note.findByIdAndRemove(request.params.id);
    response.status(204).end();
  } catch (exception) {
    next(exception);
  }
});

module.exports = notesRouter;
