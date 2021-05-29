const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const xss = require('xss');

let movieSchema = mongoose.Schema({
    Title: {type: String, required: true},
    Description: {type: String, required: true},
    Genre: {
        Name: String,
        Description: String
    },
    Director: {
        Name: String,
        Bio: String,
        Birth: String,
        Death: String
    },
    Actors: [String],
    Year: String,
    ImagePath: String,
    Featured: Boolean
});

let userSchema = mongoose.Schema({
    FirstName: {type: String, required: true},
    LastName: {type: String, required: true},
    Username: {type: String, required: true},
    Password: {type: String, required: true},
    Email: {type: String, required: true},
    Birth: String,
    FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
});

userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.Password);
};
//statics sits on class and methods sits on specific user
userSchema.statics.serialize = function(user) {
    return {
        FirstName: xss(user.FirstName),
        LastName: xss(user.LastName),
        Username: xss(user.Username),
        Email: xss(user.Email),
        Birth: xss(user.Birth),
        FavoriteMovies: xss(user.FavoriteMovies)
    }
};

let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;