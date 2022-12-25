'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('wards', {
      code:{
        type: Sequelize.STRING(20),
        primaryKey: true,
        allowNull: false,
      },
      name  :{
        type: Sequelize.STRING,
        allowNull: false,
      },
      name_en  :{
        type: Sequelize.STRING,
        allowNull: false,
      },
      full_name :{
        type: Sequelize.STRING,
        allowNull: false,
      },
      full_name_en :{
        type: Sequelize.STRING,
        allowNull: false,
      },
      code_name:{
        type: Sequelize.STRING,
        allowNull: false,
      },
      administrative_unit_id:{
        type: Sequelize.INTEGER,
        allowNull: true,
        references:{
          model: 'administrative_units',
          key: 'id'
        }
      },
      district_code :{
        type: Sequelize.STRING(20),
        allowNull: true,
        references:{
          model: 'districts',
          key: 'code'
        }
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('wards');
  }
};