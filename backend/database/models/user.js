// backend/database/models/user.js
'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Les associations seront définies ici plus tard,
      // notamment les relations d'héritage vers Client et Livreur.
      models.User.hasOne(models.Client, { 
          foreignKey: 'id_client',
          as: 'clientProfile',
          onDelete: 'CASCADE' 
      });
      models.User.hasOne(models.Livreur, { 
          foreignKey: 'id_livreur',
          as: 'livreurProfile',
          onDelete: 'CASCADE' 
      });
    }
  }

  User.init({
    // L'ID est souvent géré par défaut par Sequelize, mais nous le définissons explicitement pour la clarté.
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    nom: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    prenom: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // L'e-mail doit être unique
    },
    password: {
      type: DataTypes.STRING, // Stockera le hash du mot de passe
      allowNull: false,
    },
    imgUrl: { // Conversion de img_url en camelCase pour la convention JS/Sequelize
      type: DataTypes.STRING,
    },
    numero: {
      type: DataTypes.STRING,
    },
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users', // Nom de la table dans la base de données
    timestamps: true, // Ajoute createdAt et updatedAt
  });

  return User;
};