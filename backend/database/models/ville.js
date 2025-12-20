// backend/database/models/ville.js
'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Ville extends Model {
    /**
     * Méthode pour définir les associations.
     */
    static associate(models) {
      // 1. Ville - Livreur (N,N via LivreurVille)
        models.Ville.belongsToMany(models.Livreur, {
          through: 'LivreurVilles',
          foreignKey: 'ville_id',
          as: 'livreursDesservant'
        });
      
      // 2. Ville - Demande (Deux relations 1,N pour Départ et Arrivée)
      
      // A) Ville comme Lieu de DÉPART (1 Ville est le départ de N Demandes)
      models.Ville.hasMany(models.Demande, {
          foreignKey: 'ville_depart_id', 
          as: 'demandesDepart'
      });

      // B) Ville comme Lieu d'ARRIVÉE (1 Ville est l'arrivée de N Demandes)
      models.Ville.hasMany(models.Demande, {
          foreignKey: 'ville_arrivee_id', 
          as: 'demandesArrivee'
      });
    }
  }

  Ville.init({
    id_ville: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    nom: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  }, {
    sequelize,
    modelName: 'Ville',
    tableName: 'villes', 
    timestamps: true,
  });

  return Ville;
};