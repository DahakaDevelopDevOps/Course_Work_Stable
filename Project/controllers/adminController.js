const { models } = require('../db/utils/db');



async function getScheduleForClass(classId) {
    try {
        const schedule = await models.scheduler.findAll({
            where: { ClassId: classId }
        });
        return schedule;
    } catch (error) {
        console.error('Ошибка при получении расписания для класса:', error);
        throw error;
    }
}

class AdminController {

    getAdminPage(req, res) {
        res.render("./layouts/admin.hbs", { layout: "admin.hbs" });
    }

    async getAllUsers(req, res) {
        try {
            const users = await models.Users.findAll();
            res.render("./layouts/users.hbs", { layout: "users.hbs", users:users });

        } catch (error) {
            console.error('Ошибка при получении пользователей:', error);
            res.status(500).send('Произошла ошибка при получении пользователей');
        }
    }

    async getAllTypes(req, res) {
        try {
            const scheduler = await models.CourseTypes.findAll();
            res.json(scheduler);
        } catch (error) {
            console.error('Ошибка при получении расписания:', error);
            res.status(500).send('Произошла ошибка при получении расписания');
        }
    }

    async getCourses(req, res) {
        try {
            const enrollment = await models.Courses.findAll();
            res.json(enrollment);
        } catch (error) {
            console.error('Ошибка при получении записей на курсы:', error);
            res.status(500).send('Произошла ошибка при получении записей на курсы');
        }
    }

    // masters

    addMasterView(req, res) {
        // Здесь отображается форма для добавления нового мастера
        res.render('addMaster'); // Пример использования шаблонизатора (например, Handlebars)
    }

    async addMaster(req, res) {
        try {
            const { name, description, photo } = req.body;
            await models.masters.create({
                Name: name,
                Description: description,
                Photo: photo
            });
            res.status(201).send('Мастер успешно добавлен');
        } catch (error) {
            // Обработка ошибки
            console.error('Ошибка при добавлении мастера:', error);
            res.status(500).send('Произошла ошибка при добавлении мастера');
        }
    }

    editMasterView(req, res) {
        // Здесь отображается форма для редактирования информации о мастере с заданным id
        res.render('editMaster'); // Пример использования шаблонизатора (например, Handlebars)
    }

    async editMaster(req, res) {
        const { id } = req.params;
        try {
            const { name, description, photo } = req.body;
            const master = await models.masters.findByPk(id);
            if (!master) {
                return res.status(404).send('Мастер не найден');
            }
            await master.update({
                Name: name,
                Description: description,
                Photo: photo
            });
            res.send('Информация о мастере успешно обновлена');
        } catch (error) {
            console.error('Ошибка при обновлении мастера:', error);
            res.status(500).send('Произошла ошибка при обновлении мастера');
        }
    }

    async deleteMaster(req, res) {
        const { id } = req.params;
        try {
            const master = await models.masters.findByPk(id);
            if (!master) {
                return res.status(404).send('Мастер не найден');
            }
            await master.destroy();
            res.send('Мастер успешно удален');
        } catch (error) {
            console.error('Ошибка при удалении мастера:', error);
            res.status(500).send('Произошла ошибка при удалении мастера');
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

    editTypeView(req, res) {
        res.render('editType'); // Пример использования шаблонизатора (например, Handlebars)
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

    async addClassView(req, res) {
        const artTypes = await models.types.findAll();
        res.render('addСlass', { artTypes });
    }

    //надо продумать с типами, чтобы добавлялся тип
    async addClass(req, res) {
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

    editClassView(req, res) {
        res.render('editClass');
    }

    async editClass(req, res) {
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

    async deleteClass(req, res) {
        const { id } = req.params;
        try {
            const classInstance = await models.classes.findByPk(id);
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

    //users

    addUserView(req, res) {
        res.render('addUser');
    }

    async addUser(req, res) {
        try {
            const { login, email, role, password } = req.body;
            await models.users.create({
                Login : login,
                Email : email,
                Role : role,
                Password: password
            });
            res.status(201).send('Пользователь успешно добавлен');
        } catch (error) {
            console.error('Ошибка при добавлении пользователя:', error);
            res.status(500).send('Произошла ошибка при добавлении пользователя');
        }
    }

    editUserView(req, res) {
        res.render('editUser');
    }

    async editUser(req, res) {
        const { id } = req.params;
        try {
            const { login, email, role, password} = req.body;
            const user = await models.users.findByPk(id);
            if (!user) {
                return res.status(404).send('Пользователь не найден');
            }
            await user.update({
                Login : login,
                Email : email,
                Role : role,
                Password: password
            });
            res.send('Информация о пользователе успешно обновлена');
        } catch (error) {
            console.error('Ошибка при обновлении пользователя:', error);
            res.status(500).send('Произошла ошибка при обновлении пользователя');
        }
    }

    async deleteUser(req, res) {
        const { id } = req.params;
        try {
            const user = await models.users.findByPk(id);
            if (!user) {
                return res.status(404).send('Пользователь не найден');
            }
            await user.destroy();

            res.send('Пользователь успешно удален');
        } catch (error) {
            console.error('Ошибка при удалении пользователя:', error);
            res.status(500).send('Произошла ошибка при удалении пользователя');
        }
    }
}



module.exports = new AdminController();