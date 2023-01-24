'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('farmstay_equipments', {
      id:{
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      farm_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references:{
          model: 'farmstays',
          key: 'id',
          
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      equipment_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references:{
          model: 'equipments',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('farmstay_equipments');
  }
};