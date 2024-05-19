const Router = require("express");
const adminrouter = new Router();
const adminController = require('../controllers/adminController');

adminrouter
    .get('/', adminController.getAdminPage)
    .get('/users', adminController.getAllUsers)
    .get('/types', adminController.getAllTypes)
    .get('/courses', adminController.getCourses)
    .get('/videos', adminController.getVideos)
    .get('/tasks', adminController.getTasks)

    // Маршруты для операций с курсами 
    .get('/editcourse/:id', adminController.editCourseView)
    .get('/addcourse', adminController.addCourseView)
    .post('/addcourse', adminController.addCourse)
    .post('/updatecourse/:id', adminController.updateCourse)

    //типы
    .put('/editType/:id', adminController.editType)
    .post('/addType', adminController.addType)



    //удаление
    .delete('/deleteType/:id', adminController.deleteType)
    .delete('/deletecourse/:id', adminController.deleteCourse)
    .delete('/deleteUser/:id', adminController.deleteUser)
    .delete('/deleteVideo/:id', adminController.deleteVideo)
    .delete('/deleteTask/:id', adminController.deleteTask)
    .delete('/deleteAnswer/:id', adminController.deleteAnswer)


module.exports = adminrouter;
