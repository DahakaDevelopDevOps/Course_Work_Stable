const Router = require("express");
const adminrouter = new Router();
const adminController = require('../controllers/adminController');

adminrouter
    .get('/', adminController.getAdminPage)
    .get('/users', adminController.getAllUsers)
    .get('/types', adminController.getAllTypes)
    .get('/courses', adminController.getCourses)

    // // Маршруты для операций с типами
    // .get('/addtype', adminController.addTypeView)
    // .post('/addtype', adminController.addType)
    // .get('/updatetype', adminController.editTypeView)
    // .put('/updatetype', adminController.editType)
    // .delete('/deletetype', adminController.deleteType)

    // // Маршруты для операций с классами
    // .get('/addcourses', adminController.addCourseView)
    // .post('/addcourse', adminController.addCourse)
    // .get('/updatecourse', adminController.editCourseView)
    // .put('/updatecourse', adminController.editCourselass)
    // .delete('/deletecourse', adminController.deleteCourse)

    // // Маршруты для операций с пользователями
    // .get('/adduser', adminController.addUserView)
    // .post('/adduser', adminController.addUser)
    // .get('/updateuser', adminController.editUserView)
    // .put('/updateuser', adminController.editUser)
    // .delete('/deleteuser', adminController.deleteUser)


module.exports = adminrouter;
