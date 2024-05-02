const users = require("./users");
const courses = require("./courses");
const courseRegistrations = require("./courseRegistrations");
const completedCourses = require("./completedCourses");
const courseTypes = require("./types");

const { DataTypes } = require('sequelize');

function initModels(sequelize) {
  const Users = users(sequelize, DataTypes);
  const Courses = courses(sequelize, DataTypes);
  const CourseRegistrations = courseRegistrations(sequelize, DataTypes);
  const CompletedCourses = completedCourses(sequelize, DataTypes);
  const CourseTypes = courseTypes(sequelize, DataTypes);

  // Определение связей между таблицами
  // Например, если у курса есть преподаватель, то добавляем связь между таблицами Courses и Users
  Courses.belongsTo(Users, { foreignKey: 'instructor_id' });
  Users.hasMany(Courses, { foreignKey: 'instructor_id' });

  // Связи для таблицы CourseRegistrations
  CourseRegistrations.belongsTo(Users, { foreignKey: 'user_id' });
  Users.hasMany(CourseRegistrations, { foreignKey: 'user_id' });
  CourseRegistrations.belongsTo(Courses, { foreignKey: 'course_id' });
  Courses.hasMany(CourseRegistrations, { foreignKey: 'course_id' });

  // Связи для таблицы CompletedCourses
  CompletedCourses.belongsTo(Users, { foreignKey: 'user_id' });
  Users.hasMany(CompletedCourses, { foreignKey: 'user_id' });
  CompletedCourses.belongsTo(Courses, { foreignKey: 'course_id' });
  Courses.hasMany(CompletedCourses, { foreignKey: 'course_id' });

  // Связи для таблицы Courses и CourseTypes
  Courses.belongsTo(CourseTypes, { foreignKey: 'course_type_id' });
  CourseTypes.hasMany(Courses, { foreignKey: 'course_type_id' });

  return {
    Users,
    Courses,
    CourseRegistrations,
    CompletedCourses,
    CourseTypes
  };
}

module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
