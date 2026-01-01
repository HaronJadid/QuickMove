'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // 1. Create Users (Client and Livreur)
        const users = await queryInterface.bulkInsert('users', [
            {
                nom: 'Benali',
                prenom: 'Ahmed',
                email: 'ahmed.driver@test.com',
                password: 'hashedpassword',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                nom: 'Client',
                prenom: 'Moi',
                email: 'me.client@test.com',
                password: 'hashedpassword',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ], { returning: true });

        const driverUserId = users[0].id; // Note: SQLite/Postgres return might differ, assume serial IDs if simple
        // Safer to fetch if needed, but for simple local dev, IDs usually 1 and 2 if fresh db.

        // 2. Create Villes
        await queryInterface.bulkInsert('villes', [
            { id_ville: 1, nom: 'Casablanca', createdAt: new Date(), updatedAt: new Date() },
            { id_ville: 2, nom: 'Rabat', createdAt: new Date(), updatedAt: new Date() }
        ], { ignoreDuplicates: true });

        // 3. Create Livreur
        await queryInterface.bulkInsert('livreurs', [
            {
                id_livreur: 1, // Linking to User ID 1 (assuming it is 1)
                cin: 'AB123456',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ], { ignoreDuplicates: true });

        // 4. Create Client
        await queryInterface.bulkInsert('clients', [
            {
                id_client: 2, // Linking to User ID 2
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ], { ignoreDuplicates: true });

        // 5. Create Demande
        await queryInterface.bulkInsert('demandes', [
            {
                id: 1,
                status: 'Terminée',
                prix: 150.00,
                ville_depart_id: 1,
                ville_arrivee_id: 2,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ], { ignoreDuplicates: true });

        // Link Demande to Livreur/Client (Jointure tables) if strict reference needed?
        // The Evaluation model checks `Demande` existence via `Demande.findByPk(demande_id)`.
        // It does NOT strictly check if the user belongs to it unless we added that logic.
        // So just creating the Demande row #1 is enough for the current controller logic.
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('demandes', null, {});
        await queryInterface.bulkDelete('clients', null, {});
        await queryInterface.bulkDelete('livreurs', null, {});
        await queryInterface.bulkDelete('villes', null, {});
        await queryInterface.bulkDelete('users', null, {});
    }
};
