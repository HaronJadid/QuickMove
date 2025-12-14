// backend/database/models/livreur.js
'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Livreur extends Model {
    /**
     * Méthode pour définir les associations.
     */
    static associate(models) {
      // 1. Relation d'Héritage (Un Livreur appartient à un seul User)
      models.Livreur.belongsTo(models.User, { 
          foreignKey: 'id_livreur', 
          onDelete: 'CASCADE' 
      });

      // 2. Livreur - Vehicule (1,N)
      // Un Livreur peut posséder ou utiliser plusieurs Véhicules
      models.Livreur.hasMany(models.Vehicule, { 
          foreignKey: 'livreur_id', 
          as: 'vehicules' 
      });

      // 3. Livreur - Ville (N,N via LivreurVille)
      // Un Livreur peut exister (servir) dans plusieurs Villes
        models.Livreur.belongsToMany(models.Ville, {
          through: 'LivreurVilles',
          foreignKey: 'livreur_id',
          as: 'zonesService'
        });
      
      // 4. Livreur - Evaluation (1,N)
      // Un Livreur reçoit plusieurs Évaluations
      models.Livreur.hasMany(models.Evaluation, { 
          foreignKey: 'livreur_id', 
          as: 'evaluationsRecues' 
      });

      // 5. Livreur - Demande (N,N via LivreurDemande)
      // Un Livreur peut prendre en charge plusieurs Demandes
       models.Livreur.belongsToMany(models.Demande, {
          through: 'LivreurDemande',
          foreignKey: 'livreur_id',
          as: 'demandesEnCours'
      });
    }
  }

  Livreur.init({
    // PK et FK vers la table 'users'
    id_livreur: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    cin: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Le numéro de CIN doit être unique
    },
    about: {
      type: DataTypes.TEXT, // Pour une description ou biographie plus longue
    },
  }, {
    sequelize,
    modelName: 'Livreur',
    tableName: 'livreurs', 
    timestamps: true,
  });

  return Livreur;
};