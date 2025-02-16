const { where } = require('sequelize');
const { models } = require('../db/utils/db');
const answers = require('../db/models/answers');
const { Op } = require('sequelize');
const { raw } = require('express');
const base64Encode = (data) => {
    if (!data) return '';
    return Buffer.from(data).toString('base64');
};

// Функция для проверки роли администратора
async function isAdmin(req, res, next) {
    const id = req.session.userId;
    if (id) {
        const user = await models.Users.findByPk(id, { raw: true });
        if (user && user.Role === 1) {
            next(); // Продолжаем выполнение следующего middleware'а или обработчика маршрута
        } else {
            req.session.previousUrl = req.headers.referer;
            return res.status(400).render('./layouts/error.hbs', { layout: "error.hbs", errorMessage: 'Ты не админ!!!' });
        }
    } else {
        req.session.previousUrl = req.headers.referer;
        return res.status(401).render('./layouts/error.hbs', { layout: "error.hbs", errorMessage: 'Не зарегистрирован' });
    }
}

class AdminController {

    async getAdminPage(req, res) {
        try {
            await isAdmin(req, res, async () => {
                const { courseName } = req.query; // Получаем параметр фильтра
                const tasksDetails = await models.Tasks.findAll({
                    include: [
                        {
                            model: models.Courses,
                            where: courseName ? { course_name: courseName } : {} // Фильтр по названию курса
                        },
                        {
                            model: models.Answers
                        }
                    ]
                });
            
                if (!tasksDetails) {
                    req.session.previousUrl = req.headers.referer;
                    return res.status(404).render('./layouts/error.hbs', { layout: "error.hbs", errorMessage: 'Нет теста' });
                }
            
                // Маппинг данных
                const tasks = tasksDetails.map(detail => {
                    return {
                        test_id: detail.test_id,
                        course_id: detail.course_id,
                        question_text: detail.question_text,
                        course: { // Добавляем информацию о курсе
                            course_id: detail.Course.course_id,
                            course_name: detail.Course.course_name,
                            description: detail.Course.description,
                            duration: detail.Course.duration,
                            course_type_id: detail.Course.course_type_id,
                            other_details: detail.Course.other_details
                        },
                        answers: detail.Answers.map(answer => ({ // Маппинг ответов
                            answer_id: answer.answer_id,
                            answer_text: answer.answer_text,
                            is_correct: answer.is_correct
                        }))
                    };
                });
                const courses = await models.Courses.findAll({
                    attributes: ['course_id', 'course_name'],
                    raw: true
                });
            
            
                // Отправляем данные в шаблон
                res.status(200).render("./layouts/admin.hbs", { layout: "admin.hbs", tests: tasks, courses: courses });
            });
        } catch (error) {
            console.error('Ошибка при проверке роли администратора:', error);
            res.status(500).send('Произошла ошибка при проверке роли администратора');
        }
    }

    async getAllUsers(req, res) {
        try {
            await isAdmin(req, res, async () => {
                const users = await models.Users.findAll({ raw: true });
                res.status(200).render("./layouts/users.hbs", { layout: "users.hbs", users: users });
            });
        } catch (error) {
            console.error('Ошибка при получении пользователей:', error);
            res.status(500).send('Произошла ошибка при получении пользователей');
        }
    }

    async getAllTypes(req, res) {
        try {
            await isAdmin(req, res, async () => {
                const types = await models.CourseTypes.findAll({ raw: true });
                res.status(200).render("./layouts/types.hbs", { layout: "types.hbs", types: types });
            });
        } catch (error) {
            console.error('Ошибка при получении расписания:', error);
            res.status(500).send('Произошла ошибка при получении расписания');
        }
    }

    // материал
    async getMaterial(req, res) {
        try {
            await isAdmin(req, res, async () => {

                const material = await models.Materials.findByPk(req.params.id, {
                    include: [{
                        model: models.Courses,
                        attributes: ['course_name']
                    }]
                });
                if (!material) {
                    return res.status(404).json({ error: 'Глава не найдена' });
                }
                res.json(material);
            });
        } catch (error) {
            console.error('Ошибка при получении расписания:', error);
            res.status(500).send('Произошла ошибка при получении расписания');
        }
    }

