const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const app = express();

app.use(cors());
app.use(bodyParser.json());

const db = knex({
    client: 'pg',
    connection: {
        host: 'localhost',
        user: '',
        password: '',
        database: 'smartbrain'
    }
});

app.get('/', (req, res) => {
    res.send('Connected!');
});

app.post('/signin', signin.handleSignin(db, bcrypt))
app.post('/register', register.handleRegister(db, bcrypt))
app.get('/profile/:id', profile.handleProfileGet(db))
app.put('/image', image.handleImage(db))

app.listen(3001, () => {
    console.log('App is running on port 3001!');
})