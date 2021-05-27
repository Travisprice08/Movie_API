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

//Logs requests to server
app.use(morgan('common'));

//Get Requests
app.get('/', (req,res) => {
    res.send('Welcome to MyFlix!');
});
//Gets the list data of all movies 
app.get('/movies', (req, res) => {
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
app.get('/movies/:Title', (req, res) => {
    Movies.findOne({ Title: req.params.Title })
    .then((movie) => {
        res.json(movie);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error ' + err);
    });
});
//Gets list data on movie genre
app.get('/genre/:Name', (req, res) => {
    Genres.findOne({ Name: req.params.Name })
    .then((genre) => {
        res.json(genre.Description);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error ' + err);
    });
});
//Gets information on the director
app.get('/director/:Name', (req, res) => {
    Directors.findOne({ Name: req.params.Name})
    .then((director) => {
        res.json(director);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error ' + err);
    });
});
//Registration for new users
/* We will expect JSON in this format
{
    ID: Integer,
    Username: String,
    Password: String,
    Email: String,
    Birthday: Date
}*/
app.post('/users', (req, res) => {
    Users.findOne({Username: req.body.Username})
    .then((user) => {
        if (user) {
            return res.status(400).send(req.body.Username + 'already exists');
        } else {
            Users
               .create({
                   Username: req.body.Username,
                   Password: req.body.Password,
                   Email: req.body.Email,
                   Birthday: req.body.Birthday
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
        res.status(500).send('Error ' + error);
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
        res.status(500).send('Error: ' + err );
    });
});

//Get user by username
app.get('/users/:Username', (req, res) => {
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
app.put('/users/:Username', (req, res) => {
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
app.post('/users/:Username/Movies/:MovieID', (req, res) => {
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
app.delete('/users/:Username/Movies/:MovieID', (req, res) => {
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
app.delete('/users/:Username', (req, res) => {
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

app.listen(5000, () => console.log('Your app is running on Port 5000.'));



