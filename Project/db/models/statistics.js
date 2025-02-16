module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'UserStatistics', 
    {
      statistic_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      course_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status_id: {  // 1 - inproc, 2 - faild, 3 - passed
        type: DataTypes.INTEGER, 
        allowNull: false,
      },
      start_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      end_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      percent_success: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      course_status: { 
        type: DataTypes.INTEGER, // 0 - locked, 1 - available
        allowNull: false,
        defaultValue: 1, 
      },
      unblock_data: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'UserStatistics',
      timestamps: false, 
    }
  );
};