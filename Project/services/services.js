const express = require('express');
const bodyParser = require('body-parser');
const { models } = require('../db/models/initModels');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');


const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/registration.hbs');
});

app.post('/register', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        const existingUser = await models.User.findOne({ where: { username: username } });

        if (existingUser) {
            return res.redirect('/register');
        }
        await models.User.create({ username: username, password: password });
        res.redirect('/login');
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).send('Error during registration');
    }
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/login.hbs');
});

app.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        const user = await models.User.findOne({ where: { username: username, password: password } });

        if (user) {
            if (user.role === 1) {
                res.redirect('/admin');
            } else {
                res.redirect('/');
            }
        } else {
            res.redirect('/login');
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Error during login');
    }

    const accessToken = jwt.sign({ username: user.username }, 'access_secret', { expiresIn: '10m' });
    const refreshToken = jwt.sign({ username: user.username }, 'refresh_secret', { expiresIn: '24h' });

    res.cookie('access_token', accessToken, {
        httpOnly: true, sameSite: 'Strict'
    });

    res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        sameSite: 'Strict',
        path: '/refresh-token'
    });
});

app.get('/logout', (req, res) => {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    return res.sendStatus(200);
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
