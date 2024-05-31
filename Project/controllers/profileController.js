const { models } = require('../db/utils/db');


class ProfileController {

    async getProfile(req, res) {
        if (!req.session.userId) {
            return res.render("./layouts/registration.hbs", { layout: "registration.hbs" });
        }
        try {
            const admin = await models.Users.findByPk(req.session.userId);
        if(admin && admin.Role == 1){
            res.redirect('/admin');
        }
        if(!admin){
            req.session.previousUrl = req.headers.referer;
            return res.render('./layouts/error.hbs', { layout: "error.hbs", errorMessage: 'Нужен вход' });
        }
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
        if (!req.session.userId) {
            return res.render("./layouts/registration.hbs", { layout: "registration.hbs" });
        }
        try {
            const admin = await models.Users.findByPk(req.session.userId);
        if(admin && admin.Role == 1){
            res.redirect('/admin');
        }
        if(!admin){
            req.session.previousUrl = req.headers.referer;
            return res.render('./layouts/error.hbs', { layout: "error.hbs", errorMessage: 'Нужен вход' });
        }
            const coursesWithDetails = await models.Statistics.findAll({
                where: {
                    user_id: req.session.userId,
                    status_id: 5
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
        if (!req.session.userId) {
            return res.render("./layouts/registration.hbs", { layout: "registration.hbs" });
        }
        try {
            const admin = await models.Users.findByPk(req.session.userId);
            if(admin && admin.Role == 1){
                res.redirect('/admin');
            }
            if(!admin){
                req.session.previousUrl = req.headers.referer;
                return res.render('./layouts/error.hbs', { layout: "error.hbs", errorMessage: 'Нужен вход' });
            }
            const coursesWithDetails = await models.Statistics.findAll({
                where: {
                    user_id: req.session.userId,
                    status_id: 6
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

            res.render("./layouts/inproccourses.hbs", { layout: "inproccourses.hbs", courses: courses });

        } catch (error) {
            console.error('Ошибка при получении курсов в процессе:', error);
            res.status(500).send('Произошла ошибка при получении завершенных курсов');
        }
    }

    async getCourse(req, res) {
        try {  if (!req.session.userId) {
                return res.render("./layouts/registration.hbs", { layout: "registration.hbs" });
            }

            const admin = await models.Users.findByPk(req.session.userId);
        if(admin && admin.Role == 1){
            res.redirect('/admin');
        }
        if(!admin){
            req.session.previousUrl = req.headers.referer;
            return res.render('./layouts/error.hbs', { layout: "error.hbs", errorMessage: 'Нужен вход' });
        }
            const { courseId } = req.params;
          
            const videous = await models.Videos.findAll({ where: { course_id: courseId } });
            if (videous.length < 1) {
                req.session.previousUrl = req.headers.referer;
                return res.render('./layouts/error.hbs', { layout: "error.hbs", errorMessage: 'Извиняемся, пока курс в доработке' });
            }
            const videosWithUrls = videous.map(video => {
                const base64Video = video.video_content.toString('base64');
                return {
                    ...video,
                    video_url: `data:video/mp4;base64,${base64Video}`
                };
            });

            const tasksDetails = await models.Tasks.findAll({
                where: { course_id: courseId },
                include: { model: models.Answers }
            });

            if (tasksDetails.length < 1) {
                req.session.previousUrl = req.headers.referer;
                return res.render('./layouts/error.hbs', { layout: "error.hbs", errorMessage: 'Извиняемся, пока курс в доработке' });
            }

            const tasks = tasksDetails.map(detail => {
                return {
                    test_id: detail.test_id,
                    course_id: detail.course_id,
                    question_text: detail.question_text,
                    answers: detail.Answers.map(answer => ({
                        answer_id: answer.answer_id,
                        answer_text: answer.answer_text,
                        is_correct: answer.is_correct
                    }))
                };
            });
            res.render("./layouts/exstensionCourse.hbs", { layout: "exstensionCourse.hbs", tasks: tasks, videous: videosWithUrls  });
        } catch (error) {
            console.error('Ошибка при получении курсов в процессе:', error.message);
            res.status(500).send('Произошла ошибка при получении курсов в процессе');
        }
    }

    async updateCourseStatus(req, res) {
        const { courseId } = req.params;
        if (!req.session.userId) {
            return res.render("./layouts/registration.hbs", { layout: "registration.hbs" });
        }

        try {
            const admin = await models.Users.findByPk(req.session.userId);
        if(admin && admin.Role == 1){
            res.redirect('/admin');
        }
        if(!admin){
            req.session.previousUrl = req.headers.referer;
            return res.render('./layouts/error.hbs', { layout: "error.hbs", errorMessage: 'Нужен вход' });
        }
            const course = await models.Statistics.findOne({ where: { course_id: courseId, user_id: req.session.userId } });

            if (!course) {
                req.session.previousUrl = req.headers.referer;
                return res.render('./layouts/error.hbs', { layout: "error.hbs", errorMessage: 'Курс не найден' });    
            }
            await course.update({ status_id: 5, end_date: new Date() });

            res.redirect('/profile');
        } catch (error) {
            console.error('Ошибка при обновлении статуса курса:', error);
            res.status(500).send('Произошла ошибка при обновлении статуса курса');
        }
    }

    async submitAnswers(req, res) {
        try {
            const admin = await models.Users.findByPk(req.session.userId);
        if(admin && admin.Role == 1){
            res.redirect('/admin');
        }
        if(!admin){
            req.session.previousUrl = req.headers.referer;
            return res.render('./layouts/error.hbs', { layout: "error.hbs", errorMessage: 'Нужен вход' });
        }
            const { body } = req; // Получаем тело запроса, которое содержит ответы пользователя
            const userAnswers = Object.entries(body) // Преобразуем ответы пользователя в массив пар [questionId, answerId]
                .filter(([key, value]) => key.startsWith('answer')) // Отфильтровываем только ответы
                .map(([key, value]) => ({ // Преобразуем в объекты { questionId, answerId }
                    questionId: parseInt(key.replace('answer', '')),
                    answerId: parseInt(value)
                }));

            const results = await Promise.all(userAnswers.map(async ({ questionId, answerId }) => {
                const task = await models.Tasks.findByPk(questionId, { include: models.Answers });
                const correctAnswer = task.Answers.find(answer => answer.answer_id === answerId);
                return { questionId, isCorrect: correctAnswer.is_correct };
            }));

            res.json(results);
        } catch (error) {
            console.error('Ошибка при проверке ответов:', error);
            res.status(500).send('Произошла ошибка при проверке ответов пользователя');
        }
    }


}


module.exports = new ProfileController();