// backend/database/models/evaluation.js
'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Evaluation extends Model {
    /**
     * Méthode pour définir les associations.
     */
    static associate(models) {
      // 1. Evaluation - Client (N Evaluations appartiennent à 1 Client)
      models.Evaluation.belongsTo(models.Client, {
          foreignKey: 'client_id', // Qui a fait l'évaluation
          as: 'evaluateur',
          onDelete: 'SET NULL' 
      });

      // 2. Evaluation - Livreur (N Evaluations concernent 1 Livreur)
      models.Evaluation.belongsTo(models.Livreur, {
          foreignKey: 'livreur_id', // Qui est évalué
          as: 'evalue',
          onDelete: 'CASCADE' // Si le Livreur est supprimé, ses évaluations sont supprimées
      });
      
      // OPTIONNEL : Souvent, une évaluation est liée à une Demande spécifique
      // Si c'est le cas, vous devriez ajouter une FK `demande_id` ici et la relation dans Demande et Evaluation.
      // models.Evaluation.belongsTo(models.Demande, { foreignKey: 'demande_id' });
    }
  }

  Evaluation.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE, // Date et heure de l'évaluation
      allowNull: false,
      defaultValue: DataTypes.NOW, // Par défaut, la date/heure actuelle
    },
    rate: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1, // Par exemple, une note minimale de 1
        max: 5  // Par exemple, une note maximale de 5
      }
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true, // Le commentaire est facultatif
    },
    
    // --- Clés Étrangères ---
    
    client_id: { 
        type: DataTypes.INTEGER,
        allowNull: true, // Peut être NULL si le client est supprimé (SET NULL en onDelete)
        references: {
            model: 'clients',
            key: 'id_client', 
        }
    },
    livreur_id: { 
        type: DataTypes.INTEGER,
        allowNull: false, // Une évaluation doit toujours concerner un livreur
        references: {
            model: 'livreurs',
            key: 'id_livreur', 
        }
    },
    
  }, {
    sequelize,
    modelName: 'Evaluation',
    tableName: 'evaluations',
    timestamps: true,
  });

  return Evaluation;
};