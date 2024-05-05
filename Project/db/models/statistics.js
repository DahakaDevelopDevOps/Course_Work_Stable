module.exports = function(sequelize, DataTypes) {
    return sequelize.define('UserStatistics ', {
      statistic_id: {
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
      status_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      start_date: {
        type: DataTypes.DATE,
        allowNull: false
      },
      end_date: {
        type: DataTypes.DATE,
        allowNull: true
      },
    }, {
      sequelize,
      tableName: 'UserStatistics',
      timestamps: false
    });
  };
  