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

  Statistics.belongsTo(Users, { foreignKey: 'user_id', onDelete: 'CASCADE' });
  Users.hasMany(Statistics, { foreignKey: 'user_id', onDelete: 'CASCADE' });
  Statistics.belongsTo(Courses, { foreignKey: 'course_id', onDelete: 'CASCADE' });
  Courses.hasMany(Statistics, { foreignKey: 'course_id', onDelete: 'CASCADE' });
  Statistics.belongsTo(Status, { foreignKey: 'status_id', onDelete: 'CASCADE' });
  Status.hasMany(Statistics, { foreignKey: 'status_id', onDelete: 'CASCADE' });

  // Связи для таблицы Courses и CourseTypes с каскадным удалением
  Courses.belongsTo(CourseTypes, { foreignKey: 'course_type_id', onDelete: 'CASCADE' });
  CourseTypes.hasMany(Courses, { foreignKey: 'course_type_id', onDelete: 'CASCADE' });

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
