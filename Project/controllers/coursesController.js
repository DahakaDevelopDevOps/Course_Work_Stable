const { models } = require('../db/utils/db');


class СoursesController {

    async getAllCourses(req, res) {
        const courses = await models.Courses.findAll({
            raw: true
        });
        const types = await models.CourseTypes.findAll({ attributes: ['type_name'], raw: true })
        res.render("./layouts/courses.hbs", { layout: "courses.hbs", courses: courses, types: types });

    }

    async getOneCourse(req, res) {
        const { id } = req.params;
        try {
            const courses = await models.Courses.findByPk(id);
            if (!courses) {
                return res.status(404).send('Курс не найден');
            }
            res.render('./layouts/courseDetails.hbs', { layout: "courseDetails.hbs", courses: courses });
        } catch (error) {
            console.error('Ошибка при получении мастера:', error);
            res.status(500).send('Произошла ошибка при получении мастера');
        }
    }


}


module.exports = new СoursesController();