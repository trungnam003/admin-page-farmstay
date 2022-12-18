'use strict';
const { Buffer } = require('node:buffer');
var uuid = require('uuid');
const uuidBuffer = require('uuid-buffer');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('AdminUsers', [{
        userId: Buffer.from(uuid.parse(uuid.v4(), Buffer.alloc(16)), Buffer.alloc(16)),
        username: 'nam1611',
        hashpassword: '123',
        email: 'thtntrungnam@gmail.com',
        token: 'abs',
        refeshToken: 'winnerX',
        createdAt: new Date(),
        updatedAt:  new Date(),
      }], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
