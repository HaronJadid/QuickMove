// backend/database/models/vehicule.js
'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Vehicule extends Model {
    /**
     * Méthode pour définir les associations.
     */
    static associate(models) {
      // Relation 1,N (Un Vehicule appartient à un seul Livreur)
      models.Vehicule.belongsTo(models.Livreur, { 
          foreignKey: 'livreur_id', // Clé étrangère dans cette table
          as: 'proprietaire',
          onDelete: 'SET NULL' // Si le livreur est supprimé, on garde le véhicule mais sans propriétaire
      });
    }
  }

  Vehicule.init({
    id_vehicule: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    nom: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imgUrl: { // image du véhicule
      type: DataTypes.STRING,
    },
    capacite: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    // Clé étrangère ajoutée pour la relation avec Livreur
    livreur_id: {
        type: DataTypes.INTEGER,
        allowNull: true, // Peut être NULL si le véhicule n'est pas encore attribué
        references: {
            model: 'livreurs',
            key: 'id_livreur', // Fait référence à la PK de la table livreurs
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL', 
    }
  }, {
    sequelize,
    modelName: 'Vehicule',
    tableName: 'vehicules', 
    timestamps: true,
  });

  return Vehicule;
};