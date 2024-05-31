const asyncHandler = require("express-async-handler");

exports.getMainPage = (req, res, next) => {
    res.render("./layouts/home.hbs", { layout: "home.hbs" });
};

const { models } = require('../db/utils/db');

class HomeController {
    async getMainPage(req, res) {
        const types = await models.CourseTypes.findAll({ raw: true });

        res.render("./layouts/home.hbs", { layout: "home.hbs", types:types });
    };

}
module.exports = new HomeController();