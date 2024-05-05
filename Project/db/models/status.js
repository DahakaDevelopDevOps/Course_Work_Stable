module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Status', {
      status_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      status_name: {
        type: DataTypes.STRING(90), // пройден, в процессе, недоступен, доступен
        allowNull: false
      }
    }, {
      sequelize,
      tableName: 'Status',
      timestamps: false
    });
  };