    async getCourses(req, res) {
        try {
            await isAdmin(req, res, async () => {
                const courses = await models.Courses.findAll({ include: [models.CourseTypes], raw: true });
                res.status(200).render("./layouts/courseUpdating.hbs", { layout: "courseUpdating.hbs", courses: courses });
            });
        } catch (error) {
            console.error('Ошибка при получении записей на курсы:', error);
            res.status(500).send('Произошла ошибка при получении записей на курсы');
        }
    }
    async getVideos(req, res) {
        try {
            await isAdmin(req, res, async () => {
                // Получаем курсы
                const courses = await models.Courses.findAll({
                    include: [models.CourseTypes],
                    raw: true
                });
    
                // Получаем видео с информацией о курсах
                const videos = await models.Videos.findAll({
                    include: [{ model: models.Courses }],
                    raw: true
                });
    
                // Преобразуем данные
                const formattedVideos = videos.map(video => {
                    // Преобразуем BLOB в base64 (если видео небольшое)
                    const base64Video = video.video_content.toString('base64');
                    const videoUrl = `data:video/mp4;base64,${base64Video}`;
    
                    // Форматируем данные
                    return {
                        VideoId: video.video_id,
                        CourseId: video.course_id,
                        VideoDescription: video.video_description,
                        VideoUrl: videoUrl,
                        Course: {
                            CourseId: video['Course.course_id'],
                            CourseName: video['Course.course_name'],
                            Description: video['Course.description'],
                            Duration: video['Course.duration'],
                            CourseTypeId: video['Course.course_type_id'],
                            OtherDetails: video['Course.other_details']
                        }
                    };
                });
    
                // Отправляем данные в шаблон
                res.status(200).render("./layouts/videos.hbs", {
                    layout: "videos.hbs",
                    videos: formattedVideos,
                    courses: courses
                });
            });
        } catch (error) {
            console.error('Ошибка при получении записей на курсы:', error);
            res.status(500).send('Произошла ошибка при получении записей на курсы');
        }
    }
    async getTasks(req, res) {
        try {
            await isAdmin(req, res, async () => {
                const courses = await models.Courses.findAll({ include: [models.CourseTypes], raw: true });
                res.status(200).render("./layouts/tests.hbs", { layout: "tests.hbs", courses: courses });
            });
        } catch (error) {
            console.error('Ошибка при получении записей на курсы:', error);
            res.status(500).send('Произошла ошибка при получении записей на курсы');
        }
    }

    async editType(req, res) {
        try {
            await isAdmin(req, res, async () => {
                const { id } = req.params;
                const { type_name, description, other_details } = req.body;
                const type = await models.types.findByPk(id);
                if (!type) {
                    req.session.previousUrl = req.headers.referer;
                    return res.status(400).render('./layouts/error.hbs', { layout: "error.hbs", errorMessage: 'Тип не найден' });
                }
                await type.update({
                    type_name: type_name,
                    description: description,
                    other_details: other_details
                });
                res.status(200).send('Информация о типе успешно обновлена');
            });
        } catch (error) {
            console.error('Ошибка при обновлении типа:', error);
            res.status(500).send('Произошла ошибка при обновлении типа');
        }
    }

    async deleteType(req, res) {
        try {
            await isAdmin(req, res, async () => {
                const { id } = req.params;
                const type = await models.types.findByPk(id);
                if (!type) {
                    req.session.previousUrl = req.headers.referer;
                    return res.status(400).render('./layouts/error.hbs', { layout: "error.hbs", errorMessage: 'Тип не найден' });
                }
                await type.destroy();
                res.status(200).send('Тип успешно удален');
            });
        } catch (error) {
            console.error('Ошибка при удалении типа:', error);
            res.status(500).send('Произошла ошибка при удалении типа');
        }
    }

