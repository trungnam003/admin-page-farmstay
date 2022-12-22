'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('administrative_regions', {
      id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      name:{
        type: Sequelize.STRING,
        allowNull: false,
      },
      name_en:{
        type: Sequelize.STRING,
        allowNull: false,
      },
      code_name:{
        type: Sequelize.STRING,
        allowNull: false,
      },
      code_name_en:{
        type: Sequelize.STRING,
        allowNull: false,
      },
      
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('administrative_regions');
  }
};