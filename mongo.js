const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password"
  );
  process.exit(1);
}

const password = process.argv[2];
const dbName = "note-app";

const url = `mongodb+srv://fullstack:${password}@cluster0.9m5yr.mongodb.net/${dbName}?retryWrites=true&w=majority`;

mongoose.connect(url);

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
});

const Note = mongoose.model("Note", noteSchema);

// const note = new Note({
//     content: "React is cool!",
//     date: new Date(),
//     important: true,
// });

// note.save().then((result) => {
//     console.log("note saved!");
//     mongoose.connection.close();
// });

Note.find({}).then((result) => {
  result.forEach((note) => {
    console.log(note);
  });
  mongoose.connection.close();
});
