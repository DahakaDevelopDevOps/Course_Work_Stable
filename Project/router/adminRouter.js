const Router = require("express");
const adminrouter = new Router();
const upload = require('./upload');
const adminController = require('../controllers/adminController');

adminrouter
    .get('/', adminController.getAdminPage)
    .get('/users', adminController.getAllUsers)
    .get('/types', adminController.getAllTypes)
    .get('/courses', adminController.getCourses)
    .get('/videos', adminController.getVideos)
    .get('/tasks', adminController.getTasks)
    .get('/create/question', adminController.createQuestion)
    .post('/create/question', adminController.handleCreateQuestion)


    // Маршруты для операций с курсами 
    .get('/editcourse/:id', adminController.editCourseView)
    .get('/addcourse', adminController.addCourseView)
    .post('/addcourse', adminController.addCourse)
    .post('/updatecourse/:id', adminController.updateCourse)

    //типы
    .put('/editType/:type_id', adminController.updateType)
    .post('/addType', adminController.addType)


    //удаление
    .delete('/deleteType/:id', adminController.deleteType)
    .delete('/deletecourse/:id', adminController.deleteCourse)
    .delete('/deleteUser/:id', adminController.deleteUser)
    .delete('/deleteVideo/:id', adminController.deleteVideo)
    .delete('/delete/test/:id', adminController.deleteTask)
    .delete('/deleteAnswer/:id', adminController.deleteAnswer)

    //видео
    .post('/upload-video', upload.single('video'), adminController.uploadVideo)
    .post('/delete-video/:id', adminController.deleteVideo);

module.exports = adminrouter;
