const users = require("./users");
const courses = require("./courses");
const status = require("./status");
const statistics = require("./statistics");
const courseTypes = require("./types");

const { DataTypes } = require('sequelize');

function initModels(sequelize) {
  const Users = users(sequelize, DataTypes);
  const Courses = courses(sequelize, DataTypes);
  const Status = status(sequelize, DataTypes);
  const Statistics = statistics(sequelize, DataTypes);
  const CourseTypes = courseTypes(sequelize, DataTypes);


  Statistics.belongsTo(Users, { foreignKey: 'user_id' });
  Users.hasMany(Statistics, { foreignKey: 'user_id' });
  Statistics.belongsTo(Courses, { foreignKey: 'course_id' });
  Courses.hasMany(Statistics, { foreignKey: 'course_id' });
  Statistics.belongsTo(Status, { foreignKey: 'status_id' });
  Status.hasMany(Statistics, { foreignKey: 'status_id' });

  // Связи для таблицы Courses и CourseTypes
  Courses.belongsTo(CourseTypes, { foreignKey: 'course_type_id' });
  CourseTypes.hasMany(Courses, { foreignKey: 'course_type_id' });

  return {
    Users,
    Courses,
    Status,
    Statistics,
    CourseTypes
  };
}

module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
