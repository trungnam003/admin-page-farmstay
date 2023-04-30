'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('rent_farmstays', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED
      },
      farm_id: {
        allowNull: false,
        unique: true,
        type: Sequelize.INTEGER.UNSIGNED,
        references:{
          model: "farmstays",
          key: 'id',
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      },
      customer_id: {
        allowNull: false,
        unique: true,
        type: Sequelize.INTEGER.UNSIGNED,
        references:{
          model: "customers",
          key: 'id',
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      },
      rented_at: {
        allowNull: false,
        type: Sequelize.DATEONLY
      },
      deposit_amount: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.INTEGER
      },
      is_deposit: {
        allowNull: false,
        defaultValue: false,
        type: Sequelize.BOOLEAN
      },
      vnp_txnref:{
        allowNull: false,
        type: Sequelize.STRING
      },
      // expiration_date: {
      //   allowNull: false,
      //   type: Sequelize.DATEONLY
      // },
      // total_rental_cost: {
      //   type: Sequelize.INTEGER.UNSIGNED,
      //   allowNull: true,

      // },
      // total_sensor_rental_cost:{
      //   type: Sequelize.INTEGER.UNSIGNED,
      //   allowNull: true,
      // },
      // total_farmstay_rental_cost:{
      //   type: Sequelize.INTEGER.UNSIGNED,
      //   allowNull: true,
      // },
      // paid:{
      //   type: Sequelize.BOOLEAN,
      //   allowNull: false,
      //   defaultValue: false
      // },
      is_rented:{
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('rent_farmstays');
  }
};