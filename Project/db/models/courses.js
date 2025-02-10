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
        type: DataTypes.FLOAT,
        allowNull: false
      },
      course_type_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      other_details: {
        type: DataTypes.STRING(1000)
      },
      questions_to_show: {
          type: DataTypes.INTEGER,
          defaultValue: 10 // По умолчанию 10 вопросов
      }
    }, {
      sequelize,
      tableName: 'Courses',
      timestamps: false
    });
  };
  
  function formatDate(timeString) {
    const date = new Date(timeString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}