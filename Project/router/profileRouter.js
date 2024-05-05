const { Router } = require('express');
const profileRouter = new Router();
const profileController = require('../controllers/profileController');


profileRouter
    .get('/', profileController.getProfile)
    .get('/finished', profileController.getFinishedCourses)
    .get('/inprocess', profileController.getInprocessCourses)
    .post('/updateStatus/:courseId', profileController.updateCourseStatus); 


module.exports = profileRouter;