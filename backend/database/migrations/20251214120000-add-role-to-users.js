"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add enum column 'role' to users table
    await queryInterface.addColumn('users', 'role', {
      type: Sequelize.ENUM('client', 'driver'),
      allowNull: false,
      defaultValue: 'client'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'role');
    // drop enum type if using Postgres
    if (queryInterface.sequelize.getDialect() === 'postgres') {
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_users_role";');
    }
  }
};
