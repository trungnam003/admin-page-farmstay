'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('attendance_employees', {
      id:{
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      employee_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'employees',
          key: 'id',
        },
        onDelete: "CASCADE",
        onUpdate: 'CASCADE'
      },
      time_start: {
        type: Sequelize.DATE,
        allowNull: false
      },
      time_end:{
        type: Sequelize.DATE,
        allowNull: false
      },
      
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('attendance_employees');
  }
};