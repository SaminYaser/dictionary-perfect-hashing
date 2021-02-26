const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const cors = require('cors')


// Middlewares
app.use(cors())
app.use(bodyParser.json());

// Import dictionary
const dictionary = require('./dictionary');

app.get('/dictionary', dictionary.translate);

// Routes
app.get('/', (req, res) => {
    res.send('We are on home');
})

//Boot server
app.listen(25565, "0.0.0.0", async () => {
    await dictionary.primaryHash();
    await dictionary.secondaryHash();
    console.log("Server has started");
});
