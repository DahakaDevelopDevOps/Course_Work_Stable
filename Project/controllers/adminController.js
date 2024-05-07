const { where } = require('sequelize');
const { models } = require('../db/utils/db');
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

    async editType(req, res) {
        try {
            await isAdmin(req, res, async () => {
                const { id } = req.params;
                const { typeName, description } = req.body;
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

                // Проверяем, является ли продолжительность числом
                if (isNaN(duration)) {
                    return res.status(400).send('Продолжительность должна быть числом');
                }

                // Проверяем, существует ли указанный идентификатор типа курса
                const courseTypeExists = await models.CourseTypes.findByPk(courseType);
                if (!courseTypeExists) {
                    return res.status(404).send('Указанный тип курса не существует');
                }

                // Создаем курс
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
                const typeId = course.course_type_id
                const type = await models.CourseTypes.findByPk(typeId, { raw: true });
                console.log(type);
                const types = await models.CourseTypes.findAll({ raw: true });
                res.render("./layouts/editcourse.hbs", { layout: "editcourse.hbs", course: course, type: type, types: types });
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

                // Проверка продолжительности курса
                if (duration <= 0 || duration >= 1000) {
                    return res.status(400).send('Продолжительность курса должна быть больше 0 и меньше 1000');
                }

                // Проверка наличия курса с таким же именем
                const existingCourse = await models.Courses.findOne({
                    where: {
                        course_name: courseName,
                        course_id: { [Op.not]: courseId } 
                    }
                });

                if (existingCourse) {
                    return res.status(400).send('Курс с таким именем уже существует');
                }

                // Обновление курса
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

    async deleteCourse(req, res) {
        try {
            await isAdmin(req, res, async () => {
                const courseId = req.params.id;
                console.log('Удаление');
                console.log(courseId);
                const courseInstance = await models.Courses.findByPk(courseId);
                if (!courseInstance) {
                    console.log('не Завершено');
                    return res.status(404).send('Курс не найден');
                }
                await courseInstance.destroy();
                console.log('Завершено');
                res.send('Курс успешно удален');
            });
        } catch (error) {
            console.error('Ошибка при удалении курса:', error);
            res.status(500).send('Произошла ошибка при удалении курса');
        }
    }
    

}



module.exports = new AdminController();