const fs = require('fs');
const express = require('express');
const http = require('http');
const https = require('https');
const expressSession = require('express-session');
const bodyParser = require('body-parser');
const router = require('./router/index');
const path = require('path');
const hbs = require('express-handlebars').create({
    extname: '.hbs',
    helpers: {
        goBack: () => 'window.location.href = \'/\'',
        formatDate: function(timeString) {
            const date = new Date(timeString);
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');
            return `${hours}:${minutes}:${seconds}`;
        },
        base64Encode: function (data) {
            if (data == null) {
                return '';  // или какое-то значение по умолчанию, например, пустая строка
            }
            return Buffer.from(data).toString('base64');
        }
    }
});
const dotenv = require("dotenv").config();

const app = express();
const port = 3000;

// Express configuration
app.use(expressSession({
    secret: 'SECRET',
    resave: false,
    saveUninitialized: false
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use('/', router);

// HTTP Server
const httpServer = http.createServer(app);

// HTTPS Server
const privateKey = fs.readFileSync('sslcert/server.key', 'utf8');
const certificate = fs.readFileSync('sslcert/server.crt', 'utf8');
const credentials = { key: privateKey, cert: certificate };
const httpsServer = https.createServer(credentials, app);

// Обработчик соединения с веб-сокетом
const io = require('socket.io')(httpServer); // Используем httpServer для Socket.IO
io.on('connection', (socket) => {
    console.log('a user connected');

    // Обработчик отключения клиента
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

// Запуск серверов
httpServer.listen(port, () => {
    console.log(`HTTP Server running on http://localhost:${port}`);
});

httpsServer.listen(8443, () => {
    console.log('HTTPS Server running on https://localhost:8443');
});
