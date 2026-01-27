const { Evaluation, Livreur, Demande, Client } = require('../../database/models');

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
    },

    // Get latest evaluations for home page (Unique authors, max 6, random pick per author)
    async getLatestEvaluations(req, res) {
        try {
            // Fetch more than 6 to ensure we have enough unique authors if possible
            const evaluations = await Evaluation.findAll({
                limit: 50, // Reasonable buffer
                order: [['createdAt', 'DESC']],
                include: [
                    {
                        model: Client,
                        as: 'evaluateur',
                        include: [
                            {
                                model: require('../../database/models').User,
                                attributes: ['nom', 'prenom', 'imgUrl']
                            }
                        ]
                    }
                ]
            });

            // Group by Client ID
            const reviewsByClient = {};
            evaluations.forEach(ev => {
                const clientId = ev.client_id;
                if (!reviewsByClient[clientId]) {
                    reviewsByClient[clientId] = [];
                }
                reviewsByClient[clientId].push(ev);
            });

            // Pick one random review per client
            const uniqueReviews = [];
            Object.keys(reviewsByClient).forEach(clientId => {
                const clientReviews = reviewsByClient[clientId];
                const randomReview = clientReviews[Math.floor(Math.random() * clientReviews.length)];
                uniqueReviews.push(randomReview);
            });

            // If we have more than 6, slice the first 6 (or random 6 if preferred, but existing list is "latest" based so maybe latest unique is better, but user asked for random choice if client has multiple, which is done. user also said "display always six from difrent auther").
            // To ensure "always six", we need at least 6 unique clients. If not, we just return what we have.
            // Let's shuffle the unique list to make it look dynamic if that's desired, or just take the latest ones.
            // User: "display always six from difrent auther".
            const finalSelection = uniqueReviews.slice(0, 6);

            const formatted = finalSelection.map(ev => {
                const user = ev.evaluateur?.User;
                return {
                    id: ev.id,
                    rating: ev.rate,
                    text: ev.comment,
                    date: ev.createdAt,
                    name: user ? `${user.prenom} ${user.nom}` : 'Anonymous',
                    location: 'Morocco',
                    image: user?.imgUrl
                };
            });

            res.json(formatted);
        } catch (error) {
            console.error('Error fetching latest evaluations:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};
