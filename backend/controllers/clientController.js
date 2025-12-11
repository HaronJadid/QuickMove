// On pointe vers le dossier models pour récupérer l'instance initialisée
const { User } = require("../database/models"); 

exports.Register = async (req, res) => {
    // Il faut récupérer TOUS les champs obligatoires définis dans ton modèle
    const { nom, prenom,email,password } = req.body;

    try {
        const result = await User.create({ // "create" en minuscule
            nom,
            prenom,
            email,
            password
            
        });
        
        // On renvoie un objet JSON propre
        res.status(201).json({
            message: "User has been created",
            user: result
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
}