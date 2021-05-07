const express = require('express');
    morgan = require('morgan');

const app = express();

let topMovies = [
    {
        title: 'The Man From Nowhere',
        starring:'Won Bin',
        director:'Jeoung-beoum Lee'
    },
    {
        title: 'My Cousin Vinny',
        starring:'Joe Pesci',
        director:'Jonathan Lynn'
    },
    {
        title: 'Black Hawk Down',
        starring:'Josh Hartnett',
        director:'Ridley Scott'
    },
    {
        title: 'Kiss Kiss Bang Bang',
        starring:'Robert Downey Jr.',
        director:'Shane Black'
    },
    {
        title: 'I Saw the Devil',
        starring:'Lee Byung-hun',
        director:'Jee-woon Kim'
    }
];

app.use(morgan('common'));

//Get Requests
app.get('/', (req,res) => {
    res.send('Welcome to my top 10 favorite movies!');
})
//JSON request of top movie data
app.get('/movies', (req, res) => {
    res.json(topMovies);
})
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
