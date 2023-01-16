'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED
      },
      username: {
        type: Sequelize.STRING(24),
        allowNull: false,
        unique: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      hashed_password: {
        type: Sequelize.CHAR(64),
        allowNull: false,
      },
      phone:{
        type: Sequelize.STRING(15),
        allowNull: true,
        unique: true
      },
      gender:{
        type: Sequelize.ENUM('male', 'female', 'orther'),
        allowNull: true,
      },
      is_active:{
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      group_id:{
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
          model: 'groups',
          key: 'id'
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      },
      user_type: {
        type: Sequelize.ENUM('customer', 'employee'),
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
    await queryInterface.dropTable('users');
  }
};