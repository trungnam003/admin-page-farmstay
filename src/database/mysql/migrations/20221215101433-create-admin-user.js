'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('admin_users', {
      user_id: {
        allowNull: false,
        primaryKey: true,
        type: 'binary(16)',
        // defaultValue: Sequelize.UUIDV4
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          is: {
            args: /^(?=[a-zA-Z0-9._]{8,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/,
            msg: "Username không hợp lệ"
          }
        },
        unique: true

      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isEmail: {
            args: true,
            msg: "Email không hợp lệ"
          }
        },
        unique: true
      },
      hashed_password: {
        allowNull: false,
        type: Sequelize.STRING
      },
      status: {
        type:Sequelize.STRING(16),
        defaultValue: 'pending'
      },
      is_active: {
        type:Sequelize.BOOLEAN,
        defaultValue: false
      },
      refesh_token: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      
      avatar_url:{
        type:Sequelize.STRING(512),
        allowNull: true
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
    await queryInterface.dropTable('admin_users');
  }
};