'use strict';


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('employees', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED
      },
      fullname: {
        type: Sequelize.STRING,
        allowNull: false
      },
      user_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        unique: true,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      // district_code:{
      //   type: Sequelize.STRING(20),
      //   allowNull: true,
      //   references:{
      //     model: 'districts',
      //     key: 'code'
      //   }
      // },

      
      job_id: {
        allowNull: true,
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: 'jobs',
          key: 'id'
        },
        onDelete: "SET NULL",
        onUpdate: "CASCADE"
      },
      // farm_id: {
      //   allowNull: true,
      //   type: Sequelize.INTEGER.UNSIGNED,
      //   references: {
      //     model: 'farmstays',
      //     key: 'id'
      //   },
      //   onDelete: "SET NULL",
      //   onUpdate: "CASCADE"
      // },
      // manager_id: {
      //   allowNull: true,
      //   type: Sequelize.INTEGER.UNSIGNED,
      //   references: {
      //     model: 'employees',
      //     key: 'id',
      //   },
      //   onDelete: "SET NULL",
      //   onUpdate: "CASCADE"
      // },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('employees');
  }
};