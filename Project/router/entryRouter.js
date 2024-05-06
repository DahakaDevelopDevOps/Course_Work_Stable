const { Router } = require('express');
const entryRouter = new Router();
const entryController = require('../controllers/entryController');


entryRouter
    .get('/', entryController.getEntry)
    //.get('/', entryController.getEntryForClass)
    .post('/submit/:id', entryController.addEntry)
    //.post('/submit', entryController.addEntry)
   

module.exports = entryRouter;