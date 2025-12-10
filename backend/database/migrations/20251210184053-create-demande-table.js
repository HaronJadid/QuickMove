// backend/database/migrations/[timestamp]-create-demande-table.js
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('demandes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'En attente',
      },
      dateDepartExacte: {
        type: Sequelize.DATE, // Utilisez DATE pour inclure l'heure
        allowNull: true,
      },
      dateArriveeExacte: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      prix: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      comment: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      
      // Clé étrangère 1: Ville de départ
      ville_depart_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'villes',
          key: 'id_ville',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT', // Une demande ne doit pas être supprimée si sa ville existe
      },
      
      // Clé étrangère 2: Ville d'arrivée
      ville_arrivee_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'villes',
          key: 'id_ville',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      
      // Clé étrangère 3: Véhicule utilisé
      vehicule_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'vehicules',
          key: 'id_vehicule',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL', // Si le véhicule est retiré du système, on garde la demande
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
    await queryInterface.dropTable('demandes');
  }
};