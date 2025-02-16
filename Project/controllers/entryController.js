const { models } = require('../db/utils/db');
const nodemailer = require('nodemailer');

class EntryController {

    async getEntry(req, res) {
        try {
            const user = req.session.id;
            const id = req.query.courseId;
            if (!req.session.userId) {
                req.session.returnUrl = req.originalUrl;
                return res.status(401).redirect('/auth/login');
            }
            const admin = await models.Users.findByPk(req.session.userId);
            if(admin && admin.Role == 1){
                req.session.previousUrl = req.headers.referer;
                return res.status(400).render('./layouts/error.hbs', { layout: "error.hbs", errorMessage: 'Вы не можете записаться на курс' });
            }
            if(!admin){
                req.session.previousUrl = req.headers.referer;
                return res.status(400).render('./layouts/error.hbs', { layout: "error.hbs", errorMessage: 'Вы не можете записаться на курс' });
            }
            const data = await models.Statistics.findOne({
                where:{
                    user_id: req.session.userId,
                    course_id: id
                }, raw: true
            })

            if( data && data.status_id == 1){
                req.session.previousUrl = req.headers.referer;
                return res.status(400).render('./layouts/error.hbs', {
                    layout: "error.hbs",
                    errorMessage: `Вы не можете перезаписаться на курс, на который уже записаны`
                });
            }

            if( data && data.status_id == 3){
                req.session.previousUrl = req.headers.referer;
                return res.status(400).render('./layouts/error.hbs', {
                    layout: "error.hbs",
                    errorMessage: `Вы не можете перезаписаться на курс, который уже успешно прошли`
                });
            }
        

            if (data && data.course_status == 0) {
                // Проверка даты unblock_data
                const currentDate = new Date();
                const unblockDate = new Date(data.unblock_data);
    
                if (unblockDate > currentDate) {
                    // Если дата блокировки еще не прошла
                    req.session.previousUrl = req.headers.referer;
                    return res.status(400).render('./layouts/error.hbs', {
                        layout: "error.hbs",
                        errorMessage: `Вы не можете перезаписаться на курс до ${unblockDate.toLocaleDateString()}`
                    });
                } else {
                    // Если дата блокировки прошла, обновляем статус на 1
                    await models.Statistics.update(
                        { course_status: 1, status_id: 1 },
                        {
                            where: {
                                user_id: req.session.userId,
                                course_id: id
                            }
                        }
                    );
                }
            }
            if (id) {
                const user = await models.Users.findByPk(req.session.userId, { raw: true });
                const course = await models.Courses.findByPk(id, { include: [models.CourseTypes], raw: true });
                const courses = await models.Courses.findAll({ include: [models.CourseTypes], raw: true });
                res.status(200).render("./layouts/entry.hbs", { layout: "entry.hbs", course: course, courses: courses, user:user });
            }
            else{
                return res.redirect('/courses'); 
            }

        } catch (error) {
            console.error('Ошибка при получении курсов:', error);
            res.status(500).send('Произошла ошибка при получении курсов');
        }
    }

async addEntry(req, res) {
    try {
        const courseId = req.params.id;
        const { email } = req.body; 
        const admin = await models.Users.findByPk(req.session.userId);
        if(admin && admin.Role == 1){
            req.session.previousUrl = req.headers.referer;
            return res.render('./layouts/error.hbs', { layout: "error.hbs", errorMessage: 'Вы не можете записаться на курс' });
        }
        if(!admin){
            req.session.previousUrl = req.headers.referer;
            return res.render('./layouts/error.hbs', { layout: "error.hbs", errorMessage: 'Вы не можете записаться на курс' });
        }
        const existingEntry = await models.Statistics.findOne({
            where: {
                user_id: req.session.userId,
                course_id: courseId
            }
        });
        if ( existingEntry && existingEntry.course_status == 0) {
            return res.status(400).send('Вы уже были записаны на этот курс. Он недоступен');
        }
        if (existingEntry && existingEntry.unblock_data) {
            await models.Statistics.update(
                { course_status: 1, status_id: 1  },
                {
                    where: {
                        user_id: req.session.userId,
                        course_id: courseId
                    }
                }
            );
        }
        else{
            await models.Statistics.create({
            user_id: req.session.userId, 
            course_id: courseId,
            start_date: new Date(), 
            status_id: 1
        });}




        // Отправляем сообщение пользователю о записи на курс
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'typebooleanfalse@gmail.com',
                pass: 'jkds firs ahzr ardn'
            }
        });

        const mailOptions = {
            from: 'courseproject@gmail.com',
            to: email, // Используем email, указанный пользователем при записи
            subject: 'Вы успешно записались на курс',
            text: 'Спасибо за ваш выбор! Вы успешно записались на курс. В личном кабинете вы сможете пройти его'
        };

        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.error('Ошибка при отправке сообщения:', error);
            } else {
                console.log('Сообщение успешно отправлено:', info.response);
            }
        });

        res.render('./layouts/info.hbs', {layout: "info.hbs", message: 'Спасибо что записались на курс' });
           
        // res.redirect('/courses');
    } catch (error) {
        console.error('Ошибка при записи на курс:', error);
        res.status(500).send('Произошла ошибка при записи на курс');
    }
}

}


module.exports = new EntryController();