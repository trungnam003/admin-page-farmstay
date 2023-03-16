'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('equipments', {
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
      name_en: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      slug_en: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      rent_cost: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
      },
      quantity: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true
      },
      total_used: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0
      },
      images: {
        type: Sequelize.JSON,
        allowNull: true
      },
      category_id:{
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
          model: 'categories',
          key: 'id'
        },
        onDelete: "SET NULL",
        onUpdate: "SET NULL"
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
    await queryInterface.dropTable('equipments');
  }
};