    async addCourseView(req, res) {
        try {
            await isAdmin(req, res, async () => {
                const types = await models.CourseTypes.findAll({ raw: true });
                res.status(200).render("./layouts/addcourse.hbs", { layout: "addcourse.hbs", types: types });
            });
        } catch (error) {
            console.error('Ошибка при добавлении класса:', error);
            res.status(500).send('Произошла ошибка при добавлении класса');
        }
    }

    async addCourse(req, res) {
        try {
            await isAdmin(req, res, async () => {
                const { courseName, description, details, duration, courseType, questionsToShow, pass_threshold, lock_days } = req.body;
    
                // Проверка обязательных полей
                if (!courseName || !description || !pass_threshold || !lock_days) {
                    req.session.previousUrl = req.headers.referer;
                    return res.status(400).render('./layouts/error.hbs', {
                        layout: "error.hbs",
                        errorMessage: 'Не все обязательные поля заполнены'
                    });
                }
    
                // Проверка, что duration является числом
                if (isNaN(duration)) {
                    req.session.previousUrl = req.headers.referer;
                    return res.status(400).render('./layouts/error.hbs', {
                        layout: "error.hbs",
                        errorMessage: 'Продолжительность должна быть числом'
                    });
                }


                if (isNaN(lock_days) || lock_days < 0 || lock_days > 7) {
                    req.session.previousUrl = req.headers.referer;
                    return res.status(400).render('./layouts/error.hbs', {
                        layout: "error.hbs",
                        errorMessage: 'Время блокировки должно быть числом от 0 до 7'
                    });
                }
    
                // Проверка, что pass_threshold находится в диапазоне от 0 до 100
                const passThreshold = parseFloat(pass_threshold);
                if (isNaN(passThreshold) || passThreshold < 0 || passThreshold > 100) {
                    req.session.previousUrl = req.headers.referer;
                    return res.status(400).render('./layouts/error.hbs', {
                        layout: "error.hbs",
                        errorMessage: 'Порог прохождения должен быть числом от 0 до 100'
                    });
                }
    
                const courseTypeExists = await models.CourseTypes.findByPk(courseType);
                if (!courseTypeExists) {
                    req.session.previousUrl = req.headers.referer;
                    return res.status(400).render('./layouts/error.hbs', {
                        layout: "error.hbs",
                        errorMessage: 'Указанный тип курса не существует'
                    });
                }
    
                const existingCourse = await models.Courses.findOne({
                    where: { course_name: courseName }
                });
    
                if (existingCourse) {
                    req.session.previousUrl = req.headers.referer;
                    return res.status(400).render('./layouts/error.hbs', {
                        layout: "error.hbs",
                        errorMessage: 'Курс с таким именем уже существует'
                    });
                }
    
                await models.Courses.create({
                    course_name: courseName,
                    description: description,
                    other_details: details,
                    duration: duration,
                    course_type_id: courseType,
                    pass_threshold: passThreshold,
                    lock_days: lock_days,
                    questions_to_show: questionsToShow || 10 // По умолчанию 10 вопросов
                });
    
                res.status(204).redirect('/admin/courses');
            });
        } catch (error) {
            console.error('Ошибка при добавлении курса:', error);
    
            // Обработка ошибок базы данных
            if (error.name === 'SequelizeUniqueConstraintError') {
                req.session.previousUrl = req.headers.referer;
                return res.status(400).render('./layouts/error.hbs', {
                    layout: "error.hbs",
                    errorMessage: 'Курс с таким именем уже существует'
                });
            }
    
            // Общая ошибка сервера
            res.status(500).render('./layouts/error.hbs', {
                layout: "error.hbs",
                errorMessage: 'Произошла ошибка при добавлении курса'
            });
        }
    }


