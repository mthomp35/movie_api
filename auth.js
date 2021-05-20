// creates new endpoint for registered users to log in, authenticates login requests using basic HTTP authentication & generates a JWT for the user
const config = require('./config');

const jwtSecret = config.JWT_SECRET; // This has to be the same key used in the JWTStrategy

const jwt = require('jsonwebtoken'),
    passport = require('passport');

require('./passport'); // Local passport file

let generateJWTToken = (user) => {
    return jwt.sign(user, jwtSecret, {
        subject: user.Username, // This is the username being encoded in the JWT
        expiresIn: '7d', // This specifies the token will expire in 7 days
        algorithm: 'HS256' // This is the algorithm used to "sign" or encode the values of the JWT
    });
}

// POST login - check to see if username & password exist, if not, return error message
module.exports = (router) => {
    router.post('/login', (req, res) => {
        passport.authenticate('local', { session: false }, (error, user, info) => {
            if (error || !user) {
                return res.status(400).json({
                    message: 'Something is not right',
                    user: user
                });
            }
            req.login(user, { session: false }, (error) => {
                if (error) {
                    res.send(error);
                }
                let token = generateJWTToken(user.toJSON());
                return res.json({ user, token }); // ES6 shorthand to return token
            });
        }) (req, res);
    });
}