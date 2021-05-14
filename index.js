const express = require('express'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    uuid = require('uuid');

const app = express();

app.use(bodyParser.json());

let movies = [
    {
        title: 'The Man From Nowhere',
        starring:'Won Bin',
        director:'Jeoung-beoum Lee',
        genre:'Thriller'
    },
    {
        title: 'My Cousin Vinny',
        starring:'Joe Pesci',
        director:'Jonathan Lynn',
        genre:'Comedy'
    },
    {
        title: 'Black Hawk Down',
        starring:'Josh Hartnett',
        director:'Ridley Scott',
        genre:'Action'
    },
    {
        title: 'Kiss Kiss Bang Bang',
        starring:'Robert Downey Jr.',
        director:'Shane Black',
        genre:'Comedy'
    },
    {
        title: 'I Saw the Devil',
        starring:'Lee Byung-hun',
        director:'Jee-woon Kim',
        genre:'Thriller'
    }
];

app.use(morgan('common'));

//Get Requests
app.get('/', (req,res) => {
    res.send('Welcome to my top 5 favorite movies!');
});
//Gets the list data of all movies 
app.get('/movies', (req, res) => {
    res.json(movies);
});
//Gets list data of a specific movie title
app.get('/movies/:title', (req, res) => {
    res.json(movies.find((movies) => {
        return movies.title === req.params.title
    }));
});
//Gets list data on movie genre
app.get('/movies/:genres/:name', (req, res) => {
    res.json(movies.find((movies) => {
        return movies.genre === req.params.name
    }));
});
//Gets information on the director
app.get('/movies/:directors/:name', (req, res) => {
    res.json(movies.find((movies) => {
        return movies.director === req.params.director
    }));
});
//Registration for new users
app.post('/users', [], (req, res) => {
    let newUser = req.body;

    if (!newUser.name) {
        const message = 'Missing name in request body';
        res.status(400).send(message);
    } else {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).send(newUser);
    }
});

//Delete user account
app.delete('/users/:username', (req, res) => {
    let user = users.find((user) => { return user.id === req.params.id });

    if (user) {
        users = users.filter((obj) => { return obj.id !== req.params.id });
        res.status(201).send('User ' + req.params.name + ' was deleted.');
    }
});

//Allows you to add a movie to the list
app.post('/users/[Username]/movies/:movieID', (req, res) => {
    let newMovie = req.body;

    if (!newMovie.name) {
        const message = 'Missing "name" in request body';
        res.status(400).send(message);
    } else {
        newMovie.id = uuid.v4();
        movies.push(newMovie);
        res.status(201).send(newMovie);
    }
});
//Removes movies from list
app.delete('/users/[Username]/movies/:movieID', (req, res) => {
    let remove = movies.find((remove) => { return movies.title === req.params.title});

    if (remove) {
        movies = movies.filter((obj) => { return obj.title !== req.params.title});
        res.status(201).send(req.params.title + ' has been removed from your list.');
    }
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

app.listen(5000, () => {
    console.log('Your app is running on Port 5000.');
});
