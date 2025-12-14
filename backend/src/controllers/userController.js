// backend/src/controllers/userController.js

const db = require('../../database/models'); 

// ... (code existant pour getUserById)

exports.getUserById = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await db.User.findByPk(userId, {
      attributes: { exclude: ['password'] },
      include: [
        { model: db.Client, as: 'clientProfile', required: false },
        { model: db.Livreur, as: 'livreurProfile', required: false }
      ]
    });

    if (!user) return res.status(404).json({ message: `Utilisateur avec l'ID ${userId} non trouvé.` });

    return res.status(200).json({ message: 'Utilisateur récupéré avec succès.', user });
  } catch (error) {
    console.error('Erreur de récupération de l utilisateur:', error);
    return res.status(500).json({ message: 'Erreur serveur.', details: error.message });
  }
};
