const express = require('express'),
    morgan = require('morgan'),
    mongoose = require('mongoose'),
    Models = require('./models.js'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    cors = require('cors');
require('./passport');
const { check, validationResult } = require('express-validator');
const Movies = Models.Movie;
const Users = Models.User;
const Directors = Models.Director;
const Genres = Models.Genre;
/*mongoose.connect('mongodb://localhost:27017/[myFlixDB]', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});*/
//Connected 
mongoose.connect(process.env.CONNECTION_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const app = express();
app.use(cors());
app.use(bodyParser.json());
let auth = require('./auth')(app);
/*let allowedOrigins = ['http://localhost:8080', 'http://testsite.com', 'http://localhost:1234', 'https://myfilmdb.herokuapp.com'];
app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) { // If a specific origin isn’t found on the list of allowed origins
            let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
            return callback(new Error(message), false);
        }
        return callback(null, true);
    }
}));*/
//Logs requests to server
app.use(morgan('common'));
/**
 * Get the Welcome Page
 * @method Get
 * @param {string} endpoint - This is the endpoint for the welcome page. "Url/"
 * @returns {object} - returns Welcome Page
 */

app.get('/', (req, res) => {
    res.send('Welcome to MyFlix!');
});
app.use(express.static('public'));

/**
 * Get All Movies
 * @method Get
 * @params {string} endpoint - The endpoint to return all movies
 * @returns {object} - returns movie objects
 */
app.get('/movies',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Movies.find()
            .then((movies) => {
                res.status(201).json(movies);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('Error ' + err);
            });
    });

// Temp removal of authentication middleware for testing
// app.get("/movies", function (req, res) {
//     Movies.find()
//         .then(function (movies) {
//             res.status(201).json(movies);
//         })
//         .catch(function (error) {
//             console.error(error);
//             res.status(500).send("Error: " + error);
//         });
// });

/**
 * Get movie by title
 * @method Get
 * @param {string} endpoint - The endpoint gets movie by title
 * @param {string} Title - used to specify which movie to retrieve
 * @returns {object} - This returns the title specific movie
 */
app.get('/movies/:Title',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Movies.findOne({ Title: req.params.Title })
            .then((movie) => {
                res.json(movie);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('Error ' + err);
            });
    });
/**
 * Get list of all genres
 * @method Get
 * @param {string} endpoint - This is the endpoint to list all genres. "url/genres"
 * @returns {object} Returns a list of all genres
 */
app.get('/genres',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Genres.find()
            .then((genres) => {
                res.json(genres);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('Error ' + err);
            });
    });
/**
 * Get genre by name
 * @method Get
 * @param {string} endpoint - Fetches genre by name
 * @param {string} name - Specifies which genre by name. "url/genres/:name"
 * @return {object} Returns specified genre
 */
app.get(
    "/genres/:name",
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Genres.findOne({ Name: req.params.name })
            .then((genres) => {
                res.status(201).json(genres);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('Error: ' + err);
            });
    }
);

/**
 * Get genre by id
 * @method Get
 * @param {string} endpoint - Fetches genre by id
 * @param {string} id - Specifies which genre by id. "url/genres/id/:id"
 * @return {object} Returns specified genre
 */
app.get(
    "/genres/id/:id",
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Genres.findOne({ _id: req.params.id })
            .then((genres) => {
                res.status(201).json(genres);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('Error: ' + err);
            });
    }
);

//Temp removal of authentication middleware for testing
// app.get("/genres/id/:id", function (req, res) {
//     Genres.findOne({ _id: req.params.id })
//         .then((genres) => {
//             res.status(201).json(genres);
//         })
//         .catch(function (error) {
//             console.error(error);
//             res.status(500).send("Error: " + error);
//         });
// });

/**
 * Get list of all directors
 * @method Get
 * @param {string} endpoint - Fetches list of directors. "url/directors"
 * @return {object} Returns list of directors
 */
app.get('/directors',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Directors.find()
            .then((directors) => {
                res.json(directors);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('Error ' + err);
            });
    });
/**
 * Get director by name
 * @method Get
 * @param {string} endpoint - Fetches director by name
 * @param {string} name - Specifies which director by name. "url/directors/:name"
 * @return {object} Returns specified director
 */
app.get(
    "/directors/:name",
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Directors.findOne({ Name: req.params.name })
            .then((directors) => {
                res.status(201).json(directors);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('Error: ' + err);
            });
    }
);

/**
 * Get director by id
 * @method Get
 * @param {string} endpoint - Fetches director by id
 * @param {string} name - Specifies which director by id. "url/directors/id/:id"
 * @return {object} Returns specified director
 */
app.get(
    "/directors/id/:id",
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Directors.findOne({ _id: req.params.id })
            .then((director) => {
                res.status(201).json(director);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('Error: ' + err);
            });
    }
);

