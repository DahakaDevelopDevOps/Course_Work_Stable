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

    //classes

    //надо продумать с типами, чтобы добавлялся тип
    async addCourse(req, res) {
        try {
            const { name, description, artType } = req.body;
            await models.classes.create({
                Name : name,
                Description : description,
                ArtType : artType
            });
            res.status(201).send('Класс успешно добавлен');
        } catch (error) {
            console.error('Ошибка при добавлении класса:', error);
            res.status(500).send('Произошла ошибка при добавлении класса');
        }
    }

    editCourseView(req, res) {
        res.render("./layouts/users.hbs", { layout: "users.hbs", users:users });
    }

    async editcourse(req, res) {
        const { id } = req.params;
        try {
            const { name, description, artType } = req.body;
            const classInstance = await models.classes.findByPk(id);
            if (!classInstance) {
                return res.status(404).send('Класс не найден');
            }
            await classInstance.update({
                Name : name,
                Description : description,
                ArtType : artType
            });
            res.send('Информация о классе успешно обновлена');
        } catch (error) {
            console.error('Ошибка при обновлении класса:', error);
            res.status(500).send('Произошла ошибка при обновлении класса');
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