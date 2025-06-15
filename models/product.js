'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Product.init({
    uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      defaultValue:DataTypes.UUIDV4
    },
    name: {
      type: DataTypes.STRING,
      allowNull:false,
    },
    price: {
      type: DataTypes.DOUBLE,
      allowNull:false,
    },
    quantity: {
      type: DataTypes.DOUBLE,
      allowNull:false,
      defaultValue:0.0
    },
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};