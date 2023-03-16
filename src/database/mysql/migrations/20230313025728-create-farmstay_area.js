'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('farmstay_areas', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      name_en:{
        type: Sequelize.STRING,
        defaultValue: 'farm',
        allowNull: false,
      },
      slug_en: {
        type: Sequelize.STRING,
        defaultValue: 'farm',
        allowNull: false,
      },
      
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('farmstay_areas');
  }
};