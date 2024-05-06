const { models } = require('../db/utils/db');

class AdminController {

    getAdminPage(req, res) {
        res.render("./layouts/admin.hbs", { layout: "admin.hbs" });
    }

    async getAllUsers(req, res) {
        try {
            const users = await models.Users.findAll({ raw: true});
            res.render("./layouts/users.hbs", { layout: "users.hbs", users:users });

        } catch (error) {
            console.error('Ошибка при получении пользователей:', error);
            res.status(500).send('Произошла ошибка при получении пользователей');
        }
    }

    async getAllTypes(req, res) {
        try {
            const types = await models.CourseTypes.findAll({ raw: true});
            res.render("./layouts/types.hbs", { layout: "types.hbs", types:types });
        } catch (error) {
            console.error('Ошибка при получении расписания:', error);
            res.status(500).send('Произошла ошибка при получении расписания');
        }
    }

    async getCourses(req, res) {
        try {
            const courses = await models.Courses.findAll({
                include: [models.CourseTypes],
                raw: true
            });
            console.log("курсы в админке"+ courses[0])
            res.render("./layouts/courseUpdating.hbs", { layout: "courseUpdating.hbs", courses:courses });
        } catch (error) {
            console.error('Ошибка при получении записей на курсы:', error);
            res.status(500).send('Произошла ошибка при получении записей на курсы');
        }
    }

   
    // types 

    addTypeView(req, res) {
        res.render('addType');
    }

    async addType(req, res) {
        try {
            const { TypeName, Description } = req.body;
            await models.types.create({
                TypeName,
                Description
            });
            res.status(201).send('Тип успешно добавлен');
        } catch (error) {
            console.error('Ошибка при добавлении типа:', error);
            res.status(500).send('Произошла ошибка при добавлении типа');
        }
    }

    async editType(req, res) {
        const { id } = req.params;
        try {
            const { typeName, description } = req.body;
            const type = await models.types.findByPk(id);
            if (!type) {
                return res.status(404).send('Тип не найден');
            }
            await type.update({
                 TypeName : typeName ,
                Description: description  
            });
            res.send('Информация о типе успешно обновлена');
        } catch (error) {
            console.error('Ошибка при обновлении типа:', error);
            res.status(500).send('Произошла ошибка при обновлении типа');
        }
    }

    async deleteType(req, res) {
        const { id } = req.params;
        try {
            const type = await models.types.findByPk(id);
            if (!type) {
                return res.status(404).send('Тип не найден');
            }
            await type.destroy();
            res.send('Тип успешно удален');
        } catch (error) {
            console.error('Ошибка при удалении типа:', error);
            res.status(500).send('Произошла ошибка при удалении типа');
        }
    }

    //courses

    async addCourseView(req, res) {
        try {
            const types = await models.CourseTypes.findAll({ raw: true});
            res.render("./layouts/addcourse.hbs", { layout: "addcourse.hbs", types: types});
        } catch (error) {
            console.error('Ошибка при добавлении класса:', error);
            res.status(500).send('Произошла ошибка при добавлении класса');
        }
    }

    async addCourse(req, res) {
        try {
            const { courseName, description, details, duration, courseType } = req.body;
            await models.Courses.create({
                course_name: courseName,
                description: description,
                other_details: details,
                duration: duration,
                course_type_id: courseType
            });
            res.redirect('/admin/courses');
        } catch (error) {
            console.error('Ошибка при добавлении курсв:', error);
            res.status(500).send('Произошла ошибка при добавлении класса');
        }
    }

    async editCourseView(req, res) {
        try {
            const courseId = req.params.id;
            const course = await models.Courses.findByPk(courseId, { include: [models.CourseTypes], raw: true  });
            if (!course) {
                return res.status(404).send('Курс не найден');
            }
            const typeId = course.course_type_id
            const type = await models.CourseTypes.findByPk(typeId ,{ raw: true});
            console.log(type);
            const types = await models.CourseTypes.findAll({ raw: true});
            res.render("./layouts/editcourse.hbs", { layout: "editcourse.hbs", course: course, type: type, types: types});
        } catch (error) {
            console.error('Ошибка при обновлении класса:', error);
            res.status(500).send('Произошла ошибка при обновлении класса');
        }
        
    }

    async updateCourse(req, res) {
        try {
            const courseId = req.params.id;
            const { courseName, description, details, duration, courseType } = req.body; // Получаем данные из тела запроса
            console.log(courseType);
            const updatedCourse = await models.Courses.update(
                {
                    course_name: courseName,
                    description: description,
                    other_details: details,
                    duration: duration,
                    course_type_id: courseType // Обновляем тип курса
                },
                {
                    where: { course_id: courseId } // Условие для поиска курса по его ID
                }
                
            );
    
            if (updatedCourse[0] === 0) { // Проверяем, был ли обновлен хотя бы один курс
                return res.status(404).send('Курс не найден');
            }
    
            res.redirect('/admin/courses'); // Перенаправляем на главную страницу или куда-то еще
    
        } catch (error) {
            console.error('Ошибка при обновлении курса:', error);
            res.status(500).send('Произошла ошибка при обновлении курса');
        }
    }

    async deleteCourse(req, res) {
        const { courseId } = req.params;
        try {
            const classInstance = await models.Courses.findByPk(courseId);
            if (!classInstance) {
                return res.status(404).send('Класс не найден');
            }
            await classInstance.destroy();
            res.send('Класс успешно удален');
        } catch (error) {
            console.error('Ошибка при удалении класса:', error);
            res.status(500).send('Произошла ошибка при удалении класса');
        }
    }

}



module.exports = new AdminController();