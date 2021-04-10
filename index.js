const express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    cors = require('cors');
    
const app = express();
const Models = require('./models.js');
const Movies = Models.Movie;
const Users = Models.User;

const passport = require('passport');
require('./passport');

const { check, validationResult } = require('express-validator');

// connect online MongoDB Atlas to Heroku
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// connect to local mongoose database (on my computer)
// mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });

// Middleware
app.use(morgan('common')); // logs IP addr, date, time, method, status
app.use(bodyParser.json()); // read req.body of HTTP requests
app.use(express.static('public')); // opens static documenation page
app.use(cors()); // implement cross-origin resource sharing

let auth = require('./auth')(app);

// General error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Oops...something went wrong!');
});

// GET requests
app.get('/', (req, res) => {
    res.send('Welcome to Movie Mania!');
});

// Return list of all movies
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.find()
    .then((movies) => {
        res.status(201).json(movies);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

// Return data about a single movie by title
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne({ Title: req.params.Title })
    .then((movie) => {
        res.status(201).json(movie);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// Return data about a genre by title
app.get('/movies/genres/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne({ Title: req.params.Title })
    .then((movie) => {
        res.status(201).json(movie.Genre);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

// Return data about a director by name
app.get('/movies/directors/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne({ 'Director.Name': req.params.Name })
    .then((director) => {
        res.status(201).json(director.Director);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

// Return list of all users
app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
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
app.post('/users', [
    // middleware using express-validator to validate format & characters in user inputs
    check('FirstName', 'First name is required.').not().isEmpty(),
    check('LastName', 'Last name is required.').not().isEmpty(),
    check('Username', 'Username is required.').isLength({min: 5}),
    check('Username', 'Username contains non-alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').isLength({min: 5}), // Adjusted to 5 for testing purposes
    check('Email', 'Please enter a valid email address.').isEmail()
    ], (req, res) => {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        let hashedPassword = Users.hashPassword(req.body.Password); // hash any password entered by user when registering before storing it in mongoDB
        Users.findOne({ Username: req.body.Username })
        .then((user) => {
            if (user) {
                return res.status(400).send(req.body.Username + 'already exists');
            } else {
                Users
                    .create({
                        FirstName: req.body.FirstName,
                        LastName: req.body.LastName,
                        Username: req.body.Username,
                        Password: hashedPassword,
                        Email: req.body.Email,
                        Birth: req.body.Birth
                    })
                    .then((user) =>{res.status(201).json(user) })
                .catch((error) => {
                    console.error(error);
                    res.status(500).send('Error: ' + error);
                });
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
});

// User login
app.post('/login', passport.authenticate('jwt', { session: false }), [
    // middleware using express-validator to validate format & characters in user inputs
    check('Username', 'Username is required.').not().isEmpty(),
    check('Password', 'Password is required').not().isEmpty()
    ], (req, res) => {
        Users.findOne({ Username: req.body.Username })
        .then((movies) => {
            res.status(201).json(movies)
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
    }
);

// Get user information based on their username
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOne({ Username: req.params.Username })
    .then((user) => {
        res.json(user);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

// Allow users to update their user info based on username
app.put('/users/:Username', passport.authenticate('jwt', { session: false }), [
    // middleware using express-validator to validate format & characters in user inputs
    check('FirstName', 'First name is required.').not().isEmpty(),
    check('LastName', 'Last name is required.').not().isEmpty(),
    check('Username', 'Username is required.').isLength({min: 5}),
    check('Username', 'Username contains non-alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').isLength({min: 5}), // Adjusted to 5 for testing purposes
    check('Email', 'Please enter a valid email address.').isEmail()
], (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    let hashedPassword = Users.hashPassword(req.body.Password); // hash any password entered by user when registering before storing it in mongoDB
    Users.findOneAndUpdate({ Username: req.params.Username }, 
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
app.post('/users/:Username/Movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, 
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
app.delete('/users/:Username/Movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, 
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
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
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

// Allow port number to change
// Look for a pre-configured port number in the environment variable, and if nothing is found, sets to 8080
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
    console.log('This app is listening on Port' + port);
});