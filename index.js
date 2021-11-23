require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    date: "2019-05-30T17:30:31.098Z",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only Javascript",
    date: "2019-05-30T18:39:34.091Z",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2019-05-30T19:20:14.298Z",
    important: true,
  },
];

const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
  return maxId + 1;
};

/////////// MongoDB ///////////////////////////\

const password = process.env.MONGODB_PASS;
const dbName = "note-app";

const url = `mongodb+srv://fullstack:${password}@cluster0.9m5yr.mongodb.net/${dbName}?retryWrites=true&w=majority`;

mongoose.connect(url);

const noteSchema = new mongoose.Schema({
  content: String,
  data: Date,
  important: Boolean,
});

const Note = mongoose.model("Note", noteSchema);

//////////// Middleware ////////////////////////

app.use(express.static("build"));
app.use(cors());
app.use(express.json());
// app.get("/", (request, response) => {
//     console.log("You should see the front end of the app!");
//     response.send("hey!");
// });

////////// Notes API /////////////////////////

app.get("/api/notes", (request, response) => {
  // console.log("requested all the notes");
  response.json(notes);
});

app.get("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  const note = notes.find((n) => n.id === id);
  note ? response.json(note) : response.status(404).end();
});

app.delete("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter((n) => n.id !== id);
  console.log("deleted note ", id);
  response.status(200).send(`deleted note ${1}`);
});

app.post("/api/notes", (request, response) => {
  const body = request.body;
  console.log(body);
  if (!body.content) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const note = {
    content: body.content,
    important: body.important || false,
    date: new Date(),
    id: generateId(),
  };

  notes = notes.concat(note);
  response.json(note);
});

////////////////////////////

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
