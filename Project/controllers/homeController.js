// const asyncHandler = require("express-async-handler");
//ето можно добавить, чтобы не спамить по кд try/catch

exports.getMainPage = (req, res, next) => {
    res.render("./layouts/home.hbs", { layout: "home.hbs" });
};