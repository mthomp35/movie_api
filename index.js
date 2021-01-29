const express = require('express'),
    morgan = require('morgan');

const app = express();

app.use(morgan('common'));

let topTenMovies = []

app.use('/documentation', express.static('public'));

app.get('/', (req, res) => {
    res.send('Welcome to Movie Mania!');
});

app.get('/movies', (req, res) => {
    res.json(topTenMovies);
});

app.listen(8080, () => {
    console.log('This app is listening to port 8080.');
});