const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

let movieSchema = mongoose.Schema({
    Title: { type: String, require: true },
    Description: { type: String, require: true },
    //Director: [{ type: mongoose.Schema.Types.ObjectId, ref: "director" }],
    //Genre: [{ type: mongoose.Schema.Types.ObjectId, ref: "genre" }],
    Genre: {
        Name: String,
        Description: String
    },
    Director: {
        Name: String,
        Bio: String,
        Birth: Number,
    },
    Actors: [Array],
    ImagePath: String,
    Featured: Boolean
});

let userSchema = mongoose.Schema({
    Username: { type: String, require: true },
    Password: { type: String, require: true },
    Email: { type: String, require: true },
    Birthday: Date,
    FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
});

userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function (password) {
    return bcrypt.compareSync(password, this.Password);
};

/*let directorSchema = mongoose.Schema({
    Director: {
        Name: String,
        Bio: String,
        Birthday: Date
    }
});*/

let genreSchema = mongoose.Schema({
    Genre: {
        Name: String,
        Description: String
    }
});

let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);
//let Director = mongoose.model('Director', directorSchema);
let Genre = mongoose.model('Genre', genreSchema);

module.exports.Movie = Movie;
module.exports.User = User;
//module.exports.Director = Director;
module.exports.Genre = Genre;