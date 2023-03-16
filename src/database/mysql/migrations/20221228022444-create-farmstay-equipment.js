'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('farmstay_equipments', {
      id: {
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true
      },
      farm_id: {
        
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
        
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references:{
          model: 'equipments',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      area_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references:{
          model: 'farmstay_areas',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      have_data:{
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      number_of_field:{
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 1
      },

    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('farmstay_equipments');
  }
};