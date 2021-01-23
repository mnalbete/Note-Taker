var express = require("express");
var path = require("path");
const fs = require("fs");
const { nanoid } = require("nanoid");

var app = express();

var PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/api/notes", function (req, res) {
    fs.readFile(__dirname + "/db/db.json", "UTF8", (err, data) => {
        if (err) throw error;

        let databaseNotes = JSON.parse(data);
        return res.json(databaseNotes);
    })
})

app.post("/api/notes", function (req, res) {
    const newNote = {
        title: req.body.title,
        text: req.body.text,
        id: nanoid(),
    };

    fs.readFile(__dirname + "/db/db.json", "utf8", (err, data) => {
        if (err) throw error;

        let allNotes = [JSON.parse(data)];
        allNotes.push(newNote);
        console.log(allNotes);
        fs.writeFileSync(__dirname + "/db/db.json", JSON.stringify(allNotes));
        res.json(allNotes);
    })
});

app.delete("/api/notes/:id", function (req, res) {

    let noteArray = [];
    let newDataList = JSON.parse(fs.readFileSync(__dirname + "/db/db.json"))
    noteArray = newDataList;

    const noteId = req.params.id;
    console.log(noteId);
    noteArray = noteArray.filter(({ id }) => id !== noteId)

    fs.writeFileSync(__dirname + "/db/db.json", JSON.stringify(noteArray));
    res.json(noteArray);

});

app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("*", function (req, res) {
    res.sendFile(__dirname, "public/index.html");
});

app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});