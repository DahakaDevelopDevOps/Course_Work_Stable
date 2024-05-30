module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Answers', {
      answer_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      test_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      answer_text: {
        type: DataTypes.STRING,
        allowNull: false
      },
      is_correct: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      }
    }, {
      sequelize,
      tableName: 'Answers',
      timestamps: false
    });
  };
  