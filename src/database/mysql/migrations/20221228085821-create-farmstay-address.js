'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('farmstay_addresses', {
      farm_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'farmstays',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      
      code_ward:{
        type: Sequelize.STRING(20),
        allowNull: false,
        references: {
          model: 'wards',
          key: "code",
        }
      },
      latitude:{
        type: Sequelize.DECIMAL(8,6),
        allowNull: true,
      },
      longitude:{
        type: Sequelize.DECIMAL(9,6),
        allowNull: true,
      },
      specific_address:{
        type: Sequelize.STRING(512),
        allowNull: false,
      },
      embedded_link:{
        type: Sequelize.STRING(2048),
        allowNull: false,
      },
      link:{
        type: Sequelize.STRING(512),
        allowNull: false,
      }
      
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('farmstay_addresses');
  }
};