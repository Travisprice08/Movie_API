const mongoose = require('mongoose');

let movieSchema = mongoose.Schema({
    Title: {type: String, require: true},
    Description: {type: String, require: true},
    Director: [{type:mongoose.Schema.Types.ObjectId, ref:"director"}],
    Genre: [{type:mongoose.Schema.Types.ObjectId, ref: "genre"}],
    Actors: [Array],
    ImagePath: String,
    Featured: Boolean
});

let userSchema = mongoose.Schema({
    Username: {type: String, require: true},
    Password: {type: String, require: true},
    Email: {type: String, require: true},
    Birthday: Date,
    FavoriteMovie: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}]
});

let directorSchema = mongoose.Schema({
    Director: {
        Name: String,
        Bio: String,
        Birthday: Date
    }
});

let genreSchema = mongoose.Schema({
    Genre: {
        Name: String,
        Description: String
    }
});

let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);
let Director = mongoose.model('Director', directorSchema);
let Genre = mongoose.model('Genre', genreSchema);

module.exports.Movie = Movie;
module.exports.User = User;
module.exports.Director = Director;
module.exports.Genre = Genre;