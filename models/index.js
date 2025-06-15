'use strict';
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
// const env = process.env.NODE_ENV || 'development';
// const config = require(__dirname + '/../config/config.json')[env];
const db = {};

const config = {
  "username": process.env.DB_USER_NAME,
  "password": process.env.DB_USER_PASSWORD,
  "database": process.env.DB_NAME,
  "host": process.env.DB_HOST,
  "dialect": process.env.DB_DIALECT,
  "port":process.env.DB_PORT
};

  let sequelize = new Sequelize(config.database, config.username, config.password, {
    host:config.host,
    port:config.port,
    pool: {
      max: 12,
      min: 0,
      acquire: 3000,
      idle: 10000
    },
    retry: {
      match: [/Deadlock/i, Sequelize.ConnectionError], // Retry on connection errors
      max: 3, // Maximum retry 3 times
      backoffBase: 3000, // Initial backoff duration in ms. Default: 100,
      backoffExponent: 1.5, // Exponent to increase backoff each try. Default: 1.1
    },
    dialect:config.dialect
  });

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
