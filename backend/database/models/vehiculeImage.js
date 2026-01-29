// backend/database/models/vehiculeImage.js
'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class VehiculeImage extends Model {
        static associate(models) {
            models.VehiculeImage.belongsTo(models.Vehicule, {
                foreignKey: 'vehicule_id',
                as: 'vehicule',
                onDelete: 'CASCADE'
            });
        }
    }

    VehiculeImage.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        url: {
            type: DataTypes.STRING,
            allowNull: false
        },
        vehicule_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'vehicules',
                key: 'id_vehicule'
            }
        }
    }, {
        sequelize,
        modelName: 'VehiculeImage',
        tableName: 'vehicule_images',
        timestamps: true
    });

    return VehiculeImage;
};
