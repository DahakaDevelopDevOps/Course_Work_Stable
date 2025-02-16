const { models } = require('../db/utils/db');
const { Op } = require('sequelize');

class ProfileController {

    async getProfile(req, res) {
        if (!req.session.userId) {
            return res.status(401).render("./layouts/registration.hbs", { layout: "registration.hbs" });
        }
        try {
            const admin = await models.Users.findByPk(req.session.userId);
        if(admin && admin.Role == 1){
            res.status(400).redirect('/admin');
        }
        if(!admin){
            req.session.previousUrl = req.headers.referer;
            return res.status(400).render('./layouts/error.hbs', { layout: "error.hbs", errorMessage: 'Нужен вход' });
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
 
            res.status(200).render("./layouts/profile.hbs", { layout: "profile.hbs", courses: courses, user:admin.Login, email:admin.Email   });
        } catch (error) {
            console.error('Ошибка при получении профиля:', error);
            res.status(500).send('Произошла ошибка при получении профиля');
        }
    }

    async getFinishedCourses(req, res) {
        if (!req.session.userId) {
            return res.status(401).render("./layouts/registration.hbs", { layout: "registration.hbs" });
        }
        try {
            const admin = await models.Users.findByPk(req.session.userId);
        if(admin && admin.Role == 1){
            res.status(400).redirect('/admin');
        }
        if(!admin){
            req.session.previousUrl = req.headers.referer;
            return res.status(400).render('./layouts/error.hbs', { layout: "error.hbs", errorMessage: 'Нужен вход' });
        }

            const coursesWithDetails = await models.Statistics.findAll({
                where: {
                    user_id: req.session.userId,
                    status_id: {
                        [Op.in]: [2, 3]  
                    }
                },
                include: [
                    {
                        model: models.Courses
                    }
                ],
                raw: true
            });

            console.log(coursesWithDetails)

            const courses = coursesWithDetails.map(courseDetail => ({
                course_id: courseDetail.course_id,
                course_name: courseDetail['Course.course_name'],
                description: courseDetail['Course.description'],
                duration: courseDetail['Course.duration'],
                statistic_id: courseDetail.statistic_id,
                start_date: courseDetail.start_date,
                end_date: courseDetail.end_date,
                percent_success: courseDetail.percent_success,
                unblock_data: courseDetail.unblock_data
            }));

            res.status(200).render("./layouts/finishedcourses.hbs", { layout: "finishedcourses.hbs", courses: courses });
        } catch (error) {
            console.error('Ошибка при получении завершенных курсов:', error);
            res.status(500).send('Произошла ошибка при получении завершенных курсов');
        }
    }


    async getInprocessCourses(req, res) {
        if (!req.session.userId) {
            return res.status(401).render("./layouts/registration.hbs", { layout: "registration.hbs" });
        }
        try {
            const admin = await models.Users.findByPk(req.session.userId);
            if(admin && admin.Role == 1){
                res.redirect('/admin');
            }
            if(!admin){
                req.session.previousUrl = req.headers.referer;
                return res.status(400).render('./layouts/error.hbs', { layout: "error.hbs", errorMessage: 'Нужен вход' });
            }

            const coursesWithDetails = await models.Statistics.findAll({
                where: {
                    user_id: req.session.userId,
                    status_id: 1 // в процессе
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

            res.status(200).render("./layouts/inproccourses.hbs", { layout: "inproccourses.hbs", courses: courses });

        } catch (error) {
            console.error('Ошибка при получении курсов в процессе:', error);
            res.status(500).send('Произошла ошибка при получении завершенных курсов');
        }
    }

    async getCourse(req, res) {
        try {  if (!req.session.userId) {
                return res.status(401).render("./layouts/registration.hbs", { layout: "registration.hbs" });
            }

            const admin = await models.Users.findByPk(req.session.userId);
        if(admin && admin.Role == 1){
            res.status(200).redirect('/admin');
        }
        if(!admin){
            req.session.previousUrl = req.headers.referer;
            return res.status(401).render('./layouts/error.hbs', { layout: "error.hbs", errorMessage: 'Нужен вход' });
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

            const courseRes = await models.Courses.findByPk(courseId);

            const materialsDetails = await models.Materials.findAll({
                where: { course_id: courseId },
                include: { model: models.Courses },
                order: [['range', 'ASC']] // Сортировка по возрастанию
            });

            if (tasksDetails.length < 1) {
                req.session.previousUrl = req.headers.referer;
                return res.status(400).render('./layouts/error.hbs', { layout: "error.hbs", errorMessage: 'Извиняемся, пока курс в доработке' });
            }

            
 // Ограничение количества вопросов
 const course = await models.Courses.findByPk(courseId);
 const questionsToShow = course.questions_to_show || tasksDetails.length; // Если questions_to_show не задан, показываем все вопросы
 const limitedTasks = tasksDetails.slice(0, questionsToShow);

 if (limitedTasks.length < 1) {
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

            const materials = materialsDetails.map(detail => {
                return {
                    material_id: detail.material_id,
                    course_id: detail.course_id,
                    title: detail.title,
                    range: detail.range,
                    text: detail.text
                };
            });
            res.status(200).render("./layouts/exstensionCourse.hbs", { layout: "exstensionCourse.hbs", tasks: tasks, videous: videosWithUrls, courseId, materials:materials, pass_threshold: courseRes.pass_threshold, questions_to_show: courseRes.questions_to_show});
        } catch (error) {
            console.error('Ошибка при получении курсов в процессе:', error.message);
            res.status(500).send('Произошла ошибка при получении курсов в процессе');
        }
    }

    async updateCourseStatus(req, res) {
        const { courseId } = req.params;
        const { status_id, course_status, percent_success } = req.body;

        if (!req.session.userId) {
            return res.status(401).render("./layouts/registration.hbs", { layout: "registration.hbs" });
        }

        try {
            const admin = await models.Users.findByPk(req.session.userId);
        if(admin && admin.Role == 1){
            res.status(200).redirect('/admin');
        }
        if(!admin){
            req.session.previousUrl = req.headers.referer;
            return res.status(400).render('./layouts/error.hbs', { layout: "error.hbs", errorMessage: 'Нужен вход' });
        }
            const course = await models.Statistics.findOne({ where: { course_id: courseId, user_id: req.session.userId } });

            const courseCourse = await models.Courses.findByPk(courseId)
            let statusForUser = (courseCourse.pass_threshold <= percent_success) ? 3 : 2;
            if (!course) {
                req.session.previousUrl = req.headers.referer;
                return res.status(404).render('./layouts/error.hbs', { layout: "error.hbs", errorMessage: 'Курс не найден' });    
            }
            const today = new Date()
            const avData = today.setDate(today.getDate() + courseCourse.lock_days)
            await course.update({ status_id: statusForUser, percent_success: percent_success, end_date: new Date(), course_status:0, unblock_data: avData});

            res.status(200).redirect('/profile');
        } catch (error) {
            console.error('Ошибка при обновлении статуса курса:', error);
            res.status(500).send('Произошла ошибка при обновлении статуса курса');
        }
    }

    async submitAnswers(req, res) {
        try {
            const admin = await models.Users.findByPk(req.session.userId);
        if(admin && admin.Role == 1){
            res.status(300).redirect('/admin');
        }
        if(!admin){
            req.session.previousUrl = req.headers.referer;
            return res.status(401).render('./layouts/error.hbs', { layout: "error.hbs", errorMessage: 'Нужен вход' });
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

            res.status(200).json(results);
        } catch (error) {
            console.error('Ошибка при проверке ответов:', error);
            res.status(500).send('Произошла ошибка при проверке ответов пользователя');
        }
    }


}


module.exports = new ProfileController();