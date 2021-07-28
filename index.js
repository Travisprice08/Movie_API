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
//const Directors = Models.Director;
let Genres = Models.Genre;

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

//Get Requests
app.get('/', (req, res) => {
    res.send('Welcome to MyFlix!');
});

app.use(express.static('public'));

//Gets the list data of all movies 
/*app.get('/movies',
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
    });*/

// Temp removal of authentication middleware
app.get("/movies", function (req, res) {
    Movies.find()
        .then(function (movies) {
            res.status(201).json(movies);
        })
        .catch(function (error) {
            console.error(error);
            res.status(500).send("Error: " + error);
        });
});

//Gets list data of a specific movie title
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
//Gets list of movies matching a specified genre
app.get('/genres/:name', function
    //passport.authenticate('jwt', { session: false }),
    (req, res) {
    Genres.findOne({ name: req.params.name })
        .then((genre) => {
            res.json(genre);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error ' + err);
        });
});
//Gets list of directors
/*app.get('/movies/directors', function
    //passport.authenticate('jwt', { session: false }),
    (req, res) {
    Movies.find()
        .then((director) => {
            res.json(director);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error ' + err);
        });
});*/

//Gets information for a specified director
app.get(
    '/movies/directors/:Name',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Movies.findOne({ 'Director.Name': req.params.Name })
            .then((director) => {
                res.status(201).json(director);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('Error: ' + err);
            });
    }
);

//Registration for new users

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
            .then((users) => {
                if (users) {
                    return res.status(400).send(req.body.Username + 'already exists');
                } else {
                    Users.create({
                        Username: req.body.Username,
                        Password: hashedPassword,
                        Email: req.body.Email,
                        Birthday: req.body.Birthday
                    }).then((users) => { res.status(201).json(users) })
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

//Get all users
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

//Get user by username
app.get('/users/:Username', (req, res) => {
    Users.findOne({ Username: req.params.Username })
        .then((users) => {
            res.json(users);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

//Update user info by Username

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

//Allows you to add a movie to the list
app.post('/users/:Username/Movies/:MovieID',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Users.findOneAndUpdate({ Username: req.params.Username }, {
            $push: { FavoriteMovies: req.params.MovieID }
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
//Removes movies from list
app.delete('/users/:Username/Movies/:MovieID',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Users.findOneAndRemove({ Username: req.params.Username }, {
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

//Deleting user by username
app.delete('/users/:Username',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Users.findOneAndRemove({ Username: req.params.Username })
            .then((users) => {
                if (!users) {
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