    async editCourseView(req, res) {
        try {
            await isAdmin(req, res, async () => {
                const courseId = req.params.id;
                const course = await models.Courses.findByPk(courseId, { include: [models.CourseTypes], raw: true });
                if (!course) {
                    req.session.previousUrl = req.headers.referer;
                    return res.status(400).render('./layouts/error.hbs', { layout: "error.hbs", errorMessage: 'Курс не найден' });
                }
                const typeId = course.course_type_id;
                const type = await models.CourseTypes.findByPk(typeId, { raw: true });
                const types = await models.CourseTypes.findAll({ raw: true });
                const videos = await models.Videos.findAll({
                    where: { course_id: courseId },
                    raw: true
                });

                res.render("./layouts/editcourse.hbs", {
                    layout: "editcourse.hbs",
                    course: course,
                    type: type,
                    types: types,
                    videos: videos
                });
            });
        } catch (error) {
            console.error('Ошибка при обновлении класса:', error);
            res.status(500).send('Произошла ошибка при обновлении класса');
        }
    }


    async updateCourse(req, res) {
        try {
            await isAdmin(req, res, async () => {
                const courseId = req.params.id;
                const { courseName, description, details, duration, courseType, questionsToShow, pass_threshold, lock_days } = req.body;
    
  // Проверка обязательных полей
  if (!courseName || !description || !pass_threshold || !lock_days) {
    req.session.previousUrl = req.headers.referer;
    return res.status(400).render('./layouts/error.hbs', {
        layout: "error.hbs",
        errorMessage: 'Не все обязательные поля заполнены'
    });
}

// Проверка, что duration является числом
if (isNaN(duration)) {
    req.session.previousUrl = req.headers.referer;
    return res.status(400).render('./layouts/error.hbs', {
        layout: "error.hbs",
        errorMessage: 'Продолжительность должна быть числом'
    });
}


if (isNaN(lock_days) || lock_days < 0 || lock_days > 7) {
    req.session.previousUrl = req.headers.referer;
    return res.status(400).render('./layouts/error.hbs', {
        layout: "error.hbs",
        errorMessage: 'Время блокировки должно быть числом от 0 до 7'
    });
}

// Проверка, что pass_threshold находится в диапазоне от 0 до 100
const passThreshold = parseFloat(pass_threshold);
if (isNaN(passThreshold) || passThreshold < 0 || passThreshold > 100) {
    req.session.previousUrl = req.headers.referer;
    return res.status(400).render('./layouts/error.hbs', {
        layout: "error.hbs",
        errorMessage: 'Порог прохождения должен быть числом от 0 до 100'
    });
}
    
                const existingCourse = await models.Courses.findOne({
                    where: {
                        course_name: courseName,
                        course_id: { [Op.not]: courseId }
                    }
                });
    
                if (existingCourse) {
                    req.session.previousUrl = req.headers.referer;
                    return res.render('./layouts/error.hbs', { layout: "error.hbs", errorMessage: 'Курс с таким именем уже существует' });
                }
    
                const updatedCourse = await models.Courses.update(
                    {
                        course_name: courseName,
                        description: description,
                        other_details: details,
                        duration: duration,
                        pass_threshold: pass_threshold,
                        course_type_id: courseType,
                        lock_days: lock_days,
                        questions_to_show: questionsToShow || 10 // Обновляем количество вопросов
                    },
                    {
                        where: { course_id: courseId }
                    }
                );
    
                if (updatedCourse[0] === 0) {
                    req.session.previousUrl = req.headers.referer;
                    return res.status(400).render('./layouts/error.hbs', { layout: "error.hbs", errorMessage: 'Курс не найден' });
                }
    
                res.status(200).redirect('/admin/courses');
            });
        } catch (error) {
            console.error('Ошибка при обновлении курса:', error);
            res.status(500).send('Произошла ошибка при обновлении курса');
        }
    }

