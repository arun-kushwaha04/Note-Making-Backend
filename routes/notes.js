const express = require('express');
const { verifyToken } = require('../middlewares/tokenVerifier');
const { addNotes, getUserNotes, updateNote, deleteNote, getNoteWithId } = require('../controller/notes');
const router = express.Router();

router.post('/addNotes', verifyToken, addNotes);
router.get('/getNotes', verifyToken, getUserNotes);
router.post('/getNoteWithId', verifyToken, getNoteWithId);
router.put('/updateNote', verifyToken, updateNote);
router.delete('/deleteNote', verifyToken, deleteNote);


module.exports = router;