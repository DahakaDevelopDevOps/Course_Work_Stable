const { models } = require('../db/utils/db');


class СoursesController {

    async getAllCourses(req, res) {
        const courses = await models.Courses.findAll({
            raw: true,
            include: [models.CourseTypes]
        });
        res.render("./layouts/courses.hbs", { layout: "courses.hbs", courses: courses });
    }
    

    async getOneCourse(req, res) {
        const { id } = req.params;
        try {
            const courseId = req.params.courseId;
            const course = await models.Courses.findByPk(courseId, { include: [models.CourseTypes] });
            if (!course) {
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