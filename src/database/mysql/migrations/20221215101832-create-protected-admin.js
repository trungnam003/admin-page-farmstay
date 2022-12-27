'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('protected_admins', {
      admin_id: {
        type: 'BINARY(16)',
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'admin_users',
          key: 'user_id'
        },
      },
      is_super_admin: {
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
    await queryInterface.dropTable('protected_admins');
  }
};