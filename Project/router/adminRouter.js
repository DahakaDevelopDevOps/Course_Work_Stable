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
    .get('/editcourse/:id', adminController.editCourseView)
    .get('/addcourse', adminController.addCourseView)
    .post('/addcourse', adminController.addCourse)
    .post('/updatecourse/:id', adminController.updateCourse)
    .delete('/deletecourse/:id', adminController.deleteCourse)


module.exports = adminrouter;
