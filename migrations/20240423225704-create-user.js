'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uuid: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
        defaultValue:Sequelize.UUIDV4
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue:"",
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue:"",
      },
      email: {
        type: Sequelize.STRING,
        unique:true,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING(512),
        allowNull: false,
      },
      auth_token: {
        type: Sequelize.STRING(640),
        defaultValue:"",
      },
      role: {
        type: Sequelize.INTEGER,
        allowNull:false,
        defaultValue:0
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};