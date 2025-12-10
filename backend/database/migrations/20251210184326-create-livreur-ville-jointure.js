// backend/database/migrations/[timestamp]-create-livreur-ville-jointure.js
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('LivreurVilles', { // Nom par défaut de la table de jointure dans Sequelize
      // Pas de PK auto-incrémentée, la clé primaire est la combinaison des deux FK
      
      livreur_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'livreurs',
          key: 'id_livreur',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      ville_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'villes',
          key: 'id_ville',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('LivreurVilles');
  }
};