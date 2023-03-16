'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('farmstay_equipment_details', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      field_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      mqtt_topic: {
        type: Sequelize.STRING,
        allowNull: true
      },
      
      farmstay_equipment_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references:{
          model: 'farmstay_equipments',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('farmstay_equipment_details');
  }
};