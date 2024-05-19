module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Video', {
      video_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      course_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      video_content: {
        type: DataTypes.BLOB('long'),
        allowNull: false
      },
      video_description: {
        type: DataTypes.STRING,
        allowNull: true
      }
    }, {
      sequelize,
      tableName: 'Videos',
      timestamps: false
    });
  };
  