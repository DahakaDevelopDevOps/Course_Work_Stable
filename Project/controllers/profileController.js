const { models } = require('../db/utils/db');


class ProfileController {

    async getProfile(req, res) {
        if (!req.session.userId) {
            return res.render("./layouts/registration.hbs", { layout: "registration.hbs" });
        }
        try {
            const courses = await models.Statistics.findAll({
                where: { user_id: req.session.userId },
                include: [
                    {
                        model: models.Courses,
                        attributes: ['course_name']
                    }
                ],
                raw: true
            });

            res.render("./layouts/profile.hbs", { layout: "profile.hbs", courses: courses });
        } catch (error) {
            console.error('Ошибка при получении профиля:', error);
            res.status(500).send('Произошла ошибка при получении профиля');
        }
    }
    //на этой странице надо реализовать переход на 
    //заевршенные курсы и пройденные (просто 2 вкладки) если что пути до этого /profile/finished & /profile/inprocess
    // просто это в ссылку



    async getFinishedCourses(req, res) {
        try {
            const coursesWithDetails = await models.Statistics.findAll({ 
                where: { 
                    user_id: req.session.userId,
                    status_id: 1
                },
                include: [
                    {
                        model: models.Courses
                    }
                ],
                raw: true
            });
    
            const courses = coursesWithDetails.map(courseDetail => ({
                course_id: courseDetail.course_id,
                course_name: courseDetail['Course.course_name'],
                description: courseDetail['Course.description'],
                duration: courseDetail['Course.duration'],
                statistic_id: courseDetail.statistic_id,
                start_date: courseDetail.start_date,
                end_date: courseDetail.end_date
            }));
    
                res.render("./layouts/finishedcourses.hbs", { layout: "finishedcourses.hbs", courses: courses });
        } catch (error) {
            console.error('Ошибка при получении завершенных курсов:', error);
            res.status(500).send('Произошла ошибка при получении завершенных курсов');
        }
    }
    

    async getInprocessCourses(req, res) {
        try {
            const coursesWithDetails = await models.Statistics.findAll({ 
                where: { 
                    user_id: req.session.userId,
                    status_id: 2
                },
                include: [
                    {
                        model: models.Courses
                    }
                ],
                raw: true
            });
    
            const courses = coursesWithDetails.map(courseDetail => ({
                course_id: courseDetail.course_id,
                course_name: courseDetail['Course.course_name'],
                description: courseDetail['Course.description'],
                duration: courseDetail['Course.duration'],
                statistic_id: courseDetail.statistic_id,
                start_date: courseDetail.start_date,
                end_date: courseDetail.end_date
            }));
    
            console.log(courses);
    
            res.render("./layouts/inproccourses.hbs", { layout: "inproccourses.hbs", courses: courses });
    
        } catch (error) {
            console.error('Ошибка при получении курсов в процессе:', error);
            res.status(500).send('Произошла ошибка при получении завершенных курсов');
        }
    }
    

    async  updateCourseStatus(req, res) {
        const { courseId } = req.params;
        const { newStatus } = req.body;
    
        try {
            // Находим курс по courseId
            const course = await models.Statistics.findOne({ where: { course_id: courseId, user_id: req.session.userId } });
    
            if (!course) {
                return res.status(404).send('Курс не найден');
            }
    
            // Обновляем статус курса
            await course.update({ status_id: newStatus });
    
            res.status(200).send('Статус курса успешно обновлен');
        } catch (error) {
            console.error('Ошибка при обновлении статуса курса:', error);
            res.status(500).send('Произошла ошибка при обновлении статуса курса');
        }
    }


}


module.exports = new ProfileController();