module.exports = function(sequelize, DataTypes) {
    return sequelize.define('CompletedCourses', {
      completion_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      course_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      completion_date: {
        type: DataTypes.DATE,
        allowNull: false
      }
    }, {
      sequelize,
      tableName: 'CompletedCourses',
      timestamps: false
    });
  };
  