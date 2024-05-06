const { models } = require('../db/utils/db');


class EntryController {

    async getEntry(req, res) {
        try {
            const user = req.session.id;
            console.log(user)
            const id = req.query.courseId;
            if (!req.session.userId) {
                req.session.returnUrl = req.originalUrl;
                return res.redirect('/auth/login');
            }
            if (id) {
                const user = await models.Users.findByPk(req.session.userId, { raw: true });
                const course = await models.Courses.findByPk(id, { include: [models.CourseTypes], raw: true });
                const courses = await models.Courses.findAll({ include: [models.CourseTypes], raw: true });
                res.render("./layouts/entry.hbs", { layout: "entry.hbs", course: course, courses: courses, user:user });
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
    
            const existingEntry = await models.Statistics.findOne({
                where: {
                    user_id: req.session.userId,
                    course_id: courseId
                }
            });
            if (existingEntry) {
                return res.status(400).send('Вы уже записаны на этот курс');
            }
    
            const newEntry = await models.Statistics.create({
                user_id: req.session.userId, 
                course_id: courseId,
                start_date: new Date(), 
                status_id: 2, 
            });
    
            res.redirect('/courses');
        } catch (error) {
            // В случае ошибки возвращаем статус 500 и сообщение об ошибке
            console.error('Ошибка при записи на курс:', error);
            res.status(500).send('Произошла ошибка при записи на курс');
        }
    }
    

}


module.exports = new EntryController();