    async createQuestion(req, res) {
        await isAdmin(req, res, async () => {
            try {
                const courses = await models.Courses.findAll({ raw: true }); // Получение списка всех курсов
                res.render("./layouts/createQuestion.hbs", { layout: "createQuestion.hbs", courses: courses });
            } catch (error) {
                console.error('Ошибка при получении курсов:', error.message);
                res.status(500).send('Произошла ошибка при получении курсов');
            }
        });

    }
    async handleCreateQuestion(req, res) {
        await isAdmin(req, res, async () => {
            try {
                const { courseId, questionText, correctAnswers, incorrectAnswers } = req.body;
                const correctAnswers1 = JSON.parse(correctAnswers);
                const incorrectAnswers1 = JSON.parse(incorrectAnswers);

                if (!courseId || !questionText || !answers || correctAnswers1.length < 1 || correctAnswers1.length > 4 || incorrectAnswers1.length < 1 || incorrectAnswers1.length > 4) {
                    req.session.previousUrl = req.headers.referer;
                    return res.render('./layouts/error.hbs', { layout: "error.hbs", errorMessage: 'Неверные данные. Верных  и неверных ответов должно быть не меньше 1 и не больше 4.' });
                }


                const newQuestion = await models.Tasks.create({
                    course_id: courseId,
                    question_text: questionText
                });

                // Создание ответов
                for (const answer of correctAnswers1) {
                    await models.Answers.create({
                        test_id: newQuestion.test_id,
                        answer_text: answer,
                        is_correct: 1
                    });
                }
                for (const answer of incorrectAnswers1) {
                    await models.Answers.create({
                        test_id: newQuestion.test_id,
                        answer_text: answer,
                        is_correct: 0
                    });
                }

                res.redirect('/admin');
            } catch (error) {
                console.error('Ошибка при создании вопроса и ответов:', error.message);
                res.status(500).send('Произошла ошибка при создании вопроса и ответов');
            }
        });
    }
    

    async addType(req, res) {
        try {
            await isAdmin(req, res, async () => {
                const { typeName, description, otherDetails } = req.body;
                await models.CourseTypes.create({ type_name: typeName, description: description, other_details: otherDetails });
                res.redirect('/admin/types');
            });
        } catch (error) {
            console.error('Ошибка при добавлении типа курса:', error);
            res.status(500).send('Произошла ошибка при добавлении типа курса');
        }
    }

    async updateType(req, res) {
        try {
            await isAdmin(req, res, async () => {
                const { type_id } = req.params;
                const { type_name, description, other_details } = req.body;
                await models.CourseTypes.update({ type_name, description, other_details }, { where: { type_id } });
                return res.render('./layouts/infoAdmin.hbs', { layout: "infoAdmin.hbs", message: 'Тип успешно обновлен' });
            });
        } catch (error) {
            console.error('Ошибка при обновлении типа курса:', error);
            res.status(500).send('Произошла ошибка при обновлении типа курса');
        }
    }



    async deleteCourse(req, res) {
        try {
            await isAdmin(req, res, async () => {
                const courseId = req.params.id;
                const courseInstance = await models.Courses.findByPk(courseId);
                if (!courseInstance) {
                    req.session.previousUrl = req.headers.referer;
                    return res.render('./layouts/error.hbs', { layout: "error.hbs", errorMessage: 'Курс не найден' });
                }
                await courseInstance.destroy();
                return res.render('./layouts/infoAdmin.hbs', { layout: "infoAdmin.hbs", message: 'Курс успешно удален' });
            });
        } catch (error) {
            console.error('Ошибка при удалении курса:', error);
            res.status(500).send('Произошла ошибка при удалении курса');
        }
    }
    async deleteType(req, res) {
        const { id } = req.params;
        try {
            await isAdmin(req, res, async () => {
                const type = await models.CourseTypes.findByPk(id);
                if (!type) {
                    req.session.previousUrl = req.headers.referer;
                    return res.render('./layouts/error.hbs', { layout: "error.hbs", errorMessage: 'Тип не найден' });
                }
                await type.destroy();
                return res.render('./layouts/infoAdmin.hbs', { layout: "infoAdmin.hbs", message: 'Тип успешно удален' });
            });
        } catch (error) {
            console.error('Ошибка при удалении типа:', error);
            res.status(500).send('Произошла ошибка при удалении типа');
        }
    }

