require("dotenv").config();
const mongoose = require("mongoose");

// const password = process.env.MONGODB_PASS;
// const dbName = "note-app";
// const url = `mongodb+srv://fullstack:${password}@cluster0.9m5yr.mongodb.net/${dbName}?retryWrites=true&w=majority`;

const url = process.env.MONGODB_URI;

mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDb", error.message);
  });

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
});

noteSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Note", noteSchema);
