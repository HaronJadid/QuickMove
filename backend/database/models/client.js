// backend/database/models/client.js
'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Client extends Model {
    /**
     * Méthode pour définir les associations.
     */
    static associate(models) {
      // 1. Relation d'Héritage (Un Client appartient à un seul User)
      // Ceci est la contrepartie du User.hasOne(Client)
      models.Client.belongsTo(models.User, { 
          foreignKey: 'id_client', // La colonne qui lie à la table User
          onDelete: 'CASCADE' 
      });

      // 2. Relation avec Evaluation (Un Client fait plusieurs Evaluations)
      models.Client.hasMany(models.Evaluation, { 
          foreignKey: 'client_id', 
          as: 'evaluationsFaites' 
      });
      
      // 3. Relation avec Demande (Plusieurs-à-Plusieurs, si on suit le MCD strict)
      models.Client.belongsToMany(models.Demande, {
          through: 'ClientDemande',
          foreignKey: 'client_id',
          as: 'demandesFaites'
      });
    }
  }

  Client.init({
    // Cette colonne sert de PK et de FK vers la table 'users'
    id_client: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      // La référence est définie ici pour la clarté et la conformité aux schémas, 
      // mais la relation est souvent définie dans la méthode `associate`.
      // NOTE : Si vous n'utilisez pas de FK dans .init, il faudra s'assurer que l'association est faite dans associate.
    }
    // L'entité Client n'a pas d'autres attributs propres dans le diagramme.
  }, {
    sequelize,
    modelName: 'Client',
    tableName: 'clients', 
    timestamps: true,
  });

  return Client;
};