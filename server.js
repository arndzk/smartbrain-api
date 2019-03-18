const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const db = knex({
    client: 'pg',
    connection: {
        host: 'localhost',
        user: '',
        password: '',
        database: 'smartbrain'
    }
});

db.select('*').from('users').then(data => {
    console.log(data);
});

const app = express();

app.use(cors());
app.use(bodyParser.json());

/* const database = {
    users: [
        {
            id: '123',
            name: 'john',
            email: 'johndoe@gmail.com',
            password: 'bananas',
            entries: 0,
            joined: new Date()
        },
        {
            id: '456',
            name: 'jane',
            email: 'janedoe@gmail.com',
            password: 'kiwis',
            entries: 0,
            joined: new Date()
        }
    ],
    login: [
        {
            id: '987',
            has: '',
            email: 'johndoe@gmail.com'
        }
    ]
} */

app.get('/', (req, res) => {
    res.send('Connected!');
});

app.post('/signin', (req, res) => {
    if (req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password) {
        res.json(database.users[0]);
    } else {
        res.status(400).json('Error!');
    }
})

app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    bcrypt.hash(password, null, null, function(err, hash) {
        console.log('Password Encrypted!');
    });
    db('users')
        .returning('*')
        .insert({
            email: email,
            name: name,
            joined: new Date()
    }).then(user => {
        res.json(user[0]);
    })
    .catch(err => res.status(400).json('Unable to Register!'))
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    db.select('*').from('users').where({id}).then(user => {
        if(user.length) {
            res.json(user[0])
        } else {
            res.status(400).json('User not found!')
        }
    })
    .catch(err => res.status(400).json('Error Getting User!'))
})

app.put('/image', (req, res) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0])
    })
    .catch(err => res.status(400).json('Error Getting Entries!'))
})

/* bcrypt.hash("bacon", null, null, function(err, hash) {
    // Store hash in your password DB.
});

// Load hash from your password DB.
bcrypt.compare("bacon", hash, function(err, res) {
    // res == true
});
bcrypt.compare("veggies", hash, function(err, res) {
    // res = false
}); */

app.listen(3001, () => {
    console.log('App is running on port 3001!');
})