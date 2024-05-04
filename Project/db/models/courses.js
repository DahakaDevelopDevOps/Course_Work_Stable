module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Courses', {
      course_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      course_name: {
        type: DataTypes.STRING(250),
        allowNull: false
      },
      description: {
        type: DataTypes.STRING(500)
      },
      duration: {
        type: DataTypes.TIME,
        allowNull: false
      },
      course_type_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      other_details: {
        type: DataTypes.STRING(1000)
      }
    }, {
      sequelize,
      tableName: 'Courses',
      timestamps: false
    });
  };
  