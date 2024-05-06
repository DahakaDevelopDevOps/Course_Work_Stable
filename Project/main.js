const express = require('express');
const app = express();
const expressSession = require('express-session');
const http = require('http').Server(app); // Подключаем http-сервер к Express
const io = require('socket.io')(http); // Подключаем Socket.IO к http-серверу
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
        }
    }
});
const dotenv = require("dotenv").config();
const path = require('path'); // Добавим модуль path для работы с путями

const port = 3000;
const bodyParser = require('body-parser');
const router = require('./router/index');

if (process.env.NODE_ENV === "development") {
    const liveReaload = require('livereload');
    const connectLiveReload = require('connect-livereload');
    const liveReloadServer = liveReaload.createServer();
    liveReloadServer.watch(path.join(__dirname, 'views'));
    liveReloadServer.server.once("connection", () => {
        setTimeout(() => {
            liveReloadServer.refresh("/");
        }, 100);
    });
    app.use(connectLiveReload());
}
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

// Обработчик соединения с веб-сокетом
io.on('connection', (socket) => {
    console.log('a user connected');

    // Обработчик отключения клиента
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

// Заменяем app.listen() на http.listen() для использования http-сервера с веб-сокетами
http.listen(process.env.PORT || port, () => {
    console.log(`http://localhost:${port}`);
});
