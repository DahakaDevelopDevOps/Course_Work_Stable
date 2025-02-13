const { initModels } = require('../models/initModels');
const { Sequelize } = require("sequelize");

const connection = new Sequelize(
  process.env.DB_NAME || 'CourseWork',
  process.env.DB_USER || 'cw',
  process.env.DB_PASSWORD || '1111',
  {
      host: process.env.DB_HOST || 'db',
      dialect: 'mssql',
      port: process.env.DB_PORT || 1433,
      pool: {
          min: 0,
          max: 10,
      },
  }
);

const models = initModels(connection);

module.exports = { models, connection };

// Аутентификация подключения
connection
  .authenticate()
  .then(() => {
    console.log('Connection to the database has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// Синхронизация таблиц
connection.sync({ alter: true, force: true }) // Убедитесь, что { force: true } используется только при необходимости сброса данных.
  .then(() => {
    console.log('Database synchronized successfully.');
  })
  .catch(err => {
    console.error('Unable to synchronize the database:', err);
  });
