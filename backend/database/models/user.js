// backend/database/models/user.js
'use strict';
const bcrypt = require('bcryptjs');
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
    role: {
      type: DataTypes.ENUM('client', 'driver'),
      allowNull: false,
      defaultValue: 'client'
    },
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users', // Nom de la table dans la base de données
    timestamps: true, // Ajoute createdAt et updatedAt
    defaultScope: {
      attributes: { exclude: ['password'] }
    },
    hooks: {
      // Hash password before create/update
      beforeCreate: async (user, options) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user, options) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      // Après création d'un User, créer automatiquement le profil correspondant
      afterCreate: async (user, options) => {
        const models = sequelize.models;
        try {
          // Use the same transaction if provided so FK constraints succeed
          const txOptions = options && options.transaction ? { transaction: options.transaction } : {};

          if (user.role === 'driver') {
            const exists = await models.Livreur.findByPk(user.id, txOptions);
            if (!exists) {
              await models.Livreur.create({ id_livreur: user.id }, txOptions);
            }
          } else if (user.role === 'client') {
            const exists = await models.Client.findByPk(user.id, txOptions);
            if (!exists) {
              await models.Client.create({ id_client: user.id }, txOptions);
            }
          }
        } catch (err) {
          // Log error clearly so it's visible during registration failures
          console.error('User afterCreate hook error (could rollback transaction):', err);
          throw err; // rethrow so outer transaction can rollback
        }
      }
    }
  });

  return User;
};