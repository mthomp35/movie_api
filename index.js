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

// Register new users
app.post('/users', (req, res) => {
    res.send('Successfully POST (create) new user and return 201 status with success message');
});

// Allow users to update their user info based on username
app.put('/users/:username', (req, res) => {
    res.send('Successfully PUT (update) user info and return 201 status with success message');
});

// Allow users to add a movie to their list of favorites
app.put('/users/:username/favorites/:title', (req, res) => {
    res.send('Successfully PUT (add) movie title to user favorites list and return 201 status with success message');
});

// Allow users to remove a movie from their list of favorites
app.delete('/users/:username/favorites/:title', (req, res) => {
    res.send('Successfully DELETE (remove) movie title from user favorites list and return 201 status with success message');
});

// Allow existing users to deregister
app.delete('/users/:username', (req, res) => {
    res.send('Successfully DELETE (remove) user registration and data from user list and return 201 status with success message');
});

app.listen(8080, () => {
    console.log('This app is listening to port 8080.');
});