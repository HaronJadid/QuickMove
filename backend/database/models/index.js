// backend/database/models/index.js
'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';

// 1. Attention ici : on pointe vers le bon fichier de config
// Si tu utilises cli_config.js, assure-toi qu'il exporte bien la config pour le serveur aussi
// OU utilise ton fichier config.js original s'il existe toujours
const config = require(__dirname + '/../config/config_cli.js')[env]; 
// OU si tu as gardé l'ancien : require(__dirname + '/../config/config.js')[env];

const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// 2. Chargement dynamique des modèles
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    // Importation du modèle
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    // On stocke le modèle dans db sous son nom (ex: db.User)
    db[model.name] = model;
  });

// 3. Gestion des associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;