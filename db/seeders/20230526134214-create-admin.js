'use strict';

const bcrypt = require("bcryptjs");
const { Role } = require("../../app/models");

const name = "admin"

module.exports = {
  async up (queryInterface, Sequelize) {
    const password = "123456";
    const encryptedPassword = bcrypt.hashSync(password, 10);
    const timestamp = new Date();

    const role = await Role.findOne({
      where: {
        name: "ADMIN",
      }
    })

    await queryInterface.bulkInsert('Users', [
      {
        name,
        email: `${name.toLowerCase()}@binar.co.id`,
        encryptedPassword,
        roleId: role.id, 
        createdAt: timestamp,
        updatedAt: timestamp,
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', { name: name }, {});
  }
};
