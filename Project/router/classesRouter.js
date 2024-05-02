const { Router } = require('express');
const classesRouter = new Router();
const classesController = require('../controllers/classesController');


classesRouter
    .get('/', classesController.getAllClasess)
    .get('/:id', classesController.getOneClass)
    .post('/', classesController.createClass)
    .put('/:id', classesController.updateClass)
    .delete('/:id', classesController.deleteClass);
   

module.exports = classesRouter;