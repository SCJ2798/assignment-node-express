'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of DataTypes lifecycle.
     * The `models/index` file will call this method automatically.
     */
  }
  User.init({
    uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      defaultValue:DataTypes.UUIDV4
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue:"",
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue:"",
    },
    email: {
      type: DataTypes.STRING,
      unique:true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(512),
      allowNull: false,
    },
    auth_token: {
      type: DataTypes.STRING(640),
      defaultValue:"",
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull:false,
      defaultValue:0
    },
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};