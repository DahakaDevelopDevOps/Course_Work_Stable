module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Users', {
      ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      Login: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      Role: {
        type: DataTypes.INTEGER 
      },
      Password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      Email: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      SessionId: {
        type: DataTypes.INTEGER, // Предполагается, что идентификатор сессии - строка
        allowNull: true // Может быть пустым, если пользователь не авторизован
      }
    }, {
      sequelize,
      tableName: 'Users',
      timestamps: false
    });
  };
  