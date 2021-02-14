const express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    Models = require('./models.js');

const app = express();
app.use(bodyParser.json());
const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/myFlixDB', { use NewUrlParser: true, useUnifiedTopology: true });

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
    //res.json(allMovies);
    res.send('Successful GET request returning all movies');
});

// Return data about a single movie by title
app.get('/movies/:title', (req, res) => {
    res.send('Successful GET request returning data about a single movie based on title');
});

// Return data about a genre by title
app.get('/movies/genres/:title', (req, res) => {
    res.send('Successful GET request returning data about a genre based on movie title');
});

// Return data about a director by name
app.get('/directors/:name', (req, res) => {
    res.send('Successful GET request returning data about a director based on name');
});

// Return list of all users
app.get('/users', (req, res) => {
    Users.find()
    .then((users) => {
        res.status(201).json(users);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

// Register new users
app.post('/users', (req, res) => {
    Users.findOne({ Username: req.body.Username})
    .then((user) => {
        if (user) {
            return res.status(400).send(req.body.Username + 'already exists');
        } else {
            Users
                .create({
                    FirstName: req.body.FirstName,
                    LastName: req.body.LastName,
                    Username: req.body.Username,
                    Password: req.body.Password,
                    Email: req.body.Email,
                    Birth: req.body.Birth
                })
                .then((user) =>{res.status(201).json(user) })
            .catch((error) => {
                console.error(error);
                res.status(500).send('Error: ' + error);
            })
        }
    })
    .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
    });
});

// Get user information based on their username
app.get('/users/:Username', (req, res) => {
    Users.findOne({Username: req.params.Username })
    .then((user) => {
        res.json(user);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

// Allow users to update their user info based on username
app.put('/users/:Username', (req, res) => {
    Users.findOneAndUpdate({Username: req.params.Username }, 
    { $set:
        {
            FirstName: req.body.FirstName,
            LastName: req.body.LastName,
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birth: req.body.Birth
        }
    },
    { new: true }, // This line makes sure the udpated document is returned
    (err, updatedUser) => {
        if(err) {
            console.error(err);
            res.status(500).send('Error: ' + err);
        } else {
            res.json(updatedUser);
        }
    });
});

// Allow users to add a movie to their list of favorites
app.post('/users/:Username/Movies/:MovieID', (req, res) => {
    Users.findOneAndUpdate({Username: req.params.Username}, 
    { $push: { FavoriteMovies: req.params.MovieID }},
    { new: true },
    (err, updatedUser) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error: ' + err);
        } else {
            res.json(updatedUser);
        }
    });
});

// Allow users to remove a movie from their list of favorites
app.post('/users/:Username/Movies/:MovieID', (req, res) => {
    Users.findOneAndUpdate({Username: req.params.Username}, 
    { $pull: { FavoriteMovies: req.params.MovieID }},
    { new: true },
    (err, updatedUser) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error: ' + err);
        } else {
            res.json(updatedUser);
        }
    });
});

// Allow existing users to deregister
app.delete('/users/:Username', (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
        if (!user) {
            res.status(400).send(req.params.Username + ' was not found.');
        } else {
            res.status(200).send(req.params.Username + ' was deleted.');
        }
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

app.listen(8080, () => {
    console.log('This app is listening to port 8080.');
});