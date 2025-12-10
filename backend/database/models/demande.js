// backend/database/models/demande.js
'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Demande extends Model {
    /**
     * Méthode pour définir les associations.
     */
    static associate(models) {
      // 1. Demande - Ville (Lieu de Départ) : N Demandes appartiennent à 1 Ville
      models.Demande.belongsTo(models.Ville, {
          foreignKey: 'ville_depart_id',
          as: 'VilleDepart'
      });

      // 2. Demande - Ville (Lieu d'Arrivée) : N Demandes appartiennent à 1 Ville
      models.Demande.belongsTo(models.Ville, {
          foreignKey: 'ville_arrivee_id',
          as: 'VilleArrivee'
      });

      // 3. Demande - Client (N,N via ClientDemande) : Si 1 Client peut faire plusieurs demandes.
      models.Demande.belongsToMany(models.Client, {
          through: 'ClientDemande',
          foreignKey: 'demande_id',
          as: 'clients'
      });

      // 4. Demande - Livreur (N,N via LivreurDemande) : Si N Livreur(s) peuvent gérer N Demandes.
      models.Demande.belongsToMany(models.Livreur, {
          through: 'LivreurDemande',
          foreignKey: 'demande_id',
          as: 'livreurs'
      });
      
      // 5. Demande - Vehicule (N Demandes utilisent 1 Vehicule, à un instant T)
      models.Demande.belongsTo(models.Vehicule, {
          foreignKey: 'vehicule_id', // Clé étrangère vers le véhicule utilisé
          as: 'VehiculeUtilise'
      });
      
    }
  }

  Demande.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'En attente', // Statut par défaut
    },
    // Détails de l'heure et date exacte de la commande/livraison
    dateDepartExacte: { // Date et Heure exactes du départ
      type: DataTypes.DATE, // Combine date et heure
      allowNull: true, 
    },
    dateArriveeExacte: { // Date et Heure exactes de l'arrivée
      type: DataTypes.DATE,
      allowNull: true,
    },
    prix: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    comment: { // Commentaire général (optionnel)
      type: DataTypes.TEXT,
      allowNull: true, 
    },
    
    // --- Clés Étrangères ---
    
    ville_depart_id: { // Référence à la ville de départ
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'villes',
            key: 'id_ville', 
        }
    },
    ville_arrivee_id: { // Référence à la ville d'arrivée
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'villes',
            key: 'id_ville', 
        }
    },
    vehicule_id: { // Référence au véhicule affecté à cette demande
        type: DataTypes.INTEGER,
        allowNull: true, // Le véhicule peut être affecté après la création de la demande
        references: {
            model: 'vehicules',
            key: 'id_vehicule',
        }
    },
    
  }, {
    sequelize,
    modelName: 'Demande',
    tableName: 'demandes',
    timestamps: true,
  });

  return Demande;
};