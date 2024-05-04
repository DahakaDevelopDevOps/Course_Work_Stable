const { Router } = require('express');
const coursesRouter = new Router();
const coursesController = require('../controllers/coursesController');


coursesRouter
    .get('/', coursesController.getAllCourses)
    .get('/:id', coursesController.getOneCourse)
    //.post('/:id', coursesController.addCourseIn)
    // .post('/', classesController.createClass)
    // .put('/:id', classesController.updateClass)
    // .delete('/:id', classesController.deleteClass);
   

module.exports = coursesRouter;