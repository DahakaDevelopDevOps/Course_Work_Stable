const { models } = require('../db/utils/db');


class СoursesController {

    async getAllCourses(req, res) {
        try {
            let courses;
            const { type } = req.query;
            console.log("ТИппппп " + type)
            if (type) {
                courses = await models.Courses.findAll({
                    include: [{ model: models.CourseTypes, where: { type_id: type } }],
                    raw: true
                });
            } else {
                courses = await models.Courses.findAll({
                    include: [models.CourseTypes],
                    raw: true
                });
            }
            const courseTypes = await models.CourseTypes.findAll({ raw: true });
            const typeIn = await models.CourseTypes.findByPk(type, { raw: true });
            res.render("./layouts/courses.hbs", { layout: "courses.hbs", courses: courses, courseTypes: courseTypes, typeIn: typeIn });
        } catch (error) {
            console.error('Ошибка при получении курсов:', error);
            res.status(500).send('Произошла ошибка при получении курсов');
        }
    }
    
    

    async getOneCourse(req, res) {
        try {
            const courseId = req.params.id;
            const course = await models.Courses.findByPk(courseId, { include: [models.CourseTypes], raw: true  });
            if (!course) {
                return res.status(404).send('Курс не найден');
            }
            // Получаем название типа курса
        const type = await models.CourseTypes.findOne({ where: { type_id: course.course_type_id }, raw: true });
            res.render('./layouts/courseDetails.hbs', { layout: "courseDetails.hbs", course: course, type: type });
        } catch (error) {
            console.error('Ошибка при получении курса:', error);
            res.status(500).send('Произошла ошибка при получении мастера');
        }
    }


}


module.exports = new СoursesController();