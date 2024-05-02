const { Router } = require('express');
const authRouter = new Router();
const authController = require('../controllers/authController');


authRouter
    .get('/login', authController.getLoginPage)
    .get('/register', authController.getRegisterPage)
    //.post('/login', authController.login)
    .post('/', authController.register)
    //.get('/refresh-token', authController.refreshToken)//надо что-то с этим делать, например, чтобы повторно заходил
    .get('/', authController.logout);

    
module.exports = authRouter;