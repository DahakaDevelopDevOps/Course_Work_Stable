const { models } = require('../db/utils/db');


class СoursesController {

    async getAllCourses(req, res) {
        try {
            let courses;
            const { type } = req.query;
            if (type) {
                courses = await models.Courses.findAll({
                    include: [{ model: models.CourseTypes, where: { type_name: type }, raw: true }]
                },);
            } else {
                courses = await models.Courses.findAll({
                    include: [models.CourseTypes], raw: true
                });
            }
            const courseTypes = await models.CourseTypes.findAll({ raw: true }); // Изменение имени переменной
            res.render("./layouts/courses.hbs", { layout: "courses.hbs", courses: courses, courseTypes: courseTypes }); // Изменение имени переменной в объекте передаваемых данных
        } catch (error) {
            console.error('Ошибка при получении курсов:', error);
            res.status(500).send('Произошла ошибка при получении курсов');
        }
    }
    

    async getOneCourse(req, res) {
       // const { id } = req.params;
        try {
            const courseId = req.params.id;
            const course = await models.Courses.findByPk(courseId, { include: [models.CourseTypes], raw: true  });
            if (!course) {
                return res.status(404).send('Курс не найден');
            }
            // Получаем название типа курса
        const type = await models.CourseTypes.findOne({ where: { type_id: course.course_type_id }, raw: true });
        console.log('course !!!!' + course)
        console.log('Type !!!!' + type)
            res.render('./layouts/courseDetails.hbs', { layout: "courseDetails.hbs", course: course, type: type });
        } catch (error) {
            console.error('Ошибка при получении курса:', error);
            res.status(500).send('Произошла ошибка при получении мастера');
        }
    }


}


module.exports = new СoursesController();