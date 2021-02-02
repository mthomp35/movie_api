const express = require('express'),
    morgan = require('morgan');

const app = express();

let topTenMovies = [
    {
        title: 'The birds',
        year: '2000'
    },
    {
        title: 'The birds 2',
        year: '2001'
    },
    {
        title: '8 more movie titles',
        year: '8 more years'
    }
];

// Middleware
app.use(morgan('common'));
app.use(express.static('public'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Oops...something went wrong!');
});

// GET requests
app.get('/', (req, res) => {
    res.send('Welcome to Movie Mania!');
});

// Return list of all movies
app.get('/movies', (req, res) => {
    res.json(allMovies);
    res.send('Successful GET request returning all movies');
});

// Return data about a single movie by title
app.get('/movies/:title', (req, res) => {
    res.send('Successful GET request returning data about a single movie based on title');
});

// Return data about a genre by title
app.get('/genres/:title', (req, res) => {
    res.send('Successful GET request returning data about a genre based on movie title');
});

// Return data about a director by name
app.get('/directors/:name', (req, res) => {
    res.send('Successful GET request returning data about a director based on name');
});

// Return list of all users
app.get('/users', (req, res) => {
    res.send('Successful GET request returning list of all users');
});



app.listen(8080, () => {
    console.log('This app is listening to port 8080.');
});