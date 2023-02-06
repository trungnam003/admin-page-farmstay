'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('farmstay_equipments', {
      farm_id: {
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references:{
          model: 'farmstays',
          key: 'id',
          
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      equipment_id: {
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references:{
          model: 'equipments',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      quantity_used:{
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('farmstay_equipments');
  }
};