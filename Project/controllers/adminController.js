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
            return res.render('./layouts/error.hbs', { layout: "error.hbs", errorMessage: 'Ты не админ!!!' });
        }
    } else {
        req.session.previousUrl = req.headers.referer;
        return res.render('./layouts/error.hbs', { layout: "error.hbs", errorMessage: 'Не зарегистрирован' });
    }
}

class AdminController {

    async getAdminPage(req, res) {
        try {
            await isAdmin(req, res, async () => {
                const tasksDetails1 = await models.Tasks.findAll({
                    include: [
                        {
                            model: models.Courses,
                            attributes: ['course_name']
                        },
                        {
                            model: models.Answers
                        }
                    ], raw: true
                })
                const tasksDetails = await models.Tasks.findAll({
                    include: [{ model: models.Answers }]
                });

                if (!tasksDetails) {
                    req.session.previousUrl = req.headers.referer;
                    return res.render('./layouts/error.hbs', { layout: "error.hbs", errorMessage: 'нет теста' });

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


                res.render("./layouts/admin.hbs", { layout: "admin.hbs", tests: tasks });
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
                res.render("./layouts/users.hbs", { layout: "users.hbs", users: users });
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
                res.render("./layouts/types.hbs", { layout: "types.hbs", types: types });
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
                res.render("./layouts/courseUpdating.hbs", { layout: "courseUpdating.hbs", courses: courses });
            });
        } catch (error) {
            console.error('Ошибка при получении записей на курсы:', error);
            res.status(500).send('Произошла ошибка при получении записей на курсы');
        }
    }
    async getVideos(req, res) {
        try {
            await isAdmin(req, res, async () => {
                const courses = await models.Courses.findAll({ include: [models.CourseTypes], raw: true });
                const videos = await models.Videos.findAll({ include: [models.Courses], raw: true })
                // Преобразуем видео BLOB в base64
                const videosWithUrls = videos.map(video => {
                    const base64Video = video.video_content.toString('base64');
                    return {
                        ...video,
                        video_url: `data:video/mp4;base64,${base64Video}`
                    };
                });
                res.render("./layouts/videos.hbs", { layout: "videos.hbs", videos: videosWithUrls, courses: courses });
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
                res.render("./layouts/tests.hbs", { layout: "tests.hbs", courses: courses });
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
                    return res.render('./layouts/error.hbs', { layout: "error.hbs", errorMessage: 'Тип не найден' });
                }
                await type.update({
                    type_name: type_name,
                    description: description,
                    other_details: other_details
                });
                res.send('Информация о типе успешно обновлена');
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
                    return res.render('./layouts/error.hbs', { layout: "error.hbs", errorMessage: 'Тип не найден' });
                }
                await type.destroy();
                res.send('Тип успешно удален');
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
                res.render("./layouts/addcourse.hbs", { layout: "addcourse.hbs", types: types });
            });
        } catch (error) {
            console.error('Ошибка при добавлении класса:', error);
            res.status(500).send('Произошла ошибка при добавлении класса');
        }
    }

    async addCourse(req, res) {
        try {
            await isAdmin(req, res, async () => {
                const { courseName, description, details, duration, courseType } = req.body;

                if (isNaN(duration)) {
                    req.session.previousUrl = req.headers.referer;
                    return res.render('./layouts/error.hbs', { layout: "error.hbs", errorMessage: 'Продолжительность должна быть числом' });
                }
                const courseTypeExists = await models.CourseTypes.findByPk(courseType);
                if (!courseTypeExists) {
                    ;
                    req.session.previousUrl = req.headers.referer;
                    return res.render('./layouts/error.hbs', { layout: "error.hbs", errorMessage: 'Указанный тип курса не существует' });

                }
                await models.Courses.create({
                    course_name: courseName,
                    description: description,
                    other_details: details,
                    duration: duration,
                    course_type_id: courseType
                });

                res.redirect('/admin/courses');
            });
        } catch (error) {
            console.error('Ошибка при добавлении курса:', error);
            res.status(500).send('Произошла ошибка при добавлении курса');
        }
    }


    async editCourseView(req, res) {
        try {
            await isAdmin(req, res, async () => {
                const courseId = req.params.id;
                const course = await models.Courses.findByPk(courseId, { include: [models.CourseTypes], raw: true });
                if (!course) {
                    req.session.previousUrl = req.headers.referer;
                    return res.render('./layouts/error.hbs', { layout: "error.hbs", errorMessage: 'Курс не найден' });
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
                const { courseName, description, details, duration, courseType } = req.body;
                if (duration <= 0 || duration >= 100) {
                    req.session.previousUrl = req.headers.referer;
                    return res.render('./layouts/error.hbs', { layout: "error.hbs", errorMessage: 'Продолжительность курса должна быть больше 0 и меньше 1000' });
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
                        course_type_id: courseType
                    },
                    {
                        where: { course_id: courseId }
                    }
                );

                if (updatedCourse[0] === 0) {
                    req.session.previousUrl = req.headers.referer;
                    return res.render('./layouts/error.hbs', { layout: "error.hbs", errorMessage: 'Курс не найден' });
                }

                res.redirect('/admin/courses');

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
                console.log(correctAnswers)
                console.log(incorrectAnswers)
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
                return res.render('./layouts/infoAdmin.hbs', { layout: "infoAdmin.hbs", message: 'Тип успешно удален' });
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


}



module.exports = new AdminController();