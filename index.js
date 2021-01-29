const express = require('express'),
    morgan = require('morgan');

const app = express();

app.use(morgan('common'));

let topTenMovies = []

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send('Welcome to Movie Mania!');
});

app.get('/movies', (req, res) => {
    res.json(topTenMovies);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Oops...something went wrong!');
});

app.listen(8080, () => {
    console.log('This app is listening to port 8080.');
});