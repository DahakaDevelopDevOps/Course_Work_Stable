const express = require('express');
const app = express();
const hbs = require('express-handlebars').create({
    extname: '.hbs',
    helpers: {
        goBack: () => 'window.location.href = \'/\''
    }
});
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

app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use('/', router);

app.listen(process.env.PORT || port, () => {
    console.log(`http://localhost:${port}`);
});
