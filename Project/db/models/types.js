module.exports = function(sequelize, DataTypes) {
    return sequelize.define('CourseTypes', {
      type_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      type_name: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      description: {
        type: DataTypes.STRING(500)
      },
      other_details: {
        type: DataTypes.STRING(1000)
      }
    }, {
      sequelize,
      tableName: 'CourseTypes',
      timestamps: false
    });
  };
  