const Router = require("express");
const adminrouter = new Router();
const adminController = require('../controllers/adminController');

adminrouter
    .get('/', adminController.getAdminPage)
    .get('/users', adminController.getAllUsers)
    .get('/types', adminController.getAllTypes)
    .get('/courses', adminController.getCourses)

    // // Маршруты для операций с типами
    // .get('/type/:id', adminController.getOneType)
    // .post('/addtype', adminController.addType)
    // .get('/updatetype', adminController.editTypeView)
    // .put('/updatetype', adminController.editType)
    // .delete('/deletetype', adminController.deleteType)

    // // Маршруты для операций с курсами 
    .get('/editcourse/:courseId', adminController.editCourseView)
    // .post('/addcourse', adminController.addCourse)
    // .get('/updatecourse', adminController.editCourseView)
    // .put('/updatecourse', adminController.editCourselass)
    .delete('/deletecourse/:courseId', adminController.deleteCourse)


module.exports = adminrouter;
