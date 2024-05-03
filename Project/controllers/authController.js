const { models } = require('../db/utils/db');
const bcrypt = require('bcrypt');


class AuthController {
    getLoginPage(req, res) {
        res.render("./layouts/login.hbs", { layout: "login.hbs" });
    }

    getRegisterPage = (req, res, next) => {
        res.render("./layouts/registration.hbs", { layout: "registration.hbs" });
    }

    logout(req, res) {
        req.session.destroy();
        res.redirect('/');
    }


    async login(req, res) {
        const { username, password } = req.body;
        try {
            const user = await models.users.findOne({ where: { Login: username } });

            if (!user) {
                return res.redirect('/auth/register');
            }

            if (bcrypt.compareSync(password, user.Password)) {
                console.log('id: '+req.session.userId )
                req.session.userId = user.ID;
                if (user.Role === 1) { // Если роль пользователя 1 (админ)
                    res.redirect('/admin');
                } else {
                    res.redirect('/');
                }
            } else {
                res.status(401).send('Неверное имя пользователя или пароль');
            }
        } catch (error) {
            console.error('Ошибка при аутентификации пользователя:', error);
            res.status(500).send('Произошла ошибка при попытке входа');
        }
    }


    async register(req, res) {
        const { username, email, password } = req.body;
        const hashedPassword = bcrypt.hashSync(password, 10);
        const candidate = await models.users.findOne({
            where: {
                Login: username,
            },
        });
        if (candidate) {
            res.redirect('/auth/register');
        } else {
            await models.users.create({
                Login: username,
                Email: email,
                Password: hashedPassword,
                Role: 0,
            });
            res.redirect('/auth/login');
        }
    }
}


module.exports = new AuthController();