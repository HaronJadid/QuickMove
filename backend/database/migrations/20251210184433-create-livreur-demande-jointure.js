// backend/database/migrations/[timestamp]-create-livreur-demande-jointure.js
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('LivreurDemandes', {
      
      livreur_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'livreurs', // Fait référence à la table Livreur
          key: 'id_livreur', // Clé primaire de la table Livreur
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE', // Si le livreur est supprimé, la relation est supprimée
      },
      demande_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'demandes', // Fait référence à la table Demande
          key: 'id', // Clé primaire de la table Demande
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE', // Si la demande est supprimée, la relation est supprimée
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
    await queryInterface.dropTable('LivreurDemandes');
  }
};