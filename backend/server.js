
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Conectar a la base de datos
mongoose.connect('mongodb://localhost/notepad', { useNewUrlParser: true, useUnifiedTopology: true });

const NoteSchema = new mongoose.Schema({
    content: String,
    created_at: Date,
    category: String
});

const Note = mongoose.model('Note', NoteSchema);

app.use(bodyParser.json());

app.get('/notes', async (req, res) => {
    const notes = await Note.find();
    res.json(notes);
});

app.post('/notes', async (req, res) => {
    const note = new Note(req.body);
    await note.save();
    res.json(note);
});

app.put('/notes/:id', async (req, res) => {
    const note = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(note);
});

app.delete('/notes/:id', async (req, res) => {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: 'Nota eliminada' });
});

app.listen(3000, () => {
    console.log('API ejecutándose en el puerto 3000');
});
