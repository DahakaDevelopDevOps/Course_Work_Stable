const users = require("./users");
const courses = require("./courses");
// const status = require("./status");
const statistics = require("./statistics");
const courseTypes = require("./types");
const videos = require("./videos");
const tasks = require("./tasks");
const answers = require("./answers");
const materials = require("./materials");


const { DataTypes } = require('sequelize');

function initModels(sequelize) {
  const Users = users(sequelize, DataTypes);
  const Courses = courses(sequelize, DataTypes);
  // const Status = status(sequelize, DataTypes);
  const Statistics = statistics(sequelize, DataTypes);
  const CourseTypes = courseTypes(sequelize, DataTypes);
  const Videos = videos(sequelize, DataTypes);
  const Tasks= tasks(sequelize, DataTypes);
  const Answers = answers(sequelize, DataTypes);
  const Materials = materials(sequelize, DataTypes);

  Statistics.belongsTo(Users, { foreignKey: 'user_id', onDelete: 'CASCADE' });
  Users.hasMany(Statistics, { foreignKey: 'user_id', onDelete: 'CASCADE' });
  Statistics.belongsTo(Courses, { foreignKey: 'course_id', onDelete: 'CASCADE' });
  Courses.hasMany(Statistics, { foreignKey: 'course_id', onDelete: 'CASCADE' });
  // Statistics.belongsTo(Status, { foreignKey: 'status_id', onDelete: 'CASCADE' });
  // Status.hasMany(Statistics, { foreignKey: 'status_id', onDelete: 'CASCADE' });


  Courses.belongsTo(CourseTypes, { foreignKey: 'course_type_id', onDelete: 'CASCADE' });
  CourseTypes.hasMany(Courses, { foreignKey: 'course_type_id', onDelete: 'CASCADE' });

  Videos.belongsTo(Courses, { foreignKey: 'course_id', onDelete: 'CASCADE' });
  Courses.hasMany(Videos, { foreignKey: 'course_id', onDelete: 'CASCADE' });

  Tasks.belongsTo(Courses, { foreignKey: 'course_id', onDelete: 'CASCADE' });
  Courses.hasMany(Tasks, { foreignKey: 'course_id', onDelete: 'CASCADE' });

  Materials.belongsTo(Courses, { foreignKey: 'course_id', onDelete: 'CASCADE' });
  Courses.hasMany(Materials, { foreignKey: 'course_id', onDelete: 'CASCADE' });

  Answers.belongsTo(Tasks, { foreignKey: 'test_id', onDelete: 'CASCADE' });
  Tasks.hasMany(Answers, { foreignKey: 'test_id', onDelete: 'CASCADE' });

  return {
    Users,
    Courses,
    // Status,
    Statistics,
    CourseTypes,
    Videos,
    Tasks,
    Answers,
    Materials
  };
}

module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
