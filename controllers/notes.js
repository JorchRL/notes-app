const notesRouter = require("express").Router();
const config = require("../utils/config");
const jwt = require("jsonwebtoken");

const Note = require("../models/note");
const User = require("../models/user");

/// This is our notes api handled with an express Router

// Get all notes
notesRouter.get("/", async (request, response, next) => {
  try {
    const notes = await Note.find({}).populate("user", {
      username: 1,
      name: 1,
    });
    response.json(notes);
  } catch (error) {
    next(error);
  }
});

// Save a new note
//Helper function for token authorization (TODO: Move this into its own module)
const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer")) {
    // return authorization.substring(7)
    return authorization.split(" ")[1];
  }
  return null;
};

notesRouter.post("/", async (request, response, next) => {
  const body = request.body;

  const token = getTokenFrom(request);
  if (!token) {
    return response.status(401).json({ error: "token missing" });
  }

  // assume that if there is a token present, it is correctly formatted...
  let decodedToken;

  try {
    decodedToken = jwt.verify(token, config.JWT_SECRET);
  } catch (error) {
    next(error);
    return response.end();
  }

  if (!decodedToken.id) {
    return response.status(401).json({ error: "token is invalid" });
  }

  const user = await User.findById(decodedToken.id);

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
