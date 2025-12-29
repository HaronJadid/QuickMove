// database/config/cli_config.js
require('dotenv').config(); // Charge le .env

module.exports = {
  development: {
    use_env_variable: 'DATABASE_URL', // Utilise ta variable Neon
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // Requis pour Neon
      }
    }
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};