const cors = require('cors');
app.use(cors());

const { check, validationResults } = require('express-validator');

const passport = require('passport');
require('./passport');

const express = require('express'),
    bodyParser = require('body-parser'),
    uuid = require('uuid');

const morgan = require('morgan');
const app = express();
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;
const Directors = Models.Director;
const Genres = Models.Genre;   

mongoose.connect('mongodb://localhost:27017/[myFlixDB]', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
});

app.use(bodyParser.json());

let auth = require('./auth')(app);

//Logs requests to server
app.use(morgan('common'));

//Get Requests
app.get('/', (req,res) => {
    res.send('Welcome to MyFlix!');
});
//Gets the list data of all movies 
app.get('/movies', 
    passport.authenticate('jwt', { session: false}), 
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
//Gets list of directors
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

//Gets information for a specified director
app.get(
    "/directors/:name",
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Directors.findOne({ name: req.params.name })
          .then((directors) => {
              res.status(201).json(directors);
          })
          .catch((err) => {
              console.error(err);
              res.status(500).send('Error: ' + err);
          });
    }
);

//Registration for new users
/* We will expect JSON in this format
{
    ID: Integer,
    Username: String,
    Password: String,
    Email: String,
    Birthday: Date
}*/
app.post('/users', 

    [
        check('Username', 'Username is required').isLength({min: 5}),
        check('Username', 'Username contains no alphanumeric characters - not allowed.').isAlphanumeric(),
        check('Password', 'Password is required').not().isEmpty(),
        check('Email', 'Email does not appear to be valid').isEmail()
    ], (req, res) => {

        //Check the validation object for errors
        let errors = validationResult(req);

        if (!error.isEmpty()) {
            return res.status(422).json({ errors : errors.array() });
        }

    //passport.authenticate('jwt', { session: false }), 
    let hashedPassword = Users.hashedPassword(req.body.Password);
    Users.findOne({Username: req.body.Username})
    .then((user) => {
        if (user) {
            return res.status(400).send(req.body.Username + 'already exists');
        } else {
            Users
               .create({
                   Username: req.body.Username,
                   Password: hashedPassword,
                   Email: req.body.Email,
                   Birthday: req.body.Birthday
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
        res.status(500).send('Error ' + error);
    });
});

//Get all users
app.get('/users',
    passport.authenticate('jwt', { session: false }), 
    (req, res) => {
    Users.find()
    .then((users) => {
        res.status(201).json(users);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err );
    });
});

//Get user by username
app.get('/users/:Username', 
    passport.authenticate('jwt', { session: false }), 
    (req, res) => {
    Users.findOne({ Username: req.params.Username })
    .then ((user) => {
        res.json(user);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

//Update user info by Username
/*Expected JSON format
{
    Username: String,
    (required)
    Password: String,
    (required)
    Email: String,
    (required)
    Birthday: Date
}*/
app.put('/users/:Username', 
    //Requires validation code
    passport.authenticate('jwt', { session: false }), 
    (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
        {
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
        }
    },
    { new: true }, //This line makes sure that the updated document is returned
    (err, updatedUser) => {
        if(err) {
            console.error(err);
            res.status(500).send( 'Error: ' + err);
        } else {
            res.json(updatedUser);
        }
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
        $pull: {FavoriteMovies: req.params.MovieID }
    },
    { new: true}, //This line makes usre that the updated document is returned
    (err, updateUser) => {
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
app.get('/logged', (req,res) => {
    res.send('These are the data logs.')
})
app.use(express.static('public'));
//Logs errors
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

//app.listen(5000, () => console.log('Your app is running on Port 5000.'));

const port = process.env.PORT || 5000;
app.listen(port, '0.0.0.0', () => {
    console.log('Listening on Port ' + port);
});