    async deleteUser(req, res) {
        const { id } = req.params;
        console.log(id)
        try {
            await isAdmin(req, res, async () => {
                const user = await models.Users.findByPk(id);
                if (!user) {
                    req.session.previousUrl = req.headers.referer;
                    return res.render('./layouts/error.hbs', { layout: "error.hbs", errorMessage: 'User не найден' });
                }
                await user.destroy();
                return res.render('./layouts/infoAdmin.hbs', { layout: "infoAdmin.hbs", message: 'Пользователь успешно удален' });
            });
        } catch (error) {
            console.error('Ошибка при удалении:', error);
            res.status(500).send('Произошла ошибка при удалении типа');
        }
    }

    async deleteVideo(req, res) {
        try {
            await isAdmin(req, res, async () => {
                const { id } = req.params;

                const video = await models.Videos.findByPk(id);
                if (!video) {
                    req.session.previousUrl = req.headers.referer;
                    return res.render('./layouts/error.hbs', { layout: "error.hbs", errorMessage: 'Видео не найдено' });
                }
                await video.destroy();
                return res.render('./layouts/infoAdmin.hbs', { layout: "infoAdmin.hbs", message: 'Видео успешно удалено' });
            });
        } catch (error) {
            console.error('Ошибка при удалении видео:', error);
            res.status(500).send('Произошла ошибка при удалении видео');
        }
    }

    async deleteTask(req, res) {
        const { id } = req.params;
        try {
            await isAdmin(req, res, async () => {
                const type = await models.Tasks.findByPk(id);
                if (!type) {
                    req.session.previousUrl = req.headers.referer;
                    return res.render('./layouts/error.hbs', { layout: "error.hbs", errorMessage: 'Задание не найдено' });
                }
                await type.destroy();
                return res.render('./layouts/infoAdmin.hbs', { layout: "infoAdmin.hbs", message: 'Задание успешно удалено' });
            });
        } catch (error) {
            console.error('Ошибка при удалении вопроса:', error);
            res.status(500).send('Произошла ошибка при удалении вопроса');
        }
    }

    async deleteAnswer(req, res) {
        const { id } = req.params;
        try {
            await isAdmin(req, res, async () => {
                const type = await models.Answers.findByPk(id);
                if (!type) {
                    req.session.previousUrl = req.headers.referer;
                    return res.render('./layouts/error.hbs', { layout: "error.hbs", errorMessage: 'Ответ не найден' });
                }
                await type.destroy();
                return res.render('./layouts/infoAdmin.hbs', { layout: "infoAdmin.hbs", message: 'Ответ успешно удален' });
            });
        } catch (error) {
            console.error('Ошибка при удалении ответа:', error);
            res.status(500).send('Произошла ошибка при удалении ответа');
        }
    }

    //видео

    async uploadVideo(req, res) {
        try {
            await isAdmin(req, res, async () => {
                const { courseId } = req.body;
                const videoData = req.file.buffer;
                const filename = req.file.originalname;

                const video = await models.Videos.create({
                    course_id: courseId,
                    video_content: videoData,
                    video_description: filename
                });

                return res.render('./layouts/infoAdmin.hbs', { layout: "infoAdmin.hbs", message: 'Видео успешно добавлено' });
            });
        } catch (error) {
            console.error('Ошибка при загрузке видео:', error);
            res.status(500).send('Произошла ошибка при загрузке видео');
        }
    }

    // материалы

    async deleteMaterial(req, res) {
        try {
            await isAdmin(req, res, async () => {
                const { id } = req.params;
                const material = await models.Materials.findByPk(id);
                if (!material) {
                    req.session.previousUrl = req.headers.referer;
                    return res.render('./layouts/error.hbs', { layout: "error.hbs", errorMessage: 'Глава не найдена' });
                }
                await material.destroy();
                return res.status(200).json({ message: 'Материал успешно удален' });
            });
        } catch (error) {
            console.error('Ошибка при удалении:', error);
            res.status(500).send('Произошла ошибка при удалении материала');
        }
    }

