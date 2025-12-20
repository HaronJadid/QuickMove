'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // 1. Create Users (10 Clients, 10 Livreurs)
        const users = [];
        const passwordHash = await bcrypt.hash('password123', 10);
        const now = new Date();

        // 10 Clients
        for (let i = 1; i <= 10; i++) {
            users.push({
                nom: `ClientNom${i}`,
                prenom: `ClientPrenom${i}`,
                email: `client${i}@example.com`,
                password: passwordHash,
                numero: `06000000${i < 10 ? '0' + i : i}`,

                role: 'client',
                createdAt: now,
                updatedAt: now
            });
        }

        // 10 Livreurs
        for (let i = 1; i <= 10; i++) {
            users.push({
                nom: `LivreurNom${i}`,
                prenom: `LivreurPrenom${i}`,
                email: `livreur${i}@example.com`,
                password: passwordHash,
                numero: `07000000${i < 10 ? '0' + i : i}`,

                role: 'driver',
                createdAt: now,
                updatedAt: now
            });
        }

        await queryInterface.bulkInsert('users', users, {});

        // Get inserted users to map FKs
        const dbUsers = await queryInterface.sequelize.query(
            `SELECT id, email, role FROM users;`,
            { type: queryInterface.sequelize.QueryTypes.SELECT }
        );

        const clients = dbUsers.filter(u => u.role === 'client');
        const livreurs = dbUsers.filter(u => u.role === 'driver');

        // 2. Create Clients and Livreurs profiles
        const clientData = clients.map(u => ({
            id_client: u.id,
            createdAt: now,
            updatedAt: now
        }));
        await queryInterface.bulkInsert('clients', clientData, {});

        const livreurData = livreurs.map((u, idx) => ({
            id_livreur: u.id,
            cin: `CIN${1000 + idx}`,
            about: `Je suis le livreur ${u.id}`,
            createdAt: now,
            updatedAt: now
        }));
        await queryInterface.bulkInsert('livreurs', livreurData, {});

        // 3. Create Villes (5 cities)
        // ... (existing code for Villes)
        const villes = [
            { nom: 'Casablanca', createdAt: now, updatedAt: now },
            { nom: 'Rabat', createdAt: now, updatedAt: now },
            { nom: 'Marrakech', createdAt: now, updatedAt: now },
            { nom: 'Tanger', createdAt: now, updatedAt: now },
            { nom: 'Fès', createdAt: now, updatedAt: now }
        ];
        await queryInterface.bulkInsert('villes', villes, {});

        const dbVilles = await queryInterface.sequelize.query(
            `SELECT id_ville, nom FROM villes;`,
            { type: queryInterface.sequelize.QueryTypes.SELECT }
        );

        // Assign Livreurs to Villes (LivreurVilles)
        for (const livreur of livreurs) {
            // Assign random city to livreur
            const city = dbVilles[Math.floor(Math.random() * dbVilles.length)];
            await queryInterface.sequelize.query(
                `INSERT INTO "LivreurVilles" ("livreur_id", "ville_id", "createdAt", "updatedAt") VALUES (${livreur.id}, ${city.id_ville}, '${now.toISOString()}', '${now.toISOString()}');`
            );
        }

        // 4. Create Vehicules (10 vehicles, one per livreur)
        const vehicules = livreurs.map((l, idx) => ({
            nom: `Vehicule ${idx + 1}`,
            capacite: 100 + (idx * 50),
            livreur_id: l.id,
            createdAt: now,
            updatedAt: now
        }));
        await queryInterface.bulkInsert('vehicules', vehicules, {});

        const dbVehicules = await queryInterface.sequelize.query(
            `SELECT id_vehicule, livreur_id FROM vehicules;`,
            { type: queryInterface.sequelize.QueryTypes.SELECT }
        );

        // 5. Create Demandes (20 demands)
        const demandes = [];
        const validStatuses = ['PENDING', 'CONFIRMED', 'COMPLETED'];
        // clientDemandes/livreurDemande map needs
        const clientDemandes = [];
        const livreurDemandes = [];

        for (let i = 0; i < 20; i++) {
            const client = clients[i % clients.length];
            const villeDepart = dbVilles[i % dbVilles.length];
            const villeArrivee = dbVilles[(i + 1) % dbVilles.length];
            const vehicule = dbVehicules[i % dbVehicules.length];
            const status = validStatuses[i % 3]; // Rotate statuses

            demandes.push({
                status: status,
                dateDepartExacte: new Date(now.getTime() + (i * 86400000)), // + i days
                prix: 100 + (i * 20),
                ville_depart_id: villeDepart.id_ville,
                ville_arrivee_id: villeArrivee.id_ville,
                vehicule_id: vehicule.id_vehicule,
                createdAt: now,
                updatedAt: now,
                // We need to fetch ID to insert into join tables, but simple insert doesn't return IDs easily in bulk without returning: true (postgres)
                // For simplicity in seeders without raw returning, we loop insert or assume IDs if auto-increment is predictable (risky).
                // Better: Insert individually or re-query.
            });
        }

        // Using loop for Demandes to capture IDs for relationships
        for (let i = 0; i < 20; i++) {
            const client = clients[i % clients.length];
            const vehicule = dbVehicules[i % dbVehicules.length];
            const status = validStatuses[i % 3];
            const d = demandes[i];

            // Insert Demande
            const [id] = await queryInterface.sequelize.query(
                `INSERT INTO demandes (status, "dateDepartExacte", prix, ville_depart_id, ville_arrivee_id, vehicule_id, "createdAt", "updatedAt") 
              VALUES ('${d.status}', '${d.dateDepartExacte.toISOString()}', ${d.prix}, ${d.ville_depart_id}, ${d.ville_arrivee_id}, ${d.vehicule_id}, '${now.toISOString()}', '${now.toISOString()}')
              RETURNING id;`,
                { type: queryInterface.sequelize.QueryTypes.INSERT }
            );
            // Note: result of INSERT with RETURNING in Sequelize raw query depends on dialect. 
            // Usually returns [[{ id: X }], count].
            const demandeId = id[0].id;

            // Insert ClientDemande
            await queryInterface.sequelize.query(
                `INSERT INTO "ClientDemandes" ("client_id", "demande_id", "createdAt", "updatedAt") VALUES (${client.id}, ${demandeId}, '${now.toISOString()}', '${now.toISOString()}');`
            );

            // Insert LivreurDemande
            await queryInterface.sequelize.query(
                `INSERT INTO "LivreurDemandes" ("livreur_id", "demande_id", "createdAt", "updatedAt") VALUES (${vehicule.livreur_id}, ${demandeId}, '${now.toISOString()}', '${now.toISOString()}');`
            );

            // 6. Create Evaluations (Only for COMPLETED trips)
            if (status === 'COMPLETED') {
                await queryInterface.bulkInsert('evaluations', [{
                    client_id: client.id,
                    livreur_id: vehicule.livreur_id,
                    rate: Math.floor(Math.random() * 5) + 1, // 1-5
                    comment: `Evaluation autogénérée pour la course ${demandeId}`,
                    date: now,
                    createdAt: now,
                    updatedAt: now
                }]);
            }
        }

    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('evaluations', null, {});
        await queryInterface.bulkDelete('LivreurDemandes', null, {});
        await queryInterface.bulkDelete('ClientDemandes', null, {});
        await queryInterface.bulkDelete('LivreurVilles', null, {});
        await queryInterface.bulkDelete('demandes', null, {});
        await queryInterface.bulkDelete('vehicules', null, {});
        await queryInterface.bulkDelete('villes', null, {});
        await queryInterface.bulkDelete('livreurs', null, {});
        await queryInterface.bulkDelete('clients', null, {});
        await queryInterface.bulkDelete('users', null, {});
    }
};
