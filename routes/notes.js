const route = require('express').Router();
const { readFromFile, readAndAppend, writeToFile } = require('../helpers/fsUtils');
// const uuid = require('../helpers/uuid');
const { v4: uuidv4 } = require('uuid');

// GET Route for retrieving all the notes
route.get('/', (req, res) => {
  console.info(`${req.method} request received for notes`);
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});
  
// POST Route for a new notes
route.post('/', (req, res) => {
  console.info(`${req.method} request received to post a note`);

  const { title, text } = req.body;

  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuidv4(),
    };

    readAndAppend(newNote, './db/db.json');

    console.log(newNote);

    res.json(`Note added successfully 🚀`);
  } else {
    res.error('Error in adding Note');
  }
});

// DELETE Route for a specific note id
route.delete('/:id', (req, res) => {
  const noteId = req.params.id;
  console.info(`${req.method} request received to delete a note`);
  readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      // Make a new array of all notes except the one identified to be deleted
      const result = json.filter((title) => title.id !== noteId);

      // Save that array to the filesystem
      writeToFile('./db/db.json', result);

      // Respond to the DELETE request
      res.json(`Item ${noteId} has been deleted 🗑️`);
    });
});

module.exports = route;