const { Router } = require('express');
const authRouter = new Router();
const authController = require('../controllers/authController');


authRouter
    .get('/login', authController.getLoginPage)
    .get('/register', authController.getRegisterPage)
    .post('/login', authController.login)
    .post('/register', authController.register)
    .get('/logout', authController.logout);

    
module.exports = authRouter;