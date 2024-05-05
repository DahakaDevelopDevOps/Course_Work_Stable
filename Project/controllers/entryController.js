const { models } = require('../db/utils/db');


class EntryController {

    async getEntry(req, res) {
        try {
            const user = req.session.id;
            console.log(user)
            const id = req.query.courseId; // Используем courseId, а не id
            if(id){
            const course = await models.Courses.findByPk(id, { include: [models.CourseTypes], raw: true});
            //console.log(course);
            const courses = await models.Courses.findAll({ include: [models.CourseTypes], raw: true  });
            res.render("./layouts/entry.hbs", { layout: "entry.hbs", course:course, courses: courses});
        }
           
        } catch (error) {
            console.error('Ошибка при получении курсов:', error);
            res.status(500).send('Произошла ошибка при получении курсов');
        }
    }
    

    // async getEntryForClass(req, res) {
    //     try {
    //         const courseId = req.query.id; // получение id из запроса
    //         // Например, отправка данных клиенту
    //         res.send(`Getting entry for course with ID: ${courseId}`)
    //         console.log(courseId)
    //         res.render("./layouts/entry.hbs", { layout: "entry.hbs", courses: courses, courseTypes: courseTypes }); // Изменение имени переменной в объекте передаваемых данных
    //     } catch (error) {
    //         console.error('Ошибка при получении курсов:', error);
    //         res.status(500).send('Произошла ошибка при получении курсов');
    //     }
    // }

    async addEntry(req, res) {
        try {
            const courseId = req.query.id; // получение id из запроса
            // Например, отправка данных клиенту
            res.send(`Getting entry for course with ID: ${courseId}`)
            res.render("./layouts/entry.hbs", { layout: "entry.hbs", courses: courses, courseTypes: courseTypes }); // Изменение имени переменной в объекте передаваемых данных
        } catch (error) {
            console.error('Ошибка при получении курсов:', error);
            res.status(500).send('Произошла ошибка при получении курсов');
        }
    }
    

}


module.exports = new EntryController();