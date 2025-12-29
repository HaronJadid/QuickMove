const { Evaluation, Livreur, Demande, Client } = require('../database/models');

module.exports = {
    // Create a new evaluation
    async createEvaluation(req, res) {
        try {
            const { rate, comment, livreur_id, demande_id } = req.body;
            // Get client_id from the authenticated user (attached by authMiddleware)
            const client_id = req.user ? req.user.roleId : null;

            // Basic validation
            if (!rate || rate < 1 || rate > 5) {
                return res.status(400).json({ error: 'Rating must be between 1 and 5' });
            }
            if (!livreur_id) {
                return res.status(400).json({ error: 'Livreur ID is required' });
            }
            if (!demande_id) {
                return res.status(400).json({ error: 'Demande ID is required' });
            }
            if (!client_id) {
                return res.status(403).json({ error: 'Unauthorized: Only clients can submit ratings.' });
            }

            // Verify existence (Optional but good practice)
            const demande = await Demande.findByPk(demande_id);
            if (!demande) {
                return res.status(404).json({ error: 'Demande not found' });
            }

            // Check if already rated? (Optional business logic, skipping for now as per plan constraints)

            const evaluation = await Evaluation.create({
                rate,
                comment,
                livreur_id,
                client_id,
                demande_id
            });

            res.status(201).json(evaluation);
        } catch (error) {
            console.error('Error creating evaluation:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    // Get evaluations for a specific driver
    async getDriverEvaluations(req, res) {
        try {
            const { livreurId } = req.params;

            const evaluations = await Evaluation.findAll({
                where: { livreur_id: livreurId },
                include: [
                    { model: Client, as: 'evaluateur', attributes: ['id_client', 'createdAt'] } // Limit attributes for privacy if needed
                ],
                order: [['createdAt', 'DESC']]
            });

            res.json(evaluations);
        } catch (error) {
            console.error('Error fetching driver evaluations:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};
