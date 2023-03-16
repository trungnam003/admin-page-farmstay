'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('invoices', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED
      },
      rented_farmstay_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        unique: true,
        references:{
          model: 'rent_farmstays',
          key: 'id'
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      },
      canceled_at: {
        allowNull: false,
        type: Sequelize.DATEONLY
      },
      total_rental_cost: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,

      },
      total_equipment_rental_cost:{
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
      },
      total_farmstay_rental_cost:{
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
      },
      paid:{
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
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
    await queryInterface.dropTable('invoices');
  }
};