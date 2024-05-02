const models = require('../db/models/initModels');
// const jwt = require('jsonwebtoken');
// const refreshKey = 'cats';
// const accessKey = 'cats';


class AuthController {
    getLoginPage(req, res) {
        res.render("./layouts/login.hbs", { layout: "login.hbs" });
    }

    getRegisterPage = (req, res, next) => {
        res.render("./layouts/registration.hbs", { layout: "registration.hbs" });
    }

    // refreshToken(req, res) {
    //     if (req.cookies.refreshToken) {
    //         jwt.verify(
    //             req.cookies.refreshToken,
    //             refreshKey,
    //             async (err, payload) => {
    //                 if (err) {
    //                     console.log(err.message);
    //                 } else if (payload) {
    //                     client.on('ready', () => console.log('ready'));
    //                     client.on('error', (err) => console.log(`error: ${err}`));
    //                     client.on('connect', () => console.log('connect'));
    //                     client.on('end', () => console.log('end'));
    //                     client.set(oldrefreshKeyCount, req.cookies.refreshToken, () =>
    //                         console.log('set old refresh token')
    //                     );
    //                     client.get(oldrefreshKeyCount, (err, result) =>
    //                         console.log('added old refresh token:', result)
    //                     );
    //                     oldrefreshKeyCount++;
    //                     client.quit();
    //                     const candidate = await UsersCASL.findOne({
    //                         where: {
    //                             id: payload.id,
    //                         },
    //                     });
    //                     const newAccessToken = jwt.sign(
    //                         {
    //                             id: candidate.id,
    //                             username: candidate.username,
    //                             role: candidate.role,
    //                         },
    //                         accessKey,
    //                         { expiresIn: 200 * 60 }
    //                     );
    //                     const newRefreshToken = jwt.sign(
    //                         {
    //                             id: candidate.id,
    //                             username: candidate.username,
    //                             role: candidate.role,
    //                         },
    //                         refreshKey,
    //                         { expiresIn: 24 * 60 * 60 }
    //                     );
    //                     res.cookie('accessToken', newAccessToken, {
    //                         httpOnly: true,
    //                         sameSite: 'strict',
    //                     });
    //                     res.cookie('refreshToken', newRefreshToken, {
    //                         path: '/refresh-token',
    //                     });
    //                     res.redirect('/resource');
    //                 }
    //             }
    //         );
    //     } else {
    //         res.status(401).send('[ERROR] 401: Unauthorized');
    //     }
    // }


    logout(req, res) {
        //res.clearCookie('accessToken');
       // res.clearCookie('refreshToken');
        //редирект на страницу, с которой перешел???
        //res.redirect('/');
    }


    async login(req, res) {
        // const candidate = await Users.findOne({
        //     where: {
        //         username: req.body.username,
        //         password: req.body.password,
        //     },
        // });
        // if (candidate) {
        //     const accessToken = jwt.sign(
        //         {
        //             id: candidate.id,
        //             username: candidate.username,
        //             role: candidate.role,
        //         },
        //         accessKey,
        //         { expiresIn: 10 * 60 }
        //     );

        //     const refreshToken = jwt.sign(
        //         {
        //             id: candidate.id,
        //             username: candidate.username,
        //             role: candidate.role,
        //         },
        //         refreshKey,
        //         { expiresIn: 24 * 60 * 60 }
        //     );
        //     res.cookie('accessToken', accessToken, {
        //         httpOnly: true,
        //         sameSite: 'strict',
        //     });
        //     res.cookie('refreshToken', refreshToken, {
        //         httpOnly: true,
        //         sameSite: 'strict',
        //     });
         //    }
        // else {
        //     res.redirect('/login');
        // }
        const { username, password } = req.body;
    
        try {
          const user = await Users.findOne({ where: { Login: username, Password: password } });
    
          if (!user) {
            return res.redirect('/register');
          }
          const redirectUrl = req.session.originalUrl || '/'; 

          res.redirect(redirectUrl);
        } catch (error) {
          console.error('Ошибка при аутентификации пользователя:', error);
          res.status(500).send('Произошла ошибка при попытке входа');
        }
      }


    async register(req, res) {
        const candidate = await Users.findOne({
            where: {
                username: req.body.username,
            },
        });
        if (candidate) {
            res.redirect('/register');
        } else {
            await Users.create({
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                role: 0,
            });
            res.redirect('/login');
        }
    }
}


module.exports = new AuthController();