    async addMaterials(req, res) {
        try {
            await isAdmin(req, res, async () => {
                const { text, courseId, title, range } = req.body;
                const existingMaterial = await models.Materials.findOne({
                    where: {
                        course_id: courseId,
                        range: range
                    }
                });
    
                if (existingMaterial) {
                    req.session.previousUrl = req.headers.referer;
                    return res.status(400).render('./layouts/error.hbs', {
                        layout: "error.hbs",
                        errorMessage: 'Запись с таким course_id и range уже существует'
                    });
                }
                await models.Materials.create({
                    title: title,
                    course_id: courseId,
                    range: range,
                    text: text
                });
    
                res.redirect('/admin/materials');
            });
        } catch (error) {
            console.error('Ошибка при добавлении материала курса:', error);
            res.status(500).send('Произошла ошибка при добавлении материала курса');
        }
    }

    async updateMaterial(req, res) {
        try {
            await isAdmin(req, res, async () => {
                const { id } = req.params;
                console.log("!!!!!!!!!!!!! " +  id)
                const { material_id, title, text, range, courseId } = req.body;

                const existingMaterial = await models.Materials.findOne({
                    where: { material_id: id }
                });
    
                if (!existingMaterial) {
                    req.session.previousUrl = req.headers.referer;
                    return res.status(404).render('./layouts/error.hbs', {
                        layout: "error.hbs",
                        errorMessage: 'Запись с таким material_id не найдена'
                    });
                }
    
                // Проверяем, чтобы range был уникальным для данного course_id
                const duplicateMaterial = await models.Materials.findOne({
                    where: {
                        course_id: courseId,
                        range: range,
                        material_id: { [Op.not]: id } // Исключаем текущую запись
                    }
                });
    
                if (duplicateMaterial) {
                    req.session.previousUrl = req.headers.referer;
                    return res.status(400).render('./layouts/error.hbs', {
                        layout: "error.hbs",
                        errorMessage: 'Запись с таким course_id и range уже существует'
                    });
                }
    
                await models.Materials.update(
                    {
                        title: title,
                        text: text,
                        range: range,
                        course_id: courseId
                    },
                    {
                        where: { material_id: id }
                    }
                );
    
                res.status(200).json({ message: 'Материал успешно обновлен' });
            });
        } catch (error) {
            console.error('Ошибка при обновлении материала курса:', error);
            res.status(500).send('Произошла ошибка при обновлении материала курса');
        }
    }
    

    async getAllMaterials(req, res) {
        
        try {
            await isAdmin(req, res, async () => {

                const { courseId } = req.query;

                const options = {
                    include: [{
                        model: models.Courses, 
                        attributes: ['course_name', 'course_id'] // Выбираем только название курса
                    }]
                };
        
                if (courseId) {
                    options.where = { course_id: courseId };
                }
        
               // const materials = await models.Materials.findAll(options);
    
                const materials = await models.Materials.findAll({
                    include: [{ model: models.Courses }],
                    raw: true
                });
            
                    const courses = await models.Courses.findAll({
                        include: [models.CourseTypes],
                        raw: true
                    });

                    const formattedmaterials = materials.map(materials => {
                     return {
                         material_id: materials.material_id,
                         course_id: materials.course_id,
                         title: materials.title,
                         range: materials.range,
                         text: materials.text,
                        CourseId: materials['Course.course_id'],
                        CourseName: materials['Course.course_name'],
                        Description: materials['Course.description'],
                        Duration: materials['Course.duration'],
                        CourseTypeId: materials['Course.course_type_id'],
                        OtherDetails: materials['Course.other_details']
                         
                     };
                    });

                res.status(200).render('./layouts/materials.hbs', {
                    layout: 'materials.hbs', // Укажите ваш основной layout
                    materials: formattedmaterials, // Передаем список материалов
                    courses: courses, // Передаем список курсов для фильтрации
                    selectedCourseId: courseId // Передаем выбранный courseId для фильтрации
                });
            });
        } catch (error) {
            console.error('Ошибка при получении списка материалов:', error);
            res.status(500).render('./layouts/error.hbs', {
                layout: "error.hbs",
                errorMessage: 'Произошла ошибка при получении списка материалов'
            });
        }

        

    }



}



module.exports = new AdminController();