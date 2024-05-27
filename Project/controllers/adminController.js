const { where } = require('sequelize');
const { models } = require('../db/utils/db');
const answers = require('../db/models/answers');
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
            res.status(403).send('Ты не админ!!!'); // Возвращаем статус 403 (Запрещено) в случае отсутствия доступа
        }
    } else {
        res.status(403).send('Не зарегистрирован'); // Возвращаем статус 403 (Запрещено), если пользователь не авторизован
    }
}

class AdminController {

    async getAdminPage(req, res) {
        try {
            await isAdmin(req, res, async () => {
                res.render("./layouts/admin.hbs", { layout: "admin.hbs" });
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
                res.render("./layouts/videos.hbs", { layout: "videos.hbs", videos: videos, courses: courses });
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
                //     const tests = await models.Test.findAll({raw: true })
                //    // const answers = await models.Answers.findAll({ include: [models.Questions],raw: true })
                //     const questions = await models.Questions.findAll({ include: [models.Answers], raw: true })
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
                    return res.status(404).send('Тип не найден');
                }
                await type.update({
                    TypeName: typeName,
                    Description: description
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
                    return res.status(404).send('Тип не найден');
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
                    return res.status(400).send('Продолжительность должна быть числом');
                }
                const courseTypeExists = await models.CourseTypes.findByPk(courseType);
                if (!courseTypeExists) {
                    return res.status(404).send('Указанный тип курса не существует');
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
                    return res.status(404).send('Курс не найден');
                }
                const typeId = course.course_type_id;
                const type = await models.CourseTypes.findByPk(typeId, { raw: true });
                const types = await models.CourseTypes.findAll({ raw: true });
                const videos = await models.Videos.findAll({
                    where: { course_id: courseId },
                    raw: true
                });
    
                // Кодирование данных видео в base64
                const encodedVideos = videos.map(video => ({
                    ...video,
                    base64Data: base64Encode(video.video_content) // Закодированные данные видео
                }));
                res.render("./layouts/editcourse.hbs", {
                    layout: "editcourse.hbs",
                    course: course,
                    type: type,
                    types: types,
                    videos: encodedVideos
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
                if (duration <= 0 || duration >= 1000) {
                    return res.status(400).send('Продолжительность курса должна быть больше 0 и меньше 1000');
                }

                const existingCourse = await models.Courses.findOne({
                    where: {
                        course_name: courseName,
                        course_id: { [Op.not]: courseId }
                    }
                });

                if (existingCourse) {
                    return res.status(400).send('Курс с таким именем уже существует');
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
                    return res.status(404).send('Курс не найден');
                }

                res.redirect('/admin/courses');

            });
        } catch (error) {
            console.error('Ошибка при обновлении курса:', error);
            res.status(500).send('Произошла ошибка при обновлении курса');
        }
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
                res.status(200).send('Type updated successfully');
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
                    return res.status(404).send('Курс не найден');
                }
                await courseInstance.destroy();
                res.send('Курс успешно удален');
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
                    return res.status(404).send('Тип не найден');
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
                    return res.status(404).send('Пользователь не найден');
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
                    return res.status(404).send('Видео не найдено');
                }
                await video.destroy();

                res.status(200).send({ message: 'Видео успешно удалено' });
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
                    return res.status(404).send('Задание не найдено');
                }
                await type.destroy();
                return res.render('./layouts/infoAdmin.hbs', { layout: "infoAdmin.hbs", message: 'Видео успешно удалено' });
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
                    return res.status(404).send('Ответ не найдено');
                }
                await type.destroy();
                return res.render('./layouts/infoAdmin.hbs', { layout: "infoAdmin.hbs", message: 'Видео успешно удалено' });
            });
        } catch (error) {
            console.error('Ошибка при удалении ответа:', error);
            res.status(500).send('Произошла ошибка при удалении ответа');
        }
    }

    async deleteVideo(req, res) {
        const { id } = req.params;
        try {
            await isAdmin(req, res, async () => {
                const video = await models.Videos.findByPk(id);
                if (!video) {
                    return res.status(404).send('Видео не найдено');
                }
                await video.destroy();
                return res.render('./layouts/infoAdmin.hbs', { layout: "infoAdmin.hbs", message: 'Видео успешно удалено' });
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