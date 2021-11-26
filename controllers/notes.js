const notesRouter = require("express").Router();
const Note = require("../models/note");

/// This is our notes api handled with an express Router

// Get all notes
notesRouter.get("/", (request, response, next) => {
  // console.log("Requested all notes");
  Note.find({})
    .then((notes) => {
      response.json(notes);
    })
    .catch((e) => next(e));
});

// Save a new note
notesRouter.post("/", (request, response, next) => {
  const body = request.body;
  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  });

  note
    .save()
    .then((savedNote) => savedNote.toJSON())
    .then((formattedNote) => response.json(formattedNote))
    .catch((e) => next(e));
});

// Get note by id
notesRouter.get("/:id", (request, response, next) => {
  Note.findById(request.params.id)
    .then((note) => (note ? response.json(note) : response.status(404).send()))
    .catch((e) => next(e));
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
notesRouter.delete("/:id", (request, response, next) => {
  Note.findByIdAndRemove(request.params.id)
    .then((result) => response.status(204).end())
    .catch((e) => next(e));
});

module.exports = notesRouter;
