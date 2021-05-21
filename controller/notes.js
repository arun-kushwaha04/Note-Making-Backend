const client = require('../configs/db');

exports.addNotes = (req, res) => {
    const { noteHeading, noteContent } = req.body;
    client.query(`INSERT INTO notes (email, noteHeading ,noteContent) VALUES ('${req.email}', '{${noteHeading}}', '{${noteContent}}');`, (err) => {
        if (err) {
            console.log(err.message);
            res.status(500).json({
                message: "Internal Server Error",
            });
        } else {
            res.status(200).json({
                message: "Note Added To Server Successfully",
            });
        }
    });
}

exports.getUserNotes = (req, res) => {
    client.query(`SELECT * FROM notes WHERE email = '${req.email}'`, (err, notes) => {
        if (err) {
            console.log(err.message);
            res.status(500).json({
                message: "Internal Server Error",
            });
        } else {
            const data = notes.rows.map((note) => {
                return {
                    id: note.id,
                    noteHeading: note.noteheading,
                    noteContent: note.notecontent,
                }
            });
            res.status(200).json({
                message: "Note Reterived Successfully",
                name: `${req.name}`,
                notes: data,
            });
        }
    });
}

exports.getNoteWithId = (req, res) => {
    client.query(`SELECT * FROM notes WHERE id = '${req.body.id}'`, (err, notes) => {
        if (err) {
            console.log(err.message);
            res.status(500).json({
                message: "Internal Server Error",
            });
        } else {
            const data = notes.rows.map((note) => {
                if (note.email == req.email) {
                    return {
                        id: note.id,
                        noteHeading: note.noteheading,
                        noteContent: note.notecontent,
                    }
                }
            });
            res.status(200).json({
                message: "Note Reterived Successfully",
                name: `${req.name}`,
                notes: data,
            });
        }
    });
}

exports.updateNote = (req, res) => {
    const id = req.body.id;
    const noteHeading = req.body.noteHeading;
    const noteContent = req.body.noteContent;

    client.query(`UPDATE notes SET noteHeading = '{${noteHeading}}', noteContent = '{${noteContent}}' WHERE id = ${id}`, err => {
        if (err) {
            console.log(err.message);
            res.status(500).json({
                message: "Internal Server Error",
            });
        } else {
            res.status(200).json({
                message: "Note Updated Successfully",
            });
        }
    });
}

exports.deleteNote = (req, res) => {
    const id = req.body.id;
    client.query(`SELECT * FROM notes WHERE id = ${id};`, (err, data) => {
        if (err) {
            console.log(err.message);
            res.status(500).json({
                message: "Internal Server Error",
            });
        } else {
            if (data.rows[0].email === req.email) {
                client.query(`DELETE FROM notes WHERE id = ${id};`, err => {
                    if (err) {
                        console.log(err.message);
                        res.status(500).json({
                            message: "Internal Server Error",
                        });
                    } else {
                        res.status(200).json({
                            message: "Note Deleted Successfully",
                        });
                    }
                });
            } else {
                res.status(400).json({
                    message: "Not Authorized To Delete Note.",
                });
            }

        }
    });
}