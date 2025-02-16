const { text } = require("express");

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Materails', {
      material_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      course_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      range: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      text: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }, {
      sequelize,
      tableName: 'Materials',
      timestamps: false
    });
  };
  