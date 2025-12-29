"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Make 'cin' column nullable on 'livreurs' table
    await queryInterface.changeColumn('livreurs', 'cin', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert 'cin' to NOT NULL
    await queryInterface.changeColumn('livreurs', 'cin', {
      type: Sequelize.STRING,
      allowNull: false
    });
  }
};
