'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('evaluations', 'demande_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'demandes',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('evaluations', 'demande_id');
  }
};
