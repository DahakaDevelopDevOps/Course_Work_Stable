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
    getStatus(req, res) {
        const isAuthenticated = req.session.userId !== undefined;
        res.json({ isAuthenticated: isAuthenticated });
    }


   // В методе login
async login(req, res) {
    const { username, password } = req.body;
    try {
        const user = await models.Users.findOne({ where: { Login: username } });

        if (!user) {
            req.session.returnUrl = '/auth/register'; // Сохраняем URL регистрации в сессии
            return res.redirect('/auth/register');
        }

        if (bcrypt.compareSync(password, user.Password)) {
            req.session.userId = user.ID;
            const returnUrl = req.session.returnUrl || '/'; // Получаем сохраненный URL или используем корневой URL
            delete req.session.returnUrl; // Очищаем сохраненный URL
            if (user.Role === 1) { // Если роль пользователя 1 (админ)
                res.redirect('/admin');
            } else {
                res.redirect(returnUrl); // Перенаправляем пользователя обратно на сохраненный URL
            }
        } else {
            res.status(401).send('Неверное имя пользователя или пароль');
        }
    } catch (error) {
        console.error('Ошибка при аутентификации пользователя:', error);
        res.status(500).send('Произошла ошибка при попытке входа');
    }
}

// В методе register
async register(req, res) {
    const { username, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const candidate = await models.Users.findOne({
        where: {
            Login: username,
        },
    });
    if (candidate) {
        req.session.returnUrl = '/auth/register'; // Сохраняем URL регистрации в сессии
        res.redirect('/auth/register');
    } else {
        await models.Users.create({
            Login: username,
            Email: email,
            Password: hashedPassword,
            Role: 0,
        });
        req.session.returnUrl = '/auth/login'; // Сохраняем URL входа в сессии
        res.redirect('/auth/login');
    }
}

}


module.exports = new AuthController();