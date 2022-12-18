'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('protectedAdmins', {
      adminId: {
        type: 'BINARY(16)',
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'AdminUsers',
          key: 'userId'
        },
        
        
      },
      isSuperAdmin: {
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
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('protectedAdmins');
  }
};