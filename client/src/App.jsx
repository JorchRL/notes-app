import React, { useState, useEffect } from "react";
import Note from "./components/Note";
import Notification from "./components/Notification";
import Footer from "./components/Footer";
import noteService from "./services/notes";
import "./index.css";

const App = () => {
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState("");
    const [showAll, setShowAll] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    //// Handle server-side data

    useEffect(() => {
        noteService.getAll().then((initialNotes) => {
            setNotes(initialNotes);
        });
    }, []);

    const addNote = (event) => {
        event.preventDefault();

        const noteObject = {
            content: newNote,
            date: new Date().toISOString(),
            important: Math.random() < 0.5,
            // we will let the server generate the id for this item
        };

        // axios.post("http://localhost:3001/notes", noteObject)

        noteService.create(noteObject).then((changedNote) => {
            setNotes(notes.concat(changedNote));
            setNewNote("");
        });

        // Reset the value in the text input area
        event.target[0].value = "";
    };

    const toggleImportanceOf = (id) => {
        const note = notes.find((n) => n.id === id);
        const changedNote = { ...note, important: !note.important };

        noteService
            .update(id, changedNote)
            .then((returnedNote) => {
                setNotes(notes.map((note) => (note.id === id ? returnedNote : note)));
            })
            .catch((error) => {
                setErrorMessage(`The note '${note.content}' was already removed from server!`);
                setTimeout(() => {
                    setErrorMessage(null);
                }, 5000);
                setNotes(notes.filter((n) => n.id !== id));
            });
    };

    /// Handle internal State
    const handleNoteChange = (event) => {
        // console.log(event.target.value);
        setNewNote(event.target.value);
    };

    // console.log("notes: ", notes);
    const notesToShow = showAll ? notes : notes.filter((note) => note.important);

    /// JSX
    return (
        <div>
            <h1>Notes</h1>
            <Notification message={errorMessage} />
            <div>
                <button onClick={() => setShowAll(!showAll)}>show {showAll ? "important" : "all"}</button>
            </div>
            <ul>
                {notesToShow.map((note, i) => (
                    <Note key={note.id} note={note} toggleImportance={() => toggleImportanceOf(note.id)} />
                ))}
            </ul>
            <hr />
            <form onSubmit={addNote}>
                <input onChange={handleNoteChange} placeholder={"Add a new note here..."} />
                <button type='submit' disabled={newNote.length <= 0}>
                    Add Note
                </button>
            </form>
            <Footer />
        </div>
    );
};

export default App;