/**
 * Registration for new users
 * @method POST
 * @param {string} endpoint - endpoint for user registration. "url/users"
 * @param {string} Username - Username chosen by user
 * @param {string} Password - Password chosen by user
 * @param {Email} Email - Users email address
 * @returns {object} -New User
 */
app.post('/users', [
    check('Username', 'Username is required').isLength({ min: 5 }),
    check('Username', 'Username contains no alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()], (req, res) => {
        //Check the validation object for errors
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        };
        //passport.authenticate('jwt', { session: false }), 
        let hashedPassword = Users.hashPassword(req.body.Password);
        Users.findOne({ Username: req.body.Username })
            .then((user) => {
                if (user) {
                    return res.status(400).send(req.body.Username + 'already exists');
                } else {
                    Users.create({
                        Username: req.body.Username,
                        Password: hashedPassword,
                        Email: req.body.Email,
                        Birthday: req.body.Birthday
                    }).then((user) => { res.status(201).json(user) })
                        .catch((error) => {
                            console.error(error);
                            res.status(500).send('Error: ' + error);
                        })
                }
            }).catch((error) => {
                console.error(error);
                res.status(500).send('Error: ' + error);
            });
    });
/**
 * Get all users
 * @method Get
 * @param {string} endpoint - endpoint used to fetch all users. "url/users"
 * @returns {object} - Returns all users
 */
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
/**
 * Get user by username
 * @method Get
 * @param {string} endpoint - endpoint to fetch user by username
 * @param {string} Username - used to get specific user. "url/users/:Username"
 * @returns {object} - returns specified user
 */
app.get('/users/:Username', (req, res) => {
    Users.findOne({ Username: req.params.Username })
        .then((user) => {
            res.json(user);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});
/**
 * Update user info by Username
 * @method put
 * @param {string} endpoint - endpount to fetch user
 * @param {string} Username - Users username (Required)
 * @param {string} Password - Updated user password
 * @param {Email} Email - New email
 * @returns {string} - Returns success or error message
 */
app.put('/users/:Username',
    //Requires validation code
    passport.authenticate('jwt', { session: false }),
    [
        check('Username', 'Username is required').isLength({ min: 5 }),
        check('Username', 'Username contains no alphanumeric characters - not allowed.').isAlphanumeric(),
        check('Password', 'Password is required').not().isEmpty(),
        check('Email', 'Email does not appear to be valid').isEmail()
    ], (req, res) => {
        //Check the validation object for errors
        let errors = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        let hashedPassword = Users.hashPassword(req.body.Password);
        Users.findOneAndUpdate({ Username: req.params.Username }, {
            $set:
            {
                Username: req.body.Username,
                Password: hashedPassword,
                Email: req.body.Email,
                Birthday: req.body.Birthday
            }
        },
            { new: true }).then((updatedUser) => {
                res.json(updatedUser);
            }).catch((err) => {
                console.error(err);
                res.status(500).send('Error: ' + err);
            });
    });
/**
 * Allows you to add a movie to the list
 * @method Post
 * @param {string} endpoint - endpoint used to add a movie to favorites
 * @param {string} Title and Username- (Required)
 * @returns {string} - Returns success or error message
 */
app.post('/users/:Username/Movies/:MovieID',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Users.findOneAndUpdate({ Username: req.params.Username }, {
            $addToSet: { FavoriteMovies: req.params.MovieID }
        },
            { new: true }, //This line makes sure that the updated document is returned
            (err, updatedUser) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('Error ' + err);
                } else {
                    res.json(updatedUser);
                }
            });
    });
/**
 * Removes movies from list
 * @method delete
 * @param {string} endpoint - endpoint used to remove movie from favorites
 * @param {string} Title and Username -(Required)
 * @returns {string} - Returns success or error message
 */
app.delete('/users/:Username/Movies/:MovieID',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Users.findOneAndUpdate({ Username: req.params.Username }, {
            $pull: { FavoriteMovies: req.params.MovieID }
        },
            { new: true }, //This line makes usre that the updated document is returned
            (err, updatedUser) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('Error ' + err);
                } else {
                    res.json(updatedUser);
                }
            });
    });
/**
 * Deleting user by username
 * @method delete
 * @param {string} endpoint - endpoint used to get user
 * @param {string} Username - Used to specifiy user. "Url/user/:Username"
 * @returns {string} - Returns success or error message
 */
app.delete('/users/:Username',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Users.findOneAndRemove({ Username: req.params.Username })
            .then((user) => {
                if (!user) {
                    res.status(400).send(req.params.Username + ' was not found');
                } else {
                    res.status(200).send(req.params.Username + ' was deleted');
                }
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('Error ' + err);
            });
    });
//Logging with Morgan
app.get('/logged', (req, res) => {
    res.send('These are the data logs.')
})
//Logs errors
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
//app.listen(5000, () => console.log('Your app is running on Port 5000.'));
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
    console.log('Listening on Port ' + port);
});