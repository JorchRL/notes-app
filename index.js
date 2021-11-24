require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const Note = require("./models/note");

//////////// MIDDLEWARE //////////////////

app.use(express.static("build"));
app.use(cors());
app.use(express.json());

////////// Notes API /////////////////////////

// Get all notes
app.get("/api/notes", (request, response, next) => {
  // Fetch from MongoDB
  Note.find({})
    .then((notes) => {
      response.json(notes);
    })
    .catch((error) => next(error));
});

// Get note by id
app.get("/api/notes/:id", (request, response, next) => {
  Note.findById(request.params.id)
    .then((note) => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).send();
      }
    })
    .catch((error) => next(error));
});

// Update a note by id
app.put("/api/notes/:id", (request, response, next) => {
  const body = request.body;

  const note = {
    content: body.content,
    important: body.important,
  };

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then((updatedNote) => {
      response.json(updatedNote);
    })
    .catch((error) => next(error));
});

// Delete a note by id
app.delete("/api/notes/:id", (request, response, next) => {
  Note.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

// Save a new note
app.post("/api/notes", (request, response, next) => {
  const body = request.body;

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
    // MongoDB will generate the id automatically
  });

  note
    .save()
    .then((savedNote) => savedNote.toJSON())
    .then((savedAndFormattedNote) => response.json(savedAndFormattedNote))
    .catch((error) => next(error));
});

////////// HANDLING UNKNOWN ENDPOINT //////////////

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

////////// ERROR HANDLING MIDDLEWARE //////////////

const errorHandler = (error, request, response, next) => {
  console.log(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

///////// INIT SERVER ///////////////////////

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
