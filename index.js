require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const Note = require("./models/note");

// let notes = [
//   {
//     id: 1,
//     content: "HTML is easy",
//     date: "2019-05-30T17:30:31.098Z",
//     important: true,
//   },
//   {
//     id: 2,
//     content: "Browser can execute only Javascript",
//     date: "2019-05-30T18:39:34.091Z",
//     important: false,
//   },
//   {
//     id: 3,
//     content: "GET and POST are the most important methods of HTTP protocol",
//     date: "2019-05-30T19:20:14.298Z",
//     important: true,
//   },
// ];

//////////// MIDDLEWARE //////////////////

const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
  return maxId + 1;
};

app.use(express.static("build"));
app.use(cors());
app.use(express.json());
// app.get("/", (request, response) => {
//     console.log("You should see the front end of the app!");
//     response.send("hey!");
// });

////////// Notes API /////////////////////////

// Get all notes
app.get("/api/notes", (request, response) => {
  // Fetch from MongoDB
  Note.find({}).then((notes) => {
    response.json(notes);
  });
});

// Get note by id
app.get("/api/notes/:id", (request, response) => {
  // const id = request.params.id;
  // Note.find({}).then((notes) => {
  //   // The _id field is an object; we need to compare the toString() version
  //   const note = notes.find((n) => n.id.toString() === id);
  //   note ? response.json(note) : response.status(404).end();
  // });

  Note.findById(request.params.id)
    .then((note) => {
      response.json(note);
    })
    .catch((error) => {
      // console.log("Error fetching note", error.message);
      response.status(404).end();
    });
});

// Delete a note by id
app.delete("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter((n) => n.id !== id);
  console.log("deleted note ", id);
  response.status(200).send(`deleted note ${1}`);
});

// Save a new note
app.post("/api/notes", (request, response) => {
  const body = request.body;
  console.log(body);
  if (!body.content) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
    // MongoDB will generate the id automatically
  });

  note.save().then((savedNote) => {
    response.json(savedNote);
  });
});

////////////////////////////

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
