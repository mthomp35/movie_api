const express = require('express'),
    morgan = require('morgan');

const app = express();

app.use(morgan('common'));

app.get('/', (req, res) => {
    res.send('Welcome to my app!');
});

app.get('/secreturl', (req, res) => {
    res.send('This is a secret url');
});

app.listen(8080, () => {
    console.log('This app is listening to port 8080.');
});