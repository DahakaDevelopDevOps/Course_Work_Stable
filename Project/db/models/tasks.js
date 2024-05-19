module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Tasks', {
    test_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    course_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    question_text: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'Tasks',
    timestamps: false
  });
};
