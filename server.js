// const { randomUUID } = require('crypto');
const express = require('express');
const fs = require('fs');
const path = require('path');
const db = require('./db/db.json');
// const uuid = require('uuid');
// import {v4 as uuidv4 } from 'uuid';

// const api = require('./routes/index.js');

const PORT = process.env.port || 3001;

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use('/api', api);

app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// Wildcard route to direct users to homepage
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// Get request for notes
app.get('/api/notes', (req,res) => {
  req.status(201).json(db);
  console.log(`${req.method} request received!`);
});

// Post request to add notes
app.post('/api/notes', (req, res) => {
  // Log that a POST request is received
  console.log(`${req.method} request received to add a note`);

  // Destructure assignment of items in object
  const { title, text } = req.body;

  // Check all necessary properties are available
  if (title && text) {
    const newNote = {
      title,
      text
    };

    // fs.appendFile('./db/db.json', newNote, (err) =>
    // err
    //   ? console.error(err)
    //   : console.log(
    //       `Review for ${newNote.title} has been written to JSON file`
    //     )
    // );

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      const dataOfReview = JSON.parse(data);
      console.log(dataOfReview);
      dataOfReview.push(newNote);


      // Write the string to a file
      fs.writeFile(`./db/db.json`, JSON.stringify(dataOfReview, null, 4), (err) =>
        err
          ? console.error(err)
          : console.log(
              `Review for ${newNote.title} has been written to JSON file`
            )
      );
    });

    const response = {
      status: 'success',
      body: newNote,
    };

    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json('Error in posting note');
  }
});


// app.delete('/api/notes', (req, res) => {
//   req.json(db);
// });


app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);