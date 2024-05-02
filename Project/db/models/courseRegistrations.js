module.exports = function(sequelize, DataTypes) {
    return sequelize.define('CourseRegistrations', {
      registration_id: {
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
      registration_date: {
        type: DataTypes.DATE,
        allowNull: false
      }
    }, {
      sequelize,
      tableName: 'CourseRegistrations',
      timestamps: false
    });
